import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { globalLimiter } from './middleware/rateLimiter.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import routes from './routes/index.js'

export function createApp() {
  const app = express()

  // CORS
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(','),
      credentials: true,
    })
  )

  // Body parsing
  app.use(express.json({ limit: '1mb' }))

  // Rate limiting
  app.use(globalLimiter)

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // API routes
  app.use('/api', routes)

  // Error handling (must be last)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
