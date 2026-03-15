import { Router } from 'express'
import { randomBytes } from 'node:crypto'
import { z } from 'zod'
import { validate } from '../middleware/validate.js'
import { authenticate, optionalAuth } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.js'
import {
  REFRESH_COOKIE_NAME,
  clearAuthCookies,
  setAuthCookies,
  setCsrfCookie,
} from '../utils/cookies.js'
import { env } from '../config/env.js'
import * as authService from '../services/auth.service.js'
import { prisma } from '../config/database.js'
import { logger } from '../utils/logger.js'

const router = Router()

// Validation schemas
const RegisterSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  validate(RegisterSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.register(req.body)
    setAuthCookies(res, result.accessToken, result.refreshToken)
    logger.info('product_event', {
      event_name: 'signup_completed',
      userId: result.user.id,
      route: '/api/auth/register',
    })
    res.status(201).json(successResponse({ user: result.user }))
  })
)

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  validate(LoginSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.body)
    setAuthCookies(res, result.accessToken, result.refreshToken)
    logger.info('auth_login_success', {
      userId: result.user.id,
      route: '/api/auth/login',
    })
    res.json(successResponse({ user: result.user }))
  })
)

// POST /api/auth/refresh
router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME]
    if (!refreshToken) {
      clearAuthCookies(res)
      res.status(401).json({
        success: false,
        error: { code: 'TOKEN_EXPIRED', message: 'Refresh token missing' },
      })
      return
    }
    const result = await authService.refresh(refreshToken)
    setAuthCookies(res, result.accessToken, result.refreshToken)
    res.json(successResponse({ refreshed: true }))
  })
)

// POST /api/auth/logout
router.post(
  '/logout',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME]
    if (refreshToken) {
      if (req.userId) {
        await authService.logout(refreshToken, req.userId)
      } else {
        await authService.revokeRefreshToken(refreshToken)
      }
    }
    clearAuthCookies(res)
    res.json(successResponse({ message: 'Logged out', signedOut: true }))
  })
)

// GET /api/auth/csrf
router.get(
  '/csrf',
  asyncHandler(async (_req, res) => {
    const csrfToken = randomBytes(24).toString('hex')
    setCsrfCookie(res, csrfToken)
    res.json(successResponse({ csrfToken, cookieName: env.CSRF_COOKIE_NAME }))
  })
)

// GET /api/auth/me
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const dbUser = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, username: true, role: true, createdAt: true },
    })
    res.json(successResponse(dbUser ?? req.user))
  })
)

export default router
