'use client'

import { useProblems } from '@/hooks/use-problems'
import { CountUp } from './count-up'
import { GlassCard } from '@/components/ui/glass-card'
import { motion } from 'framer-motion'

export function StatsBar() {
  const { data: problems, isLoading } = useProblems()
  const problemCount = problems?.length

  const stats = [
    { value: problemCount, loading: isLoading, suffix: '+', label: 'Problems' },
    { value: 3, label: 'Languages' },
    { value: 12, label: 'Topics' },
    { pill: true, label: 'Instant feedback' },
  ] as const

  return (
    <div className="py-10 px-[var(--app-shell-gutter)]">
      <div className="max-w-[var(--max-width-content)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard
            style={{
              padding: '1.25rem 2rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {stats.map((stat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    style={{
                      width: 1,
                      height: 32,
                      background: 'var(--glass-border)',
                      display: 'block',
                      margin: '0 1rem',
                    }}
                  />
                )}

                {'pill' in stat && stat.pill ? (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      background: 'rgba(62,122,85,0.12)',
                      border: '1px solid rgba(62,122,85,0.25)',
                      color: 'var(--zen-accent-jade)',
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--zen-accent-jade)', boxShadow: '0 0 6px var(--glass-glow-jade)' }} />
                    {stat.label}
                  </span>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div
                      className="font-[family-name:var(--font-display)] font-extrabold leading-none"
                      style={{ fontSize: '1.75rem', color: 'var(--zen-accent-jade)' }}
                    >
                      {'loading' in stat && (stat.loading || stat.value === undefined) ? (
                        <span style={{ opacity: 0.4 }}>…</span>
                      ) : (
                        <>
                          <CountUp to={'value' in stat ? (stat.value ?? 0) : 0} duration={1.5} />
                          {'suffix' in stat && stat.suffix && <span>{stat.suffix}</span>}
                        </>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--zen-text-tertiary)', marginTop: 2 }}>
                      {stat.label}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
