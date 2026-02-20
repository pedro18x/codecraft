'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useProblems } from '@/hooks/use-problems'
import { useProgress } from '@/hooks/use-progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Dropdown } from '@/components/ui/dropdown'
import { Input } from '@/components/ui/input'
import { getProblemSlug } from '@/lib/problem-utils'
import type { Problem } from '@/types'
import { cn } from '@/lib/cn'

type DifficultyFilter = 'All' | 'Easy' | 'Medium' | 'Hard'
type SortOption = 'recommended' | 'difficulty' | 'title'
type StatusFilter = 'all' | 'todo' | 'attempted' | 'solved'

const difficultyTone = { Easy: 'easy', Medium: 'medium', Hard: 'hard' } as const

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export default function DashboardPage() {
  const { data: problems, isLoading, isError } = useProblems()
  const { isCompleted, isAttempted, completedCount } = useProgress()

  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('All')
  const [sortBy, setSortBy] = useState<SortOption>('recommended')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const debouncedSearch = useDebounce(search, 220)

  const enriched = useMemo(() => {
    if (!problems) return []
    return problems.map((p) => ({
      ...p,
      status: isCompleted(p.id) ? 'solved' : isAttempted(p.id) ? 'attempted' : 'todo',
      slug: getProblemSlug(p),
    }))
  }, [problems, isCompleted, isAttempted])

  const filtered = useMemo(() => {
    let list = enriched.filter((p) => {
      const q = debouncedSearch.toLowerCase()
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.categories.some((c) => c.toLowerCase().includes(q))
      const matchDiff = difficulty === 'All' || p.difficulty === difficulty
      const matchStatus = statusFilter === 'all' || p.status === statusFilter
      return matchSearch && matchDiff && matchStatus
    })

    if (sortBy === 'difficulty') {
      const order = { Easy: 1, Medium: 2, Hard: 3 }
      list = [...list].sort((a, b) => order[a.difficulty] - order[b.difficulty])
    } else if (sortBy === 'title') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    } else {
      const sRank = { solved: 2, attempted: 1, todo: 0 }
      list = [...list].sort((a, b) => sRank[a.status as keyof typeof sRank] - sRank[b.status as keyof typeof sRank] || a.id - b.id)
    }

    return list
  }, [enriched, debouncedSearch, difficulty, sortBy, statusFilter])

  const totalCount = problems?.length ?? 0
  const progressPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="py-6 grid gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-2xl text-[var(--color-text-primary)]">
            Problems
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {completedCount} / {totalCount} solved · {progressPct}% complete
          </p>
        </div>
        <div className="w-full sm:w-40 h-1.5 self-center rounded-[var(--radius-full)] bg-[var(--color-surface)] overflow-hidden">
          <div
            className="h-full bg-[var(--color-success)] rounded-[var(--radius-full)] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[180px]">
          <Input
            as="input"
            type="text"
            placeholder="Search problems…"
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
          />
        </div>
        <Dropdown
          className="w-36"
          items={[
            { value: 'All', label: 'All difficulties' },
            { value: 'Easy', label: 'Easy' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Hard', label: 'Hard' },
          ]}
          value={difficulty}
          onChange={(v) => setDifficulty(v as DifficultyFilter)}
        />
        <Dropdown
          className="w-40"
          items={[
            { value: 'recommended', label: 'Recommended' },
            { value: 'difficulty', label: 'Difficulty' },
            { value: 'title', label: 'Title A–Z' },
          ]}
          value={sortBy}
          onChange={(v) => setSortBy(v as SortOption)}
        />
        <Dropdown
          className="w-36"
          items={[
            { value: 'all', label: 'All status' },
            { value: 'todo', label: 'To do' },
            { value: 'attempted', label: 'Attempted' },
            { value: 'solved', label: 'Solved' },
          ]}
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as StatusFilter)}
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="grid gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={56} />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Failed to load problems"
          description="Something went wrong. Please try again."
          action={<button type="button" onClick={() => window.location.reload()} className="px-4 py-2 text-sm font-medium border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors">Retry</button>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No problems found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <div className="grid gap-1.5">
          <AnimatePresence initial={false}>
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, delay: i * 0.03, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <ProblemRow problem={p} status={p.status} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function ProblemRow({
  problem,
  status,
}: {
  problem: Problem & { slug: string }
  status: string
}) {
  const statusIcon = status === 'solved' ? '✓' : status === 'attempted' ? '·' : ''

  return (
    <Link
      href={`/practice/${problem.slug}`}
      className={cn(
        'flex items-center gap-4 px-4 py-3 rounded-[var(--radius-md)]',
        'border border-[var(--color-border)] bg-[var(--color-surface)]',
        'hover:bg-[var(--color-surface-raised)] hover:shadow-[var(--shadow-brutal-sm)]',
        'transition-all duration-[var(--duration-fast)] no-underline group',
      )}
    >
      <span className="w-5 text-center font-[family-name:var(--font-mono)] text-xs text-[var(--color-text-tertiary)]">
        {statusIcon || problem.id}
      </span>
      <span className="flex-1 text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
        {problem.title}
      </span>
      <div className="hidden sm:flex gap-1.5">
        {problem.categories.slice(0, 2).map((c) => (
          <Badge key={c} tone="neutral" size="sm">{c}</Badge>
        ))}
      </div>
      <Badge tone={difficultyTone[problem.difficulty]} size="sm">
        {problem.difficulty}
      </Badge>
    </Link>
  )
}
