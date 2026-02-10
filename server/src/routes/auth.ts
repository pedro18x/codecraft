import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.js'
import * as authService from '../services/auth.service.js'

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

const RefreshSchema = z.object({
  refreshToken: z.string(),
})

// POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  validate(RegisterSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.register(req.body)
    res.status(201).json(successResponse(result))
  })
)

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  validate(LoginSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.body)
    res.json(successResponse(result))
  })
)

// POST /api/auth/refresh
router.post(
  '/refresh',
  validate(RefreshSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.refresh(req.body.refreshToken)
    res.json(successResponse(result))
  })
)

// POST /api/auth/logout
router.post(
  '/logout',
  authenticate,
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body
    if (refreshToken) {
      await authService.logout(refreshToken, req.userId!)
    }
    res.json(successResponse({ message: 'Logged out' }))
  })
)

// GET /api/auth/me
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(successResponse(req.user))
  })
)

export default router
