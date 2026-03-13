'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { api } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { Tabs } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { LeaderboardEntrySchema, type LeaderboardEntry } from '@/types/api'
import { z } from 'zod'
import { cn } from '@/lib/cn'

const TABS = [
  { id: 'global', label: 'Global' },
  { id: 'weighted', label: 'Weighted' },
  { id: 'hard', label: 'Hard Focus' },
]

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('global')
  const [search, setSearch] = useState('')
  const [showOnlyMe, setShowOnlyMe] = useState(false)

  const { data: entries = [], isLoading, isError } = useQuery<LeaderboardEntry[]>({
    queryKey: queryKeys.leaderboard(tab),
    queryFn: async () => {
      const data = await api.get<unknown>(`/leaderboard?type=${tab}`)
      return z.object({ leaderboard: z.array(LeaderboardEntrySchema) }).parse(data).leaderboard
    },
    staleTime: 60_000,
  })

  const filtered = entries.filter((e) => {
    if (showOnlyMe && user) return e.username === user.username
    if (search) return e.username.toLowerCase().includes(search.toLowerCase())
    return true
  })

  const top3 = filtered.slice(0, 3)

  return (
    <div className="py-6 grid gap-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] font-bold text-2xl text-[var(--color-text-primary)]">
          Leaderboard
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          See how you rank against other coders.
        </p>
      </div>

      <Tabs value={tab} items={TABS} onChange={setTab} />

      {/* Search + toggle */}
      <div className="flex gap-3 items-center flex-wrap">
        <input
          type="text"
          placeholder="Search username…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[160px] px-3 py-2 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
        />
        {user && (
          <button
            type="button"
            onClick={() => setShowOnlyMe((s) => !s)}
            className={cn(
              'px-3 py-2 text-sm rounded-[var(--radius-md)] border transition-colors',
              showOnlyMe
                ? 'bg-[var(--color-primary)] text-[var(--button-primary-text)] border-[var(--color-primary)]'
                : 'bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-text-primary)]',
            )}
          >
            Only me
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-2">{Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} height={48} />)}</div>
      ) : isError ? (
        <EmptyState
          title="Failed to load leaderboard"
          description="Something went wrong. Please try again."
          action={<button type="button" onClick={() => window.location.reload()} className="px-4 py-2 text-sm font-medium border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors">Retry</button>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState title="No results" description="No entries match your search." />
      ) : (
        <>
          {/* Podium */}
          {top3.length >= 3 && (
            <div className="flex items-end justify-center gap-3 py-6">
              {[top3[1], top3[0], top3[2]].map((entry, i) => {
                const heights = ['h-20', 'h-28', 'h-16']
                const medals = ['🥈', '🥇', '🥉']
                return (
                  <div key={entry.userId} className={cn('flex flex-col items-center gap-2 flex-1 max-w-[7rem] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-[var(--radius-md)]', heights[i])}>
                    <span className="mt-3 text-2xl">{medals[i]}</span>
                    <span className="text-xs font-semibold text-[var(--color-text-primary)] truncate px-1">{entry.username}</span>
                    <span className="text-xs text-[var(--color-text-secondary)]">{entry.problemsSolved}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Table */}
          <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
            <div className="grid grid-cols-[2rem_1fr_5rem_4rem_4rem_4rem] gap-3 px-4 py-2.5 bg-[var(--color-surface)] border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)]">
              <span>#</span>
              <span>User</span>
              <span className="text-right">Solved</span>
              <span className="text-right">Easy</span>
              <span className="text-right">Med</span>
              <span className="text-right">Hard</span>
            </div>
            {filtered.map((entry) => (
              <div
                key={entry.userId}
                className={cn(
                  'grid grid-cols-[2rem_1fr_5rem_4rem_4rem_4rem] gap-3 px-4 py-3 border-b border-[var(--color-border)] text-sm transition-colors last:border-b-0',
                  entry.username === user?.username
                    ? 'bg-[var(--color-success-bg)]'
                    : 'hover:bg-[var(--color-surface-raised)]',
                )}
              >
                <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-text-tertiary)]">{entry.rank}</span>
                <span className="font-medium text-[var(--color-text-primary)] truncate">{entry.username}</span>
                <span className="text-right font-bold text-[var(--color-text-primary)]">{entry.problemsSolved}</span>
                <span className="text-right text-[var(--color-success)]">{entry.easy}</span>
                <span className="text-right text-[var(--color-warning)]">{entry.medium}</span>
                <span className="text-right text-[var(--color-error)]">{entry.hard}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
