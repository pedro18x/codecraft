'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { BlurText } from '@/components/landing/blur-text'
import { ShinyText } from '@/components/landing/shiny-text'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

function fadeUpVariant(delay: number) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, delay, ease: EASE } },
  }
}

export function Hero() {
  const { isAuthenticated } = useAuth()

  return (
    <section
      className="relative pt-24 pb-20 px-[var(--app-shell-gutter)] text-center overflow-hidden"
      style={{ minHeight: '90vh' }}
    >
      {/* Scanline CRT texture */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[var(--max-width-prose)] mx-auto grid gap-6">
        {/* Badge — fade-up entrance + infinite subtle pulse */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, scale: [1, 1.02, 1] }}
          transition={{
            opacity: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
            y: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
            scale: { repeat: Infinity, duration: 2.8, ease: 'easeInOut', delay: 0.5 },
          }}
          className="inline-flex mx-auto items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
          Code. Practice. Ship.
        </motion.span>

        {/* H1 — split into two BlurText spans */}
        <h1 className="font-[family-name:var(--font-display)] font-extrabold text-[clamp(2.4rem,5vw,3.5rem)] leading-[1.1] text-[var(--color-text-primary)]">
          <BlurText
            text="Master coding interviews"
            animateBy="words"
            direction="top"
            delay={80}
            stepDuration={0.4}
          />
          {' '}
          <ShinyText
            text="the Zen way"
            className="text-[var(--color-primary)]"
            speed={3}
          />
        </h1>

        <motion.p
          {...fadeUpVariant(0.2)}
          className="text-lg text-[var(--color-text-secondary)] max-w-[40ch] mx-auto leading-relaxed"
        >
          Practice real interview problems with an editor that stays out of your way.
          Build focus, not frustration.
        </motion.p>

        <motion.div {...fadeUpVariant(0.3)} className="flex flex-wrap gap-3 justify-center pt-2">
          <Link
            href={isAuthenticated ? '/dashboard' : '/register'}
            className="inline-flex items-center gap-2 px-6 py-3 font-[family-name:var(--font-display)] font-bold text-base border border-[var(--button-border)] rounded-[var(--radius-md)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] shadow-[var(--shadow-brutal-sm)] hover:shadow-[var(--shadow-brutal)] hover:opacity-90 transition-all duration-200 no-underline"
          >
            {isAuthenticated ? 'Go to dashboard' : 'Get started free'}
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 font-[family-name:var(--font-display)] font-bold text-base border border-[var(--button-border)] rounded-[var(--radius-md)] bg-[var(--button-ghost-bg)] text-[var(--button-ghost-text)] shadow-[var(--shadow-brutal-sm)] hover:shadow-[var(--shadow-brutal)] hover:opacity-90 transition-all duration-200 no-underline"
          >
            Browse problems
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
