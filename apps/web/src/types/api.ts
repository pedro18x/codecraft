import { z } from 'zod'

export const ExecuteResponseSchema = z.object({
  success: z.boolean(),
  testResults: z.array(
    z.object({
      passed: z.boolean(),
      input: z.string(),
      expectedOutput: z.string(),
      actualOutput: z.string().optional(),
      error: z.string().optional(),
    }),
  ),
  executionTimeMs: z.number().optional(),
})

export const ProgressEntrySchema = z.object({
  id: z.number(),
  problemId: z.number(),
  status: z.enum(['attempted', 'completed']),
  attempts: z.number(),
  lastAttempt: z.string(),
  completedAt: z.string().nullable(),
  problem: z.object({
    id: z.number(),
    title: z.string(),
    slug: z.string(),
    difficulty: z.string(),
  }),
})

export const ProgressStatsSchema = z.object({
  totalProblems: z.number(),
  completedCount: z.number(),
  attemptedCount: z.number(),
  byDifficulty: z.object({
    Easy: z.number(),
    Medium: z.number(),
    Hard: z.number(),
  }),
})

export const LeaderboardEntrySchema = z.object({
  rank: z.number(),
  userId: z.number(),
  username: z.string(),
  problemsSolved: z.number(),
  easy: z.number(),
  medium: z.number(),
  hard: z.number(),
})

export type ExecuteResponse = z.infer<typeof ExecuteResponseSchema>
export type ProgressEntry = z.infer<typeof ProgressEntrySchema>
export type ProgressStats = z.infer<typeof ProgressStatsSchema>
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>
