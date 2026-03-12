import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt.js'
import { ApiError } from '../utils/apiResponse.js'
import { env } from '../config/env.js'
import { ACCESS_COOKIE_NAME } from '../utils/cookies.js'

function resolveAccessToken(req: Request): string | null {
  const cookieToken = req.cookies?.[ACCESS_COOKIE_NAME]
  if (cookieToken) return cookieToken

  if (!env.ALLOW_BEARER_AUTH_FALLBACK || env.NODE_ENV === 'production') {
    return null
  }

  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) {
    return header.substring(7)
  }

  return null
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = resolveAccessToken(req)
  if (!token) {
    return next(new ApiError('AUTH_REQUIRED', 'Authentication token required', 401))
  }

  try {
    const payload = verifyAccessToken(token)

    req.userId = payload.userId
    req.user = {
      id: payload.userId,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    }

    next()
  } catch (err) {
    if (err instanceof Error && err.name === 'TokenExpiredError') {
      return next(new ApiError('TOKEN_EXPIRED', 'Access token expired', 401))
    }
    next(new ApiError('INVALID_TOKEN', 'Invalid authentication token', 401))
  }
}

/** Attaches user info if token present, but doesn't require it */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = resolveAccessToken(req)
  if (token) {
    try {
      const payload = verifyAccessToken(token)
      req.userId = payload.userId
      req.user = {
        id: payload.userId,
        email: payload.email,
        username: payload.username,
        role: payload.role,
      }
    } catch {
      // Ignore - continue as unauthenticated
    }
  }

  next()
}
