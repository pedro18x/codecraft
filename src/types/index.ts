import { z } from 'zod'

// Difficulty enum
export const DifficultySchema = z.enum(['Easy', 'Medium', 'Hard'])
export type Difficulty = z.infer<typeof DifficultySchema>

// Category/Topic enum
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

// Language enum
export const LanguageSchema = z.enum(['javascript', 'typescript', 'python'])
export type Language = z.infer<typeof LanguageSchema>

// Test case schema
export const TestCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  explanation: z.string().optional(),
})
export type TestCase = z.infer<typeof TestCaseSchema>

// Problem schema
export const ProblemSchema = z.object({
  id: z.number(),
  title: z.string(),
  difficulty: DifficultySchema,
  categories: z.array(CategorySchema),
  description: z.string(),
  examples: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
      explanation: z.string().optional(),
    })
  ),
  constraints: z.array(z.string()),
  testCases: z.array(TestCaseSchema),
  starterCode: z.record(LanguageSchema, z.string()),
  hints: z.array(z.string()).optional(),
})
export type Problem = z.infer<typeof ProblemSchema>

// Test result schema
export const TestResultSchema = z.object({
  passed: z.boolean(),
  input: z.string(),
  expectedOutput: z.string(),
  actualOutput: z.string().optional(),
  error: z.string().optional(),
})
export type TestResult = z.infer<typeof TestResultSchema>

// Submission result schema
export const SubmissionResultSchema = z.object({
  success: z.boolean(),
  testResults: z.array(TestResultSchema),
  executionTime: z.number().optional(),
})
export type SubmissionResult = z.infer<typeof SubmissionResultSchema>
