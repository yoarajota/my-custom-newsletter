import { StatusCodes } from "http-status-codes"
import puppeteer from "puppeteer"
import { z } from "zod"
import { ServiceResponse } from "@/common/models/serviceResponse"
import { commonValidations } from "@/common/utils/commonValidation"
import getDrizzleDb from "@/db"
import { logger } from "@/server"
export class SearchService {
  async searchTopic(newsletter_topic_id: string): Promise<ServiceResponse<string | null>> {
    const db = getDrizzleDb()

    try {
      const newsLetterTopicRegister = await db.query.newslettersTopics.findFirst({
        where: (posts, { eq }) => eq(posts.id, newsletter_topic_id),
      })

      if (newsLetterTopicRegister) {
        const { se_description, name, summary } = newsLetterTopicRegister

        const browser = await puppeteer.launch({
          headless: false,
        })

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
        const urls = (await searchResult.jsonValue()).slice(0, 10)

        const pages = []
        for (const url of urls) {
          if (url) {
            browser.newPage().then(async (newPage) => {
              await newPage.goto(url)
              pages.push(newPage)
            })
          }
        }
      }

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
