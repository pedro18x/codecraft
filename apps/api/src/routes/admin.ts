import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/admin.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { successResponse } from '../utils/apiResponse.js'
import * as adminService from '../services/admin.service.js'
import {
  AdminIdParamSchema,
  AdminListUsersQuerySchema,
  AdminUpdateUserRoleSchema,
  AdminListProblemsQuerySchema,
  AdminCreateProblemSchema,
  AdminUpdateProblemSchema,
  AdminListSubmissionsQuerySchema,
} from './schemas/admin.schema.js'

const router = Router()

router.use(authenticate, requireAdmin)

// Dashboard
router.get(
  '/dashboard',
  asyncHandler(async (_req, res) => {
    const stats = await adminService.getDashboardStats()
    res.json(successResponse(stats))
  }),
)

// Users
router.get(
  '/users',
  validate(AdminListUsersQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const result = await adminService.listUsers(req.query as never)
    res.json(successResponse(result))
  }),
)

router.get(
  '/users/:id',
  validate(AdminIdParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const user = await adminService.getUserById(Number(req.params.id))
    res.json(successResponse(user))
  }),
)

router.patch(
  '/users/:id/role',
  validate(AdminIdParamSchema, 'params'),
  validate(AdminUpdateUserRoleSchema),
  asyncHandler(async (req, res) => {
    const user = await adminService.updateUserRole(
      Number(req.params.id),
      req.body.role,
      req.user!.id,
    )
    res.json(successResponse(user))
  }),
)

router.delete(
  '/users/:id',
  validate(AdminIdParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    await adminService.deleteUser(Number(req.params.id), req.user!.id)
    res.json(successResponse({ deleted: true }))
  }),
)

// Problems
router.get(
  '/problems',
  validate(AdminListProblemsQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const result = await adminService.listProblems(req.query as never)
    res.json(successResponse(result))
  }),
)

router.get(
  '/problems/:id',
  validate(AdminIdParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const problem = await adminService.getProblemById(Number(req.params.id))
    res.json(successResponse(problem))
  }),
)

router.post(
  '/problems',
  validate(AdminCreateProblemSchema),
  asyncHandler(async (req, res) => {
    const problem = await adminService.createProblem(req.body)
    res.status(201).json(successResponse(problem))
  }),
)

router.put(
  '/problems/:id',
  validate(AdminIdParamSchema, 'params'),
  validate(AdminUpdateProblemSchema),
  asyncHandler(async (req, res) => {
    const problem = await adminService.updateProblem(Number(req.params.id), req.body)
    res.json(successResponse(problem))
  }),
)

router.delete(
  '/problems/:id',
  validate(AdminIdParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    await adminService.deleteProblem(Number(req.params.id))
    res.json(successResponse({ deleted: true }))
  }),
)

// Submissions
router.get(
  '/submissions',
  validate(AdminListSubmissionsQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const result = await adminService.listSubmissions(req.query as never)
    res.json(successResponse(result))
  }),
)

router.get(
  '/submissions/:id',
  validate(AdminIdParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const submission = await adminService.getSubmissionById(Number(req.params.id))
    res.json(successResponse(submission))
  }),
)

export default router
