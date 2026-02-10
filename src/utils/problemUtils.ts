import type { Problem } from '../types'

export function getProblemSlug(problem: Problem): string {
  return problem.title.toLowerCase().replace(/\s+/g, '-')
}

export function findProblemBySlug(problems: Problem[], slug: string): Problem | undefined {
  return problems.find(p => getProblemSlug(p) === slug)
}
