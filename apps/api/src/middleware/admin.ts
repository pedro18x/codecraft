import type { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/apiResponse.js'

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    return next(new ApiError('FORBIDDEN', 'Admin access required', 403))
  }
  next()
}
