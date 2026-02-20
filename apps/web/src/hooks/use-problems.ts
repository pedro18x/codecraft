'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { ProblemSchema, type Problem } from '@/types'
import { z } from 'zod'

export function useProblems() {
  return useQuery<Problem[]>({
    queryKey: ['problems'],
    queryFn: async () => {
      const res = await api.get<{ problems: unknown[] }>('/problems')
      return z.array(ProblemSchema).parse(res.problems)
    },
    staleTime: Infinity,
    retry: 1,
  })
}

export function useProblem(slug: string) {
  return useQuery<Problem | undefined>({
    queryKey: ['problem', slug],
    queryFn: async () => {
      try {
        const data = await api.get<unknown>(`/problems/${slug}`)
        return ProblemSchema.parse(data)
      } catch {
        // fallback: fetch all and find by slug
        const res = await api.get<{ problems: unknown[] }>('/problems')
        const problems = z.array(ProblemSchema).parse(res.problems)
        return problems.find((p) => (p.slug ?? slugify(p.title)) === slug)
      }
    },
    staleTime: Infinity,
    enabled: Boolean(slug),
  })
}

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}
