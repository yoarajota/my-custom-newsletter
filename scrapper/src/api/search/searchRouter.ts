import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Request, type Response, type Router } from "express"
import { z } from "zod"

import { searchController } from "./searchController"
import { SearchTopicContentSchema } from "./searchService"
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import { ServiceResponse } from "@/common/models/serviceResponse"
import { handleServiceResponse, validateRequest } from "@/common/utils/httpHandlers"

export const searchRegistry = new OpenAPIRegistry()
export const searchRouter: Router = express.Router()

searchRouter.get("/", (_req: Request, res: Response) => {
  const serviceResponse = ServiceResponse.success("Service is healthy", null)

  return handleServiceResponse(serviceResponse, res)
})

searchRegistry.registerPath({
  method: "get",
  path: "/search-router",
  tags: ["Search Router"],
  responses: createApiResponse(z.null(), "Success"),
})

searchRouter.get("/topic-contents", validateRequest(SearchTopicContentSchema), searchController.searchTopicContents)
