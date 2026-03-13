'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import {
  PracticeProblemSchema,
  ProblemSummarySchema,
  type PracticeProblem,
  type ProblemSummary,
} from '@/types'
import { z } from 'zod'

export function useProblems() {
  return useQuery<ProblemSummary[]>({
    queryKey: queryKeys.problems.list,
    queryFn: async () => {
      const res = await api.get<{ problems: unknown[] }>('/problems')
      return z.array(ProblemSummarySchema).parse(res.problems)
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  })
}

export function useProblem(slug: string) {
  return useQuery<PracticeProblem>({
    queryKey: queryKeys.problems.detail(slug),
    queryFn: async () => PracticeProblemSchema.parse(await api.get<unknown>(`/problems/${slug}`)),
    staleTime: Infinity,
    enabled: Boolean(slug),
  })
}
