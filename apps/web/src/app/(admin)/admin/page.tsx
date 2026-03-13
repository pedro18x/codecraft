'use client'

import { useAdminDashboard } from '@/hooks/use-admin'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/cn'

const difficultyColors: Record<string, string> = {
  Easy: 'bg-[var(--color-success)]',
  Medium: 'bg-[var(--color-warning)]',
  Hard: 'bg-[var(--color-error)]',
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminDashboard()

  if (isLoading) {
    return (
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><Skeleton height={80} /></Card>
          ))}
        </div>
        <Skeleton height={300} />
      </div>
    )
  }

  if (!data) return null

  const stats = [
    { label: 'Total Users', value: data.totalUsers, accent: 'coral' as const },
    { label: 'Total Problems', value: data.totalProblems, accent: 'turquoise' as const },
    { label: 'Total Submissions', value: data.totalSubmissions, accent: 'yellow' as const },
    { label: 'Success Rate', value: `${data.successRate}%`, accent: null },
  ]

  const maxProblems = Math.max(...Object.values(data.problemsByDifficulty), 1)

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} accent={s.accent}>
            <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
              {s.label}
            </p>
            <p className="text-3xl font-bold font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
              {s.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problems by difficulty */}
        <Card>
          <h2 className="font-[family-name:var(--font-display)] font-bold text-lg mb-4">Problems by Difficulty</h2>
          <div className="flex flex-col gap-3">
            {['Easy', 'Medium', 'Hard'].map((d) => {
              const count = data.problemsByDifficulty[d] || 0
              const pct = (count / maxProblems) * 100
              return (
                <div key={d}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-[var(--color-text-primary)]">{d}</span>
                    <span className="text-[var(--color-text-secondary)]">{count}</span>
                  </div>
                  <div className="h-3 bg-[var(--color-surface-raised)] rounded-[var(--radius-full)] overflow-hidden">
                    <div
                      className={cn('h-full rounded-[var(--radius-full)] transition-all duration-500', difficultyColors[d])}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Recent users */}
        <Card>
          <h2 className="font-[family-name:var(--font-display)] font-bold text-lg mb-4">Recent Users</h2>
          <div className="flex flex-col gap-2">
            {data.recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-1.5 border-b border-[var(--color-border)] last:border-0">
                <div>
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">{u.username}</span>
                  <span className="text-xs text-[var(--color-text-tertiary)] ml-2">{u.email}</span>
                </div>
                <Badge tone={u.role === 'admin' ? 'info' : 'neutral'} size="sm">{u.role}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent submissions */}
      <Card className="mt-6">
        <h2 className="font-[family-name:var(--font-display)] font-bold text-lg mb-4">Recent Submissions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['User', 'Problem', 'Language', 'Result', 'Time'].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.recentSubmissions.map((s) => (
                <tr key={s.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-3 py-2 text-sm">{s.user.username}</td>
                  <td className="px-3 py-2 text-sm">{s.problem.title}</td>
                  <td className="px-3 py-2 text-sm">{s.language}</td>
                  <td className="px-3 py-2">
                    <Badge tone={s.success ? 'success' : 'error'} size="sm">
                      {s.success ? 'Pass' : 'Fail'}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-sm text-[var(--color-text-secondary)]">
                    {s.executionTimeMs ? `${s.executionTimeMs}ms` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
