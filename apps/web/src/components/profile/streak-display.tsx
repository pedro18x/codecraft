'use client'

import { GlassCard } from '@/components/ui/glass-card'
import { CountUp } from '@/components/landing/count-up'
import type { Streak } from '@/types/api'

interface StreakDisplayProps {
  data: Streak
}

const STATS = [
  { key: 'currentStreak' as const, label: 'Current Streak', icon: '🔥', suffix: 'd' },
  { key: 'longestStreak' as const, label: 'Longest Streak', icon: '🏆', suffix: 'd' },
  { key: 'totalActiveDays' as const, label: 'Active Days', icon: '📅', suffix: '' },
]

export function StreakDisplay({ data }: StreakDisplayProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {STATS.map((stat) => (
        <GlassCard key={stat.key} className="px-4 py-3 flex items-center gap-3">
          <span className="text-lg">{stat.icon}</span>
          <div>
            <div className="flex items-baseline gap-1">
              <CountUp
                to={data[stat.key]}
                className="font-[family-name:var(--font-display)] font-bold text-lg text-[var(--color-text-primary)]"
              />
              {stat.suffix && (
                <span className="text-xs text-[var(--color-text-tertiary)]">{stat.suffix}</span>
              )}
            </div>
            <span className="text-[11px] text-[var(--color-text-secondary)]">{stat.label}</span>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
