import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.js'
import * as profileService from '../services/profile.service.js'

const router = Router()

const UpdateProfileSchema = z.object({
  bio: z.string().max(280, 'Bio must be 280 characters or less').nullable().optional(),
  avatarColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g. #3E7A55)')
    .nullable()
    .optional(),
  githubUrl: z.string().url('Must be a valid URL').nullable().optional(),
  linkedinUrl: z.string().url('Must be a valid URL').nullable().optional(),
  websiteUrl: z.string().url('Must be a valid URL').nullable().optional(),
})

// GET /api/profile
router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const profile = await profileService.getProfile(req.user!.id)
    res.json(successResponse(profile))
  })
)

// PATCH /api/profile
router.patch(
  '/',
  authenticate,
  validate(UpdateProfileSchema),
  asyncHandler(async (req, res) => {
    const profile = await profileService.updateProfile(req.user!.id, req.body)
    res.json(successResponse(profile))
  })
)

export default router
