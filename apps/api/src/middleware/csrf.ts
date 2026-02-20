import type { Request, Response, NextFunction } from 'express'
import { env } from '../config/env.js'
import { ApiError } from '../utils/apiResponse.js'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

const EXEMPT_PATHS = new Set([
  '/health',
  '/ready',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/csrf',
  '/api/telemetry',
])

export function csrfProtection(req: Request, _res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method)) {
    next()
    return
  }

  if (EXEMPT_PATHS.has(req.path)) {
    next()
    return
  }

  const csrfCookie = req.cookies?.[env.CSRF_COOKIE_NAME]
  const csrfHeader = req.get('x-csrf-token')

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    next(new ApiError('CSRF_INVALID', 'CSRF token validation failed', 403))
    return
  }

  next()
}
