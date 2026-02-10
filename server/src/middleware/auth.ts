import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt.js'
import { ApiError } from '../utils/apiResponse.js'

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return next(new ApiError('AUTH_REQUIRED', 'Authentication token required', 401))
  }

  try {
    const token = header.substring(7)
    const payload = verifyAccessToken(token)

    req.userId = payload.userId
    req.user = {
      id: payload.userId,
      email: payload.email,
      username: payload.username,
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
  const header = req.headers.authorization

  if (header?.startsWith('Bearer ')) {
    try {
      const token = header.substring(7)
      const payload = verifyAccessToken(token)
      req.userId = payload.userId
      req.user = {
        id: payload.userId,
        email: payload.email,
        username: payload.username,
      }
    } catch {
      // Ignore - continue as unauthenticated
    }
  }

  next()
}
