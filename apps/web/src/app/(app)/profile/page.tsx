'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { z } from 'zod'
import { useAuth } from '@/hooks/use-auth'
import { useProfile, useStreak, useActivityHeatmap, useSubmissionAnalytics } from '@/hooks/use-profile'
import { api } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { GlassCard } from '@/components/ui/glass-card'
import { Tabs } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { CountUp } from '@/components/landing/count-up'
import { ShinyText } from '@/components/landing/shiny-text'
import { StreakDisplay } from '@/components/profile/streak-display'
import { ActivityHeatmap } from '@/components/profile/activity-heatmap'
import { AnalyticsCharts } from '@/components/profile/analytics-charts'
import { ProfileEditForm } from '@/components/profile/profile-edit-form'
import { ProgressStatsSchema, type ProgressStats, type ProgressEntry } from '@/types/api'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'analytics', label: 'Analytics' },
]

const DIFFICULTY_FILTERS = ['All', 'Easy', 'Medium', 'Hard'] as const

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
})

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [tab, setTab] = useState('overview')
  const [editing, setEditing] = useState(false)
  const [difficultyFilter, setDifficultyFilter] = useState<typeof DIFFICULTY_FILTERS[number]>('All')
  const currentYear = new Date().getFullYear()

  const scope = isAuthenticated ? 'user' : 'guest'

  // Data hooks
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: streak } = useStreak()
  const { data: heatmap } = useActivityHeatmap()
  const { data: analytics } = useSubmissionAnalytics()

  const { data: stats, isLoading: statsLoading } = useQuery<ProgressStats>({
    queryKey: queryKeys.progress.stats(scope),
    queryFn: async () => {
      const data = await api.get<unknown>('/progress/stats')
      return ProgressStatsSchema.parse(data)
    },
    enabled: isAuthenticated,
  })

  const { data: entries = [] } = useQuery<ProgressEntry[]>({
    queryKey: queryKeys.progress.entries(scope),
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

  // --- Auth guard ---
  if (authLoading) {
    return (
      <div className="py-8 grid gap-4 max-w-4xl mx-auto w-full">
        <Skeleton height={120} />
        <div className="grid grid-cols-3 gap-3"><Skeleton height={70} /><Skeleton height={70} /><Skeleton height={70} /></div>
        <Skeleton height={200} />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <EmptyState
        title="Sign in to view your profile"
        description="Track your progress, streaks, and solutions."
        action={
          <Link
            href="/login"
            className="inline-flex px-4 py-2 bg-[var(--color-primary)] text-[var(--button-primary-text)] rounded-[var(--radius-md)] text-sm font-semibold no-underline"
          >
            Sign in
          </Link>
        }
      />
    )
  }

  // --- Derived data ---
  const solvedEntries = entries.filter((e) => e.status === 'completed')
  const avatarColor = profile?.avatarColor ?? '#3E7A55'
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null

  const filteredSolutions = difficultyFilter === 'All'
    ? solvedEntries
    : solvedEntries.filter((e) => e.problem.difficulty === difficultyFilter)

  // Recent completed entries (last 5) for overview tab
  const recentCompleted = solvedEntries
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
    .slice(0, 5)

  return (
    <div className="py-6 grid gap-6 max-w-4xl mx-auto w-full">
      {/* ──────── 1. Hero Profile Header ──────── */}
      <motion.div {...fadeUp(0)}>
        <GlassCard glow="jade" className="p-6">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center font-[family-name:var(--font-display)] font-bold text-2xl text-white shrink-0"
              style={{
                background: avatarColor,
                boxShadow: `0 0 24px ${avatarColor}44`,
              }}
            >
              {user.username[0].toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <ShinyText
                text={user.username}
                className="font-[family-name:var(--font-display)] font-bold text-2xl text-[var(--color-text-primary)]"
              />
              <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{user.email}</p>

              {profile?.bio && (
                <p className="text-sm text-[var(--color-text-primary)] mt-3 leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* Social links + meta */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {profile?.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors no-underline flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.382 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.838 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    GitHub
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors no-underline flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </a>
                )}
                {profile?.websiteUrl && (
                  <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors no-underline flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                    Website
                  </a>
                )}
                {memberSince && (
                  <span className="text-xs text-[var(--color-text-tertiary)]">
                    Member since {memberSince}
                  </span>
                )}
              </div>
            </div>

            {/* Edit button */}
            <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
              {editing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {/* Inline edit form */}
          {editing && profile && (
            <div className="mt-6 pt-6 border-t border-[var(--glass-border)]">
              <ProfileEditForm profile={profile} onClose={() => setEditing(false)} />
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* ──────── 2. Streak Bar ──────── */}
      {streak && (
        <motion.div {...fadeUp(0.1)}>
          <StreakDisplay data={streak} />
        </motion.div>
      )}

      {/* ──────── 3. Stats Grid ──────── */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Skeleton height={100} /><Skeleton height={100} /><Skeleton height={100} />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Solved', value: stats.completedCount, glow: 'jade' as const },
            { label: 'Attempted', value: stats.attemptedCount, glow: 'amber' as const },
            { label: 'Available', value: stats.totalProblems, glow: 'none' as const },
          ].map((s, i) => (
            <motion.div key={s.label} {...fadeUp(0.15 + i * 0.08)}>
              <GlassCard glow={s.glow} hoverable className="p-5 h-full flex flex-col items-center justify-center text-center">
                <CountUp
                  to={s.value}
                  className="font-[family-name:var(--font-display)] font-bold text-3xl text-[var(--color-text-primary)]"
                />
                <span className="block text-xs text-[var(--color-text-secondary)] mt-1">{s.label}</span>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* ──────── 4. Activity Heatmap ──────── */}
      {heatmap && (
        <motion.div {...fadeUp(0.35)}>
          <GlassCard className="p-5">
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-sm text-[var(--color-text-secondary)] mb-4">
              Activity
            </h3>
            <ActivityHeatmap data={heatmap} />
          </GlassCard>
        </motion.div>
      )}

      {/* ──────── 5. Difficulty Breakdown ──────── */}
      {stats && (
        <motion.div {...fadeUp(0.45)}>
          <GlassCard className="p-5">
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-sm text-[var(--color-text-secondary)] mb-4">
              Difficulty Breakdown
            </h3>
            <div className="grid gap-3">
              {([
                { label: 'Easy', count: stats.byDifficulty.Easy, color: 'var(--zen-accent-moss, #7B8F6A)' },
                { label: 'Medium', count: stats.byDifficulty.Medium, color: 'var(--zen-accent-amber, #C9A84C)' },
                { label: 'Hard', count: stats.byDifficulty.Hard, color: 'var(--zen-accent-rust, #C75B3A)' },
              ] as const).map((d) => (
                <div key={d.label} className="grid gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--color-text-secondary)] font-medium">{d.label}</span>
                    <span className="text-[var(--color-text-tertiary)]">{d.count} / {stats.totalProblems}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--zen-surface-2, #2A2724)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: d.color }}
                      initial={{ width: 0 }}
                      animate={{ width: stats.totalProblems > 0 ? `${(d.count / stats.totalProblems) * 100}%` : '0%' }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* ──────── 6. Tabs ──────── */}
      <Tabs value={tab} items={TABS} onChange={setTab} />

      {/* ──────── 7a. Overview Tab ──────── */}
      {tab === 'overview' && (
        <motion.div {...fadeUp(0)} className="grid gap-4">
          {/* Insight cards */}
          {stats && (
            <div className="grid sm:grid-cols-2 gap-4">
              <GlassCard className="p-5 h-full flex items-center gap-4">
                <Progress variant="circular" value={stats.completedCount} max={stats.totalProblems} className="shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">Completion Rate</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {stats.totalProblems > 0
                      ? `${Math.round((stats.completedCount / stats.totalProblems) * 100)}% of all problems`
                      : 'No problems available'}
                  </p>
                </div>
              </GlassCard>
              <GlassCard className="p-5 h-full flex items-center">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">Strongest Difficulty</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {(() => {
                      const diffs = [
                        { name: 'Easy', count: stats.byDifficulty.Easy },
                        { name: 'Medium', count: stats.byDifficulty.Medium },
                        { name: 'Hard', count: stats.byDifficulty.Hard },
                      ]
                      const best = diffs.reduce((a, b) => (a.count > b.count ? a : b))
                      return best.count > 0
                        ? `${best.name} — ${best.count} solved`
                        : 'Start solving to see your strength'
                    })()}
                  </p>
                </div>
              </GlassCard>
            </div>
          )}

          {/* Recent activity */}
          <GlassCard className="p-5">
            <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">Recent Activity</h4>
            {recentCompleted.length === 0 ? (
              <EmptyState
                title="No activity yet"
                description="Solve some problems to see your recent activity."
                action={
                  <Link
                    href="/practice"
                    className="inline-flex px-4 py-2 bg-[var(--color-primary)] text-[var(--button-primary-text)] rounded-[var(--radius-md)] text-sm font-semibold no-underline"
                  >
                    Start Practicing
                  </Link>
                }
                className="py-8"
              />
            ) : (
              <div className="grid gap-2">
                {recentCompleted.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/practice/${entry.problem.slug}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-raised)] transition-colors no-underline"
                  >
                    <span className="text-[var(--color-success)] text-sm">✓</span>
                    <span className="flex-1 text-sm text-[var(--color-text-primary)]">{entry.problem.title}</span>
                    <Badge tone={entry.problem.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'} size="sm">
                      {entry.problem.difficulty}
                    </Badge>
                    {entry.completedAt && (
                      <span className="text-[10px] text-[var(--color-text-tertiary)]">
                        {new Date(entry.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}

      {/* ──────── 7b. Solutions Tab ──────── */}
      {tab === 'solutions' && (
        <motion.div {...fadeUp(0)} className="grid gap-4">
          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTY_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setDifficultyFilter(f)}
                className="cursor-pointer"
              >
                <Badge
                  tone={f === 'All' ? 'neutral' : (f.toLowerCase() as 'easy' | 'medium' | 'hard')}
                  size="md"
                  className={difficultyFilter === f ? 'ring-1 ring-[var(--color-text-secondary)]' : 'opacity-60'}
                >
                  {f}
                </Badge>
              </button>
            ))}
          </div>

          {filteredSolutions.length === 0 ? (
            <EmptyState
              title="No solutions yet"
              description={difficultyFilter !== 'All' ? `No ${difficultyFilter} problems solved yet.` : 'Solve a problem to see it here.'}
            />
          ) : (
            <div className="grid gap-2">
              {filteredSolutions.map((entry, i) => (
                <motion.div key={entry.id} {...fadeUp(i * 0.04)}>
                  <GlassCard hoverable className="p-0">
                    <Link
                      href={`/practice/${entry.problem.slug}`}
                      className="flex items-center gap-3 px-4 py-3.5 no-underline"
                    >
                      <span className="text-[var(--color-success)] text-sm">✓</span>
                      <span className="flex-1 text-sm font-medium text-[var(--color-text-primary)]">
                        {entry.problem.title}
                      </span>
                      <Badge tone={entry.problem.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'} size="sm">
                        {entry.problem.difficulty}
                      </Badge>
                      <span className="text-[10px] text-[var(--color-text-tertiary)] min-w-[5ch] text-right">
                        {entry.attempts} att.
                      </span>
                      {entry.completedAt && (
                        <span className="text-[10px] text-[var(--color-text-tertiary)]">
                          {new Date(entry.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </Link>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ──────── 7c. Analytics Tab ──────── */}
      {tab === 'analytics' && (
        <motion.div {...fadeUp(0)}>
          {analytics ? (
            <GlassCard className="p-6">
              <AnalyticsCharts data={analytics} />
            </GlassCard>
          ) : (
            <EmptyState
              title="No analytics data"
              description="Submit solutions to see your analytics."
            />
          )}
        </motion.div>
      )}
    </div>
  )
}
