'use client'

import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type CardVariant = 'default' | 'flat' | 'elevated' | 'interactive'
type Accent = 'coral' | 'turquoise' | 'yellow' | null
type Padding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  accent?: Accent
  padding?: Padding
}

const variantStyles: Record<CardVariant, string> = {
  default: 'shadow-[var(--shadow-brutal)]',
  flat: 'shadow-none',
  elevated: 'shadow-[var(--shadow-brutal-lg)] hover:shadow-[var(--shadow-brutal-md)]',
  interactive:
    'shadow-[var(--shadow-brutal)] cursor-pointer hover:shadow-[var(--shadow-brutal-md)] active:shadow-[var(--shadow-brutal-sm)] transition-shadow duration-200',
}

const accentStyles: Record<string, string> = {
  coral: 'border-l-[3px] border-l-[var(--color-coral)]',
  turquoise: 'border-l-[3px] border-l-[var(--color-turquoise)]',
  yellow: 'border-l-[3px] border-l-[var(--color-yellow)]',
}

const paddingStyles: Record<Padding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({
  variant = 'default',
  accent,
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)]',
        variantStyles[variant],
        accent && accentStyles[accent],
        paddingStyles[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
