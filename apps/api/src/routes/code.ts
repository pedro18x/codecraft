import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.js'
import { SaveCodeSchema } from './schemas/code.schema.js'
import { getSavedCode, parseCodeParams, saveCode } from '../services/code.service.js'

const router = Router()

// All code routes require auth
router.use(authenticate)

// GET /api/code/:problemId/:language
router.get(
  '/:problemId/:language',
  asyncHandler(async (req, res) => {
    const { problemId, language } = parseCodeParams(req.params as { problemId: string; language: string })
    const code = await getSavedCode(req.userId!, { problemId, language })
    res.json(successResponse({ code }))
  })
)

// PUT /api/code/:problemId/:language
router.put(
  '/:problemId/:language',
  validate(SaveCodeSchema),
  asyncHandler(async (req, res) => {
    const { problemId, language } = parseCodeParams(req.params as { problemId: string; language: string })

    const saved = await saveCode(req.userId!, { problemId, language }, req.body.code)

    res.json(successResponse(saved))
  })
)

export default router
