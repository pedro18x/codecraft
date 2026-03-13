import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'easy' | 'medium' | 'hard' | 'neutral' | 'success' | 'warning' | 'error' | 'info'
type BadgeSize = 'sm' | 'md'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  size?: BadgeSize
}

const toneStyles: Record<Tone, string> = {
  easy: 'bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]',
  success: 'bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]',
  medium: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning)]',
  warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning)]',
  hard: 'bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error)]',
  error: 'bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error)]',
  info: 'bg-[var(--color-info-bg)] text-[var(--color-info)] border-[var(--color-info)]',
  neutral: 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] border-[var(--color-border)]',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[0.63rem] px-[0.45rem] py-[0.24rem]',
  md: 'text-[0.72rem] px-[0.58rem] py-[0.34rem]',
}

export function Badge({ tone = 'neutral', size = 'md', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center border rounded-[var(--radius-full)]',
        'font-[family-name:var(--font-display)] font-semibold tracking-[0.02em] leading-none',
        'transition-opacity duration-[var(--duration-fast)] hover:opacity-85',
        toneStyles[tone],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
