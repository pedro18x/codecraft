import type { Request, Response, NextFunction } from 'express'
import { ZodError, type AnyZodObject } from 'zod'
import { ApiError } from '../utils/apiResponse.js'

type Target = 'body' | 'query' | 'params'

export function validate(schema: AnyZodObject, target: Target = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req[target] = schema.parse(req[target])
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }))
        return next(
          new ApiError('VALIDATION_ERROR', 'Invalid request data', 400, details)
        )
      }
      next(err)
    }
  }
}
