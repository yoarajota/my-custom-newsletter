import type { Request, RequestHandler, Response } from "express"

import { searchService } from "@/api/search/searchService"
import { handleServiceResponse } from "@/common/utils/httpHandlers"

class SearchController {
  public searchTopicContents: RequestHandler = async (req: Request, res: Response) => {
    const { name, se_description } = req.body

    const serviceResponse = await searchService.searchTopic(name, se_description)
    return handleServiceResponse(serviceResponse, res)
  }
}

export const searchController = new SearchController()
