import rateLimit from 'express-rate-limit'
import { errorResponse } from '../utils/apiResponse.js'

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json(errorResponse('RATE_LIMIT', 'Too many requests, try again later'))
  },
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (_req, res) => {
    res.status(429).json(errorResponse('AUTH_RATE_LIMIT', 'Too many login attempts'))
  },
})

export const submissionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.userId?.toString() || req.ip || 'unknown',
  handler: (_req, res) => {
    res.status(429).json(errorResponse('SUBMISSION_RATE_LIMIT', 'Too many submissions, wait a moment'))
  },
})

export const guestExecutionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
  handler: (_req, res) => {
    res.status(429).json(errorResponse('GUEST_RATE_LIMIT', 'Too many requests, please wait a moment'))
  },
})

export const aiHintLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.userId?.toString() || req.ip || 'unknown',
  handler: (_req, res) => {
    const resetTime = new Date(Date.now() + 60 * 60 * 1000)
    const hh = resetTime.getHours().toString().padStart(2, '0')
    const mm = resetTime.getMinutes().toString().padStart(2, '0')
    res.status(429).json(
      errorResponse('AI_RATE_LIMIT', `You've used 10 AI hints this hour. Resets at ${hh}:${mm}.`)
    )
  },
})
