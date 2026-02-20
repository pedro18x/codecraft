import { z } from 'zod'

export const SaveCodeSchema = z.object({
  code: z.string().max(50000),
})

export const CodeLanguageSchema = z.enum(['javascript', 'typescript', 'python'])
export type CodeLanguage = z.infer<typeof CodeLanguageSchema>
