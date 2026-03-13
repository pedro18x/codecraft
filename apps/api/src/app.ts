import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { env } from './config/env.js'
import { globalLimiter } from './middleware/rateLimiter.js'
import { requestLogger } from './middleware/requestLogger.js'
import { csrfProtection } from './middleware/csrf.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import routes from './routes/index.js'
import { successResponse } from './utils/apiResponse.js'

export function createApp() {
  const app = express()
  const allowedOrigins = env.CORS_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
  const cspDirectives = {
    defaultSrc: ["'self'"],
    connectSrc: ["'self'", ...allowedOrigins],
    imgSrc: ["'self'", 'data:', 'blob:'],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    fontSrc: ["'self'", 'data:'],
    objectSrc: ["'none'"],
  }

  app.disable('x-powered-by')

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: cspDirectives,
        reportOnly: env.CSP_REPORT_ONLY,
      },
      crossOriginEmbedderPolicy: false,
    })
  )

  // CORS
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          callback(null, true)
          return
        }
        if (allowedOrigins.includes(origin)) {
          callback(null, true)
          return
        }
        callback(new Error('Origin not allowed by CORS'))
      },
      credentials: true,
    })
  )

  app.use(cookieParser())
  app.use(requestLogger)

  // Body parsing
  app.use(express.json({ limit: '1mb' }))

  // CSRF protection for mutating routes
  app.use(csrfProtection)

  // Rate limiting
  app.use(globalLimiter)

  // Health check
  app.get('/health', (_req, res) => {
    res.json(successResponse({ status: 'ok', timestamp: new Date().toISOString() }))
  })

  // API routes
  app.use('/api', routes)

  // Error handling (must be last)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
