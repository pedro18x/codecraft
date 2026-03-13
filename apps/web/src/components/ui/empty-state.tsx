import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 text-center py-16 px-8',
        className,
      )}
    >
      {icon && (
        <div className="text-4xl opacity-40">{icon}</div>
      )}
      <div className="grid gap-2">
        <h3 className="font-[family-name:var(--font-display)] font-bold text-lg text-[var(--color-text-primary)]">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[var(--color-text-secondary)] max-w-[32ch] mx-auto">
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
