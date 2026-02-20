'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  block?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-hover)]',
  secondary:
    'bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-hover)]',
  ghost:
    'bg-[var(--button-ghost-bg)] text-[var(--button-ghost-text)] hover:bg-[var(--button-ghost-hover)]',
  danger:
    'bg-[var(--button-danger-bg)] text-[var(--button-danger-text)] hover:bg-[var(--button-danger-hover)]',
}

const sizeStyles: Record<Size, string> = {
  sm: 'min-h-[2.4rem] px-[0.9rem] py-1 text-sm',
  md: 'min-h-[2.95rem] px-[1.2rem] py-2 text-base',
  lg: 'min-h-[3.4rem] px-[1.4rem] py-2.5 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading,
      disabled,
      block,
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center gap-[0.55rem]',
        'font-[family-name:var(--font-display)] font-bold tracking-[0.005em] leading-tight',
        'border border-[var(--button-border)] rounded-[var(--radius-md)]',
        'shadow-[var(--shadow-brutal-sm)] cursor-pointer select-none overflow-hidden',
        'transition-[box-shadow,opacity,background-color,border-color] duration-[var(--duration-fast)]',
        'hover:shadow-[var(--shadow-brutal)] hover:opacity-[0.92]',
        'active:shadow-[var(--shadow-brutal-sm)] active:opacity-[0.85]',
        'focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(199,91,58,0.35)]',
        'disabled:opacity-55 disabled:cursor-not-allowed disabled:shadow-none disabled:border-[var(--color-border-subtle)]',
        variantStyles[variant],
        sizeStyles[size],
        block && 'w-full',
        className,
      )}
      {...props}
    >
      {loading && (
        <span
          className="w-[0.9rem] h-[0.9rem] border-2 border-current border-r-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  ),
)

Button.displayName = 'Button'
