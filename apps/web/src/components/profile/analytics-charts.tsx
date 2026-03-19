'use client'

import { motion } from 'framer-motion'
import type { SubmissionAnalytics } from '@/types/api'

interface AnalyticsChartsProps {
  data: SubmissionAnalytics
}

const LANGUAGE_COLORS: Record<string, string> = {
  javascript: 'var(--zen-accent-amber, #C9A84C)',
  typescript: 'var(--zen-text-secondary, #9E9890)',
  python: 'var(--zen-accent-moss, #7B8F6A)',
}
const DEFAULT_COLOR = 'var(--zen-accent-jade, #3E7A55)'

// --- Language Donut Chart ---
function LanguageDonut({ breakdown, total }: { breakdown: SubmissionAnalytics['languageBreakdown']; total: number }) {
  if (breakdown.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-[var(--color-text-tertiary)]">
        No submissions yet
      </div>
    )
  }

  const RADIUS = 50
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  let offset = 0

  const segments = breakdown.map((entry) => {
    const pct = total > 0 ? entry.count / total : 0
    const dash = pct * CIRCUMFERENCE
    const segment = { ...entry, dash, offset, color: LANGUAGE_COLORS[entry.language] ?? DEFAULT_COLOR }
    offset += dash
    return segment
  })

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 120 120" className="w-28 h-28 -rotate-90 shrink-0">
        {segments.map((seg, i) => (
          <motion.circle
            key={seg.language}
            cx="60" cy="60" r={RADIUS}
            fill="none"
            stroke={seg.color}
            strokeWidth="16"
            strokeDasharray={`${seg.dash} ${CIRCUMFERENCE - seg.dash}`}
            strokeDashoffset={-seg.offset}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
          />
        ))}
        <text
          x="60" y="60"
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--zen-text-primary, #E8E4DF)"
          fontSize="18"
          fontWeight="bold"
          fontFamily="var(--font-display)"
          transform="rotate(90, 60, 60)"
        >
          {total}
        </text>
      </svg>
      <div className="grid gap-2">
        {segments.map((seg) => (
          <div key={seg.language} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: seg.color }} />
            <span className="text-[var(--color-text-secondary)] capitalize">{seg.language}</span>
            <span className="text-[var(--color-text-tertiary)] ml-auto">{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Pass Rate Gauge ---
function PassRateGauge({ rate }: { rate: number }) {
  const RADIUS = 50
  const SEMI_CIRCUMFERENCE = Math.PI * RADIUS
  const filled = (rate / 100) * SEMI_CIRCUMFERENCE

  const color = rate >= 70
    ? 'var(--zen-accent-jade, #3E7A55)'
    : rate >= 40
      ? 'var(--zen-accent-amber, #C9A84C)'
      : 'var(--zen-accent-rust, #C75B3A)'

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="w-32 h-[4.5rem]">
        <path
          d="M 10 65 A 50 50 0 0 1 110 65"
          fill="none"
          stroke="var(--zen-surface-2, #2A2724)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <motion.path
          d="M 10 65 A 50 50 0 0 1 110 65"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${SEMI_CIRCUMFERENCE}`}
          initial={{ strokeDashoffset: SEMI_CIRCUMFERENCE }}
          animate={{ strokeDashoffset: SEMI_CIRCUMFERENCE - filled }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <text
          x="60" y="60"
          textAnchor="middle"
          fill="var(--zen-text-primary, #E8E4DF)"
          fontSize="20"
          fontWeight="bold"
          fontFamily="var(--font-display)"
        >
          {rate}%
        </text>
      </svg>
      <span className="text-xs text-[var(--color-text-tertiary)] -mt-1">Pass Rate</span>
    </div>
  )
}

// --- Weekly Trend Bars ---
function WeeklyTrend({ trend }: { trend: SubmissionAnalytics['recentTrend'] }) {
  if (trend.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-[var(--color-text-tertiary)]">
        No recent activity
      </div>
    )
  }

  const maxPerWeek = Math.max(...trend.map((w) => w.passed + w.failed), 1)
  const BAR_WIDTH = 28
  const MAX_HEIGHT = 80

  return (
    <div className="flex items-end gap-2 justify-center">
      {trend.map((week, i) => {
        const total = week.passed + week.failed
        const passH = (week.passed / maxPerWeek) * MAX_HEIGHT
        const failH = (week.failed / maxPerWeek) * MAX_HEIGHT
        return (
          <div key={week.week} className="flex flex-col items-center gap-1">
            <div className="flex flex-col-reverse" style={{ height: MAX_HEIGHT }}>
              <motion.div
                className="rounded-t-[3px]"
                style={{ width: BAR_WIDTH, background: 'var(--zen-accent-jade, #3E7A55)' }}
                initial={{ height: 0 }}
                animate={{ height: passH }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              />
              <motion.div
                className="rounded-t-[3px]"
                style={{ width: BAR_WIDTH, background: 'var(--zen-accent-rust, #C75B3A)' }}
                initial={{ height: 0 }}
                animate={{ height: failH }}
                transition={{ delay: i * 0.08 + 0.1, duration: 0.4 }}
              />
            </div>
            <span className="text-[9px] text-[var(--color-text-tertiary)]">
              {week.week.slice(5)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4">Languages</h4>
        <LanguageDonut breakdown={data.languageBreakdown} total={data.totalSubmissions} />
      </div>
      <div className="flex flex-col items-center">
        <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4 self-start">Pass Rate</h4>
        <PassRateGauge rate={data.passRate} />
        {data.avgExecutionTime !== null && (
          <p className="text-xs text-[var(--color-text-tertiary)] mt-3">
            Avg execution: <span className="text-[var(--color-text-secondary)] font-medium">{data.avgExecutionTime}ms</span>
          </p>
        )}
      </div>
      <div className="sm:col-span-2">
        <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4">Weekly Trend (last 8 weeks)</h4>
        <WeeklyTrend trend={data.recentTrend} />
        <div className="flex items-center gap-4 mt-3 justify-center text-xs text-[var(--color-text-tertiary)]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--zen-accent-jade, #3E7A55)' }} /> Passed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--zen-accent-rust, #C75B3A)' }} /> Failed
          </span>
        </div>
      </div>
    </div>
  )
}
