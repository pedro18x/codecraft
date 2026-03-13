import { z } from 'zod'

export const DifficultySchema = z.enum(['Easy', 'Medium', 'Hard'])
export type Difficulty = z.infer<typeof DifficultySchema>

export const CategorySchema = z.enum([
  'Array',
  'String',
  'Hash Table',
  'Dynamic Programming',
  'Math',
  'Sorting',
  'Greedy',
  'Depth-First Search',
  'Binary Search',
  'Tree',
  'Graph',
  'Backtracking',
])
export type Category = z.infer<typeof CategorySchema>

export const LanguageSchema = z.enum(['javascript', 'typescript', 'python'])
export type Language = z.infer<typeof LanguageSchema>

export const TestCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  explanation: z.string().nullish(),
})
export type TestCase = z.infer<typeof TestCaseSchema>

const ProblemBaseSchema = z.object({
  id: z.number(),
  slug: z.string().nullish(),
  title: z.string(),
  difficulty: DifficultySchema,
  categories: z.array(z.string()),
})

export const ProblemSummarySchema = ProblemBaseSchema
export type ProblemSummary = z.infer<typeof ProblemSummarySchema>

export const ProblemDetailSchema = ProblemBaseSchema.extend({
  description: z.string(),
  examples: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
      explanation: z.string().nullish(),
    }),
  ),
  constraints: z.array(z.string()),
  starterCode: z.record(z.string(), z.string().nullish()),
  hints: z.array(z.string()).nullish(),
})
export type ProblemDetail = z.infer<typeof ProblemDetailSchema>

export const PracticeProblemSchema = ProblemDetailSchema.extend({
  navigation: z.object({
    prevSlug: z.string().nullable(),
    nextSlug: z.string().nullable(),
  }),
})
export type PracticeProblem = z.infer<typeof PracticeProblemSchema>

export const ProblemSchema = ProblemDetailSchema.extend({
  testCases: z.array(TestCaseSchema).nullish(),
})
export type Problem = z.infer<typeof ProblemSchema>

export const TestResultSchema = z.object({
  passed: z.boolean(),
  input: z.string(),
  expectedOutput: z.string(),
  actualOutput: z.string().optional(),
  error: z.string().optional(),
})
export type TestResult = z.infer<typeof TestResultSchema>

export const SubmissionResultSchema = z.object({
  success: z.boolean(),
  testResults: z.array(TestResultSchema),
  executionTime: z.number().optional(),
})
export type SubmissionResult = z.infer<typeof SubmissionResultSchema>
