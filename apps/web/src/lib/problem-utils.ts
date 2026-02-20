import type { Problem } from '@/types'

export function getProblemSlug(problem: Problem): string {
  if (problem.slug && problem.slug.length > 0) return problem.slug
  return problem.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function findProblemBySlug(problems: Problem[], slug: string): Problem | undefined {
  return problems.find((p) => getProblemSlug(p) === slug)
}
