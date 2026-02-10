import type { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { ApiError, errorResponse } from '../utils/apiResponse.js'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Known API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(errorResponse(err.code, err.message, err.details))
    return
  }

  // Prisma unique constraint violation
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json(errorResponse('DUPLICATE', 'Resource already exists'))
      return
    }
    if (err.code === 'P2025') {
      res.status(404).json(errorResponse('NOT_FOUND', 'Resource not found'))
      return
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json(errorResponse('INVALID_TOKEN', 'Invalid token'))
    return
  }
  if (err.name === 'TokenExpiredError') {
    res.status(401).json(errorResponse('TOKEN_EXPIRED', 'Token expired'))
    return
  }

  // Unknown error
  console.error('Unhandled error:', err)
  res.status(500).json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'))
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json(errorResponse('NOT_FOUND', 'Route not found'))
}
