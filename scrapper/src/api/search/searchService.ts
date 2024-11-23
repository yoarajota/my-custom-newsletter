import { StatusCodes } from "http-status-codes"
import puppeteer, { Page } from "puppeteer"
import { z } from "zod"
import { ServiceResponse } from "@/common/models/serviceResponse"
import { commonValidations } from "@/common/utils/commonValidation"
import { handlePgBoss } from "@/common/utils/pgBoss"
import { createAdminClient } from "@/common/utils/supabase/server"
import getDrizzleDb from "@/db"
import { newslettersTopicFilesContents } from "@/db/schema"
import { logger } from "@/server"
export class SearchService {
  async searchTopic(newsletter_topic_id: string): Promise<ServiceResponse<string | null>> {
    try {
      handlePgBoss({
        queue: "search-topic",
        jobData: { newsletter_topic_id },
        callback: async ([job]) => {
          const db = getDrizzleDb()

          const { newsletter_topic_id } = job.data

          const newsLetterTopicRegister = await db.query.newslettersTopics.findFirst({
            where: (posts, { eq }) => eq(posts.id, newsletter_topic_id),
          })

          if (newsLetterTopicRegister) {
            const { se_description, name, summary } = newsLetterTopicRegister

            const browser = await puppeteer.launch()

            const page = await browser.newPage()

            // Navigate the page to a URL.
            await page.goto(`https://www.google.com/search?q=${se_description}&tbm=nws`)

            // await #search
            await page.waitForSelector("#search")

            const searchResult = await page.waitForFunction(() => {
              const links = Array.from(document.querySelectorAll("#search a"))

              return links.map((link) => link.getAttribute("href"))
            })

            // For now, get first 10 results
            // const urls = (await searchResult.jsonValue()).slice(0, 10)
            const urls = (await searchResult.jsonValue()).slice(0, 2)

            const pages: { url: string; page: Page }[] = []
            const promisesPages = []
            for (const url of urls) {
              if (url) {
                promisesPages.push(
                  browser.newPage().then(async (newPage) => {
                    await newPage.goto("https://www.smry.ai/" + url)
                    pages.push({
                      page: newPage,
                      url,
                    })
                  })
                )
              }
            }

            await Promise.all(promisesPages)

            const toStore: {
              url: string
              content: string
            }[] = []
            for (const { page, url } of pages) {
              // browser focus in the page
              await page.bringToFront()

              // get the page content
              // data-state="active"
              // data-orientation="horizontal"
              // get what is inside the div with data-state="active" and data-orientation="horizontal"

              await page.waitForSelector('div[data-state="active"][data-orientation="horizontal"]')

              const content = await page.evaluate(() => {
                const activeDiv = document.querySelector('div[data-state="active"][data-orientation="horizontal"]')

                return activeDiv?.textContent
              })

              if (content) {
                toStore.push({
                  url,
                  content,
                })
              }
            }

            if (toStore.length > 0) {
              const date = new Date()

              const contents = toStore.map((content) => ({
                newsletter_topic_id,
                url: content.url,
                content: content.content,
                created_at: date,
              }))

              await db.insert(newslettersTopicFilesContents).values(contents).onConflictDoNothing()

              handlePgBoss({
                queue: "generate-email",
                jobData: { newsletter_topic_id, date: date.toUTCString() },
                callback: async ([job]) => {
                  const supabase = createAdminClient()

                  const { error } = await supabase.functions.invoke("generate-topic-email", {
                    body: {
                      newsletter_topic_id: job.data.newsletter_topic_id,
                      date: job.data.date,
                    },
                  })

                  console.log(error)
                },
              })
            }

            await browser.close()
          }
        },
      })

      return ServiceResponse.success<string>("Search results found", "searchResults")
    } catch (ex) {
      const errorMessage = `Error searching for topic: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponse.failure(
        "An error occurred while searching for the topic.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }
}

export const SearchTopicContentSchema = z.object({
  body: z.object({
    newsletter_topic_id: commonValidations.string,
  }),
})

export const searchService = new SearchService()
