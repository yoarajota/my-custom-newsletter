import type { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import type { ZodError, ZodSchema } from "zod"

import { ServiceResponse } from "@/common/models/serviceResponse"
import { logger } from "@/server"

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse)
}

export const validateRequest = (schema?: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.headers["x-service-token"] !== process.env.MICRO_SERVICE_TOKEN) {
      const errorMessage = "Invalid service token"
      const statusCode = StatusCodes.UNAUTHORIZED
      const serviceResponse = ServiceResponse.failure(errorMessage, null, statusCode)

      return handleServiceResponse(serviceResponse, res)
    }

    if (schema) {
      schema.parse({ body: req.body, query: req.query, params: req.params })
    }

    next()
  } catch (err) {
    const errorMessage = `Invalid input: ${(err as ZodError).errors.map((e) => e.message).join(", ")}`
    const statusCode = StatusCodes.BAD_REQUEST
    const serviceResponse = ServiceResponse.failure(errorMessage, null, statusCode)
    return handleServiceResponse(serviceResponse, res)
  }
}
