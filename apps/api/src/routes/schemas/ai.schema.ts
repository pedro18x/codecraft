import { z } from 'zod'

export const AiHintRequestSchema = z.object({
  problemId: z.number().int().positive(),
  mode: z.enum(['hint', 'diagnose']),
  hintLevel: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  code: z.string().min(1).max(50_000).optional(),
  language: z.enum(['javascript', 'typescript', 'python']).optional(),
  failingTestCase: z
    .object({
      input: z.string(),
      expectedOutput: z.string(),
    })
    .optional(),
  errorMessage: z.string().max(2000).optional(),
})

export type AiHintRequest = z.infer<typeof AiHintRequestSchema>
