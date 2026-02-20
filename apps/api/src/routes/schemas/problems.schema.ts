import { z } from 'zod'

export const ListProblemsQuerySchema = z.object({
  difficulty: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
})

export type ListProblemsQuery = z.infer<typeof ListProblemsQuerySchema>
