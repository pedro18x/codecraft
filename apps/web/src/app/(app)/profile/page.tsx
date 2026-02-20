'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { useProgress } from '@/hooks/use-progress'
import { api } from '@/lib/api-client'
import { Tabs } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ProgressStatsSchema, type ProgressStats, type ProgressEntry } from '@/types/api'
import Link from 'next/link'
import { z } from 'zod'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'solutions', label: 'Solutions' },
]

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { completedCount, progress } = useProgress()
  const [tab, setTab] = useState('overview')

  const { data: stats, isLoading: statsLoading } = useQuery<ProgressStats>({
    queryKey: ['progress-stats'],
    queryFn: async () => {
      const data = await api.get<unknown>('/progress/stats')
      return ProgressStatsSchema.parse(data)
    },
    enabled: isAuthenticated,
  })

  const { data: entries = [] } = useQuery<ProgressEntry[]>({
    queryKey: ['progress-entries'],
    queryFn: async () => {
      const data = await api.get<unknown[]>('/progress')
      return z.array(
        z.object({
          id: z.number(),
          problemId: z.number(),
          status: z.enum(['attempted', 'completed']),
          attempts: z.number(),
          lastAttempt: z.string(),
          completedAt: z.string().nullable(),
          problem: z.object({
            id: z.number(),
            title: z.string(),
            slug: z.string(),
            difficulty: z.string(),
          }),
        }),
      ).parse(data)
    },
    enabled: isAuthenticated,
  })

  if (authLoading) {
    return (
      <div className="py-8 grid gap-4">
        <Skeleton height={80} />
        <Skeleton height={200} />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <EmptyState
        title="Sign in to view your profile"
        description="Track your progress, streaks, and solutions."
        action={<Link href="/login" className="inline-flex px-4 py-2 bg-[var(--color-primary)] text-[var(--button-primary-text)] rounded-[var(--radius-md)] text-sm font-semibold no-underline">Sign in</Link>}
      />
    )
  }

  const solvedEntries = entries.filter((e) => e.status === 'completed')

  return (
    <div className="py-6 grid gap-6 max-w-3xl">
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] flex items-center justify-center font-[family-name:var(--font-display)] font-bold text-xl text-[var(--button-primary-text)]">
          {user.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-xl text-[var(--color-text-primary)]">
            {user.username}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{user.email}</p>
        </div>
      </div>

      {/* Stats cards */}
      {statsLoading ? (
        <div className="grid grid-cols-3 gap-4"><Skeleton height={80} /><Skeleton height={80} /><Skeleton height={80} /></div>
      ) : stats ? (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Solved', value: stats.completedCount },
            { label: 'Attempted', value: stats.attemptedCount },
            { label: 'Total', value: stats.totalProblems },
          ].map((s) => (
            <div key={s.label} className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-center">
              <span className="block font-[family-name:var(--font-display)] font-bold text-2xl text-[var(--color-text-primary)]">{s.value}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{s.label}</span>
            </div>
          ))}
        </div>
      ) : null}

      {/* Progress bar */}
      {stats && (
        <div className="grid gap-2">
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">Overall progress</p>
          <Progress value={stats.completedCount} max={stats.totalProblems} />
          <div className="flex gap-4 text-xs text-[var(--color-text-tertiary)]">
            <span>Easy: {stats.byDifficulty.Easy}</span>
            <span>Medium: {stats.byDifficulty.Medium}</span>
            <span>Hard: {stats.byDifficulty.Hard}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={tab} items={TABS} onChange={setTab} />

      {tab === 'overview' && (
        <div className="text-sm text-[var(--color-text-secondary)]">
          {completedCount === 0
            ? 'Start solving problems to see your progress here.'
            : `You have solved ${completedCount} problem${completedCount !== 1 ? 's' : ''}. Keep going!`}
        </div>
      )}

      {tab === 'solutions' && (
        <div className="grid gap-2">
          {solvedEntries.length === 0 ? (
            <EmptyState title="No solutions yet" description="Solve a problem to see it here." />
          ) : (
            solvedEntries.map((entry) => (
              <Link
                key={entry.id}
                href={`/practice/${entry.problem.slug}`}
                className="flex items-center gap-3 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-surface-raised)] transition-colors no-underline"
              >
                <span className="text-[var(--color-success)] text-sm">✓</span>
                <span className="flex-1 text-sm font-medium text-[var(--color-text-primary)]">{entry.problem.title}</span>
                <Badge
                  tone={entry.problem.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'}
                  size="sm"
                >
                  {entry.problem.difficulty}
                </Badge>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}
