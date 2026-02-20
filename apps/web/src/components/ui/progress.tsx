import { cn } from '@/lib/cn'

interface ProgressProps {
  variant?: 'bar' | 'circular'
  value?: number
  max?: number
  indeterminate?: boolean
  className?: string
}

const RADIUS = 32
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function Progress({
  variant = 'bar',
  value = 0,
  max = 100,
  indeterminate = false,
  className,
}: ProgressProps) {
  const percentage = max ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0
  const dashOffset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE

  if (variant === 'circular') {
    return (
      <div className={cn('relative w-20 h-20 grid place-items-center', className)}>
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90" aria-hidden="true">
          <circle
            cx="40" cy="40" r={RADIUS}
            fill="none" stroke="var(--color-border-subtle)" strokeWidth="5"
          />
          <circle
            cx="40" cy="40" r={RADIUS}
            fill="none" stroke="var(--color-primary)" strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 260ms var(--ease)' }}
          />
        </svg>
        <span className="absolute font-[family-name:var(--font-display)] text-sm font-bold">
          {percentage}%
        </span>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <div className="h-2 border border-[var(--color-border)] rounded-[var(--radius-full)] bg-[var(--color-surface)] overflow-hidden">
        <div
          className={cn(
            'h-full rounded-[var(--radius-full)] bg-[var(--color-success)]',
            indeterminate ? 'w-[45%] animate-[brutal-loading_1s_linear_infinite]' : '',
          )}
          style={indeterminate ? undefined : { width: `${percentage}%`, transition: 'width 260ms var(--ease)' }}
        />
      </div>
      <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-text-secondary)]">
        {percentage}%
      </span>
    </div>
  )
}
