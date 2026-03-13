'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface TooltipProps {
  content: string
  children: ReactNode
  placement?: 'top' | 'bottom'
  className?: string
}

export function Tooltip({ content, children, placement = 'top', className }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-2.5 py-1.5 max-w-[200px]',
            'text-xs font-medium whitespace-nowrap',
            'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]',
            'border border-[var(--color-border)] rounded-[var(--radius-sm)]',
            'shadow-[var(--shadow-brutal-md)]',
            'pointer-events-none animate-fade-in',
            placement === 'top'
              ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
              : 'top-full mt-2 left-1/2 -translate-x-1/2',
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
