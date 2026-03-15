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

export const ProfileSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  bio: z.string().nullable(),
  avatarColor: z.string().nullable(),
  githubUrl: z.string().nullable(),
  linkedinUrl: z.string().nullable(),
  websiteUrl: z.string().nullable(),
  createdAt: z.string(),
})

export const ActivityHeatmapSchema = z.object({
  days: z.array(z.object({ date: z.string(), count: z.number() })),
})

export const StreakSchema = z.object({
  currentStreak: z.number(),
  longestStreak: z.number(),
  totalActiveDays: z.number(),
})

export const SubmissionAnalyticsSchema = z.object({
  totalSubmissions: z.number(),
  passRate: z.number(),
  avgExecutionTime: z.number().nullable(),
  languageBreakdown: z.array(z.object({ language: z.string(), count: z.number() })),
  recentTrend: z.array(z.object({ week: z.string(), passed: z.number(), failed: z.number() })),
})

export type ExecuteResponse = z.infer<typeof ExecuteResponseSchema>
export type ProgressEntry = z.infer<typeof ProgressEntrySchema>
export type ProgressStats = z.infer<typeof ProgressStatsSchema>
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>
export type Profile = z.infer<typeof ProfileSchema>
export type ActivityHeatmap = z.infer<typeof ActivityHeatmapSchema>
export type Streak = z.infer<typeof StreakSchema>
export type SubmissionAnalytics = z.infer<typeof SubmissionAnalyticsSchema>
