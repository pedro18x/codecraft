import type { ProblemDetail, ProblemSummary } from '@/types'

type ProblemWithSlug = ProblemSummary | ProblemDetail

export function getProblemSlug(problem: ProblemWithSlug): string {
  if (problem.slug && problem.slug.length > 0) return problem.slug
  return problem.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function findProblemBySlug<T extends ProblemWithSlug>(problems: T[], slug: string): T | undefined {
  return problems.find((p) => getProblemSlug(p) === slug)
}
