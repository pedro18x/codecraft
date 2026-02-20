'use client'

import { useProblems } from '@/hooks/use-problems'
import { CountUp } from './count-up'

interface Stat {
  value?: number
  label: string
  suffix?: string
  pill?: boolean
  loading?: boolean
}

export function StatsBar() {
  const { data: problems, isLoading } = useProblems()
  const problemCount = problems?.length

  const stats: Stat[] = [
    { value: problemCount, loading: isLoading, suffix: '+', label: 'Problems' },
    { value: 3, label: 'Languages' },
    { value: 12, label: 'Topics' },
    { pill: true, label: 'Instant test feedback' },
  ]

  return (
    <div className="py-10 border-y border-[var(--color-border)] bg-[var(--color-surface)]/40 backdrop-blur-sm">
      <div className="max-w-[var(--max-width-content)] mx-auto px-[var(--app-shell-gutter)]">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-8 md:gap-16">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="hidden sm:block text-[var(--color-text-tertiary)] text-2xl select-none"
                >
                  ·
                </span>
              )}
              {stat.pill ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--color-success-bg)] border border-[var(--color-border)] text-sm font-medium text-[var(--color-success)]">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="currentColor"
                    className="shrink-0"
                    aria-hidden="true"
                  >
                    <circle cx="5" cy="5" r="5" />
                  </svg>
                  {stat.label}
                </span>
              ) : (
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-[var(--color-primary)] font-[family-name:var(--font-display)] leading-none">
                    {stat.loading || stat.value === undefined ? (
                      <span className="opacity-40">…</span>
                    ) : (
                      <>
                        <CountUp
                          to={stat.value}
                          duration={1.5}
                          delay={0.1 * i}
                        />
                        {stat.suffix && <span>{stat.suffix}</span>}
                      </>
                    )}
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                    {stat.label}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
