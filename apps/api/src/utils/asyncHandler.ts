import type { Request, Response, NextFunction } from 'express'

/**
 * Wraps an async route handler so thrown errors are passed to next().
 * Avoids try/catch in every route.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}
