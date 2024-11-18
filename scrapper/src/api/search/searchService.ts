import { StatusCodes } from "http-status-codes"

import puppeteer from "puppeteer"
import { z } from "zod"
import { ServiceResponse } from "@/common/models/serviceResponse"
import { commonValidations } from "@/common/utils/commonValidation"
import { logger } from "@/server"

export class SearchService {
  // Retrieves all users from the database
  // async findAll(): Promise<ServiceResponse<Search[] | null>> {
  //   try {
  //     const users = await this.userRepository.findAllAsync()
  //     if (!users || users.length === 0) {
  //       return ServiceResponse.failure("No Users found", null, StatusCodes.NOT_FOUND)
  //     }
  //     return ServiceResponse.success<Search[]>("Users found", users)
  //   } catch (ex) {
  //     const errorMessage = `Error finding all users: $${(ex as Error).message}`
  //     logger.error(errorMessage)
  //     return ServiceResponse.failure(
  //       "An error occurred while retrieving users.",
  //       null,
  //       StatusCodes.INTERNAL_SERVER_ERROR
  //     )
  //   }
  // }

  // Initialize the puppeteer service to scrape the web (google)
  async searchTopic(name: string, se_description: string): Promise<ServiceResponse<string | null>> {
    try {
      const browser = await puppeteer.launch({
        headless: false,
      })
      const page = await browser.newPage()

      // Navigate the page to a URL.
      await page.goto(`https://www.google.com/search?q=${se_description}&tbm=nws`)

      // if (!searchResults || searchResults.length === 0) {
      //   return ServiceResponse.failure("No search results found", null, StatusCodes.NOT_FOUND)
      // }

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
    name: commonValidations.string,
    se_description: commonValidations.string,
  }),
})

export const searchService = new SearchService()
