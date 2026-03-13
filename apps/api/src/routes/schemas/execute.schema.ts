import { z } from 'zod'

export const ExecuteCodeSchema = z.object({
  problemId: z.number().int().positive(),
  language: z.enum(['javascript', 'typescript', 'python']),
  code: z.string().min(1, 'Code cannot be empty').max(50000),
})

export type ExecuteCodeInput = z.infer<typeof ExecuteCodeSchema>
