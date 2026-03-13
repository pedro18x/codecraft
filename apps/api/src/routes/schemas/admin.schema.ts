import { z } from 'zod'

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const AdminListUsersQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  role: z.enum(['user', 'admin']).optional(),
})

export const AdminUpdateUserRoleSchema = z.object({
  role: z.enum(['user', 'admin']),
})

export const AdminIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const AdminListProblemsQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
})

export const AdminCreateProblemSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  slug: z.string().min(1),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  categories: z.array(z.string()),
  description: z.string().min(1),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string(),
    explanation: z.string().nullable().optional(),
  })),
  constraints: z.array(z.string()),
  testCases: z.array(z.object({
    input: z.string(),
    expectedOutput: z.string(),
  })),
  starterCode: z.record(z.string()),
  hints: z.array(z.string()).default([]),
})

export const AdminUpdateProblemSchema = AdminCreateProblemSchema.omit({ id: true }).partial()

export const AdminListSubmissionsQuerySchema = PaginationQuerySchema.extend({
  userId: z.coerce.number().int().positive().optional(),
  problemId: z.coerce.number().int().positive().optional(),
  success: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  language: z.string().optional(),
})
