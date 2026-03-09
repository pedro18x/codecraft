import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Glow accent on top edge: 'jade' | 'rust' | 'amber' | 'none' */
  glow?: 'jade' | 'rust' | 'amber' | 'none'
  /** Extra hover lift effect */
  hoverable?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = 'none', hoverable = false, children, style, ...props }, ref) => {
    const glowMap = {
      jade: 'var(--glass-glow-jade)',
      rust: 'var(--glass-glow-rust)',
      amber: 'var(--glass-glow-amber)',
      none: 'transparent',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-[var(--radius-xl)] border overflow-hidden',
          hoverable && 'transition-all duration-300 hover:-translate-y-1',
          className
        )}
        style={{
          background: 'var(--glass-bg)',
          borderColor: 'var(--glass-border)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: glow !== 'none'
            ? `var(--shadow-glass), 0 -1px 0 0 ${glowMap[glow]}, 0 0 40px ${glowMap[glow]}`
            : 'var(--shadow-glass)',
          ...style,
        }}
        {...props}
      >
        {/* Top edge highlight */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${glow !== 'none' ? glowMap[glow] : 'var(--glass-border-hover)'}, transparent)`,
            pointerEvents: 'none',
          }}
        />
        {children}
      </div>
    )
  }
)

GlassCard.displayName = 'GlassCard'
