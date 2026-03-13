import { z } from 'zod'

export const SubmitCodeSchema = z.object({
  problemId: z.number().int().positive(),
  language: z.enum(['javascript', 'typescript', 'python']),
  code: z.string().min(1, 'Code cannot be empty').max(50000),
})

export const SubmissionListQuerySchema = z.object({
  problemId: z.coerce.number().int().positive().optional(),
})

export type SubmitCodeInput = z.infer<typeof SubmitCodeSchema>
export type SubmissionListQuery = z.infer<typeof SubmissionListQuerySchema>
