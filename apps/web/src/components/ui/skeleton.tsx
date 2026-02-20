import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number
  height?: string | number
  rounded?: boolean
}

export function Skeleton({ width, height, rounded, className, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-[var(--color-surface-raised)] animate-shimmer',
        'bg-[linear-gradient(90deg,var(--color-surface-raised)_0%,var(--color-surface-hover)_50%,var(--color-surface-raised)_100%)]',
        'bg-[length:200%_100%]',
        rounded ? 'rounded-full' : 'rounded-[var(--radius-md)]',
        className,
      )}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...props}
    />
  )
}
