import { randomUUID } from 'node:crypto'
import type { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.js'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = randomUUID()
  req.requestId = requestId
  res.setHeader('x-request-id', requestId)

  const start = Date.now()
  res.on('finish', () => {
    logger.info('http_request', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      userId: req.userId ?? null,
      ip: req.ip,
    })
  })

  next()
}
