'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { SplitText } from '@/components/landing/split-text'
import { ShinyText } from '@/components/landing/shiny-text'
import { GlassCard } from '@/components/ui/glass-card'

const EASE = [0.22, 1, 0.36, 1] as const

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: EASE } },
  }
}

const PREVIEW_LINES = [
  { tokens: [{ text: 'function ', color: 'var(--zen-accent-slate)' }, { text: 'merge', color: 'var(--zen-accent-jade)' }, { text: '(intervals) {', color: 'var(--zen-text-primary)' }] },
  { tokens: [{ text: '  intervals', color: 'var(--zen-text-primary)' }, { text: '.sort(', color: 'var(--zen-text-secondary)' }, { text: '(a, b)', color: 'var(--zen-accent-amber)' }, { text: ' => a[', color: 'var(--zen-text-secondary)' }, { text: '0', color: 'var(--zen-accent-rust)' }, { text: '] - b[', color: 'var(--zen-text-secondary)' }, { text: '0', color: 'var(--zen-accent-rust)' }, { text: '])', color: 'var(--zen-text-secondary)' }] },
  { tokens: [{ text: '  const ', color: 'var(--zen-accent-slate)' }, { text: 'result', color: 'var(--zen-text-primary)' }, { text: ' = [intervals[', color: 'var(--zen-text-secondary)' }, { text: '0', color: 'var(--zen-accent-rust)' }, { text: ']]', color: 'var(--zen-text-secondary)' }] },
  { tokens: [{ text: '  for ', color: 'var(--zen-accent-slate)' }, { text: '(const ', color: 'var(--zen-text-secondary)' }, { text: 'curr ', color: 'var(--zen-text-primary)' }, { text: 'of intervals) {', color: 'var(--zen-text-secondary)' }] },
  { tokens: [{ text: '    const ', color: 'var(--zen-accent-slate)' }, { text: 'last ', color: 'var(--zen-text-primary)' }, { text: '= result.at(', color: 'var(--zen-text-secondary)' }, { text: '-1', color: 'var(--zen-accent-rust)' }, { text: ')!', color: 'var(--zen-text-secondary)' }] },
  { tokens: [{ text: '    if ', color: 'var(--zen-accent-slate)' }, { text: '(curr[', color: 'var(--zen-text-secondary)' }, { text: '0', color: 'var(--zen-accent-rust)' }, { text: '] <= last[', color: 'var(--zen-text-secondary)' }, { text: '1', color: 'var(--zen-accent-rust)' }, { text: ']) {', color: 'var(--zen-text-secondary)' }] },
  { tokens: [{ text: '      last[', color: 'var(--zen-text-secondary)' }, { text: '1', color: 'var(--zen-accent-rust)' }, { text: '] = Math.max(last[', color: 'var(--zen-text-secondary)' }, { text: '1', color: 'var(--zen-accent-rust)' }, { text: '], curr[', color: 'var(--zen-text-secondary)' }, { text: '1', color: 'var(--zen-accent-rust)' }, { text: '])', color: 'var(--zen-text-secondary)' }] },
  { tokens: [{ text: '  return ', color: 'var(--zen-accent-slate)' }, { text: 'result', color: 'var(--zen-text-primary)' }] },
]

const TEST_RESULTS = [
  { pass: true, label: 'Test 1 — [[1,3],[2,6]]' },
  { pass: true, label: 'Test 2 — [[1,4],[4,5]]' },
  { pass: false, label: 'Test 3 — [[1,4],[2,3]]' },
]

export function Hero() {
  const { isAuthenticated } = useAuth()

  return (
    <section
      className="relative px-[var(--app-shell-gutter)] overflow-hidden"
      style={{ minHeight: '92vh', display: 'flex', alignItems: 'center' }}
    >
      <div
        className="relative w-full max-w-[var(--max-width-content)] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        style={{ paddingTop: '6rem', paddingBottom: '4rem' }}
      >
        {/* ── LEFT: Text + CTAs ─────────────────── */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>

          {/* Badge */}
          <motion.span
            {...fadeUp(0)}
            className="inline-flex w-fit items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-full)]"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(8px)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--zen-accent-jade)',
                boxShadow: '0 0 6px var(--glass-glow-jade)',
              }}
            />
            Code. Practice. Ship.
          </motion.span>

          {/* H1 */}
          <h1
            className="font-[family-name:var(--font-display)] font-extrabold leading-[1.08]"
            style={{ fontSize: 'clamp(2.6rem, 4.5vw, 4rem)', color: 'var(--zen-text-primary)' }}
          >
            <SplitText
              text="Master coding interviews"
              delay={0.05}
              duration={0.65}
            />
            <br />
            <ShinyText
              text="the zen way."
              className="text-[var(--zen-accent-jade)]"
              speed={4}
            />
          </h1>

          {/* Subheading */}
          <motion.p
            {...fadeUp(0.35)}
            className="text-lg leading-relaxed max-w-[38ch]"
            style={{ color: 'var(--zen-text-secondary)' }}
          >
            Practice real interview problems with a distraction-free editor.
            Build focus, not frustration.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.45)} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href={isAuthenticated ? '/dashboard' : '/register'}
              className="inline-flex items-center gap-2 px-6 py-3 font-[family-name:var(--font-display)] font-bold text-base rounded-[var(--radius-md)] no-underline transition-all duration-200"
              style={{
                background: 'var(--zen-accent-jade)',
                color: '#E8E4DF',
                border: '1px solid rgba(62,122,85,0.6)',
                boxShadow: '0 0 24px var(--glass-glow-jade)',
              }}
            >
              {isAuthenticated ? 'Go to dashboard' : 'Get started free'}
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 font-[family-name:var(--font-display)] font-bold text-base rounded-[var(--radius-md)] no-underline transition-all duration-200"
              style={{
                background: 'var(--glass-bg)',
                color: 'var(--zen-text-primary)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Browse problems
            </Link>
          </motion.div>
        </div>

        {/* ── RIGHT: Glass Editor Preview ─────── */}
        <motion.div
          initial={{ opacity: 0, x: 32, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          <GlassCard glow="jade" style={{ overflow: 'hidden' }}>
            {/* Browser chrome bar */}
            <div
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              {(['#C75B3A', '#C9A84C', '#3E7A55'] as const).map((c, i) => (
                <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
              ))}
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--zen-text-tertiary)',
                }}
              >
                Merge Intervals — Medium
              </span>
            </div>

            {/* Code area */}
            <div style={{ padding: '1rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7 }}>
              {PREVIEW_LINES.map((line, lineIdx) => (
                <div key={lineIdx} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: 'var(--zen-text-tertiary)', userSelect: 'none', minWidth: 16, textAlign: 'right', fontSize: 11 }}>
                    {lineIdx + 1}
                  </span>
                  <span>
                    {line.tokens.map((t, ti) => (
                      <span key={ti} style={{ color: t.color }}>{t.text}</span>
                    ))}
                  </span>
                </div>
              ))}
            </div>

            {/* Test results */}
            <div
              style={{
                borderTop: '1px solid var(--glass-border)',
                padding: '0.75rem 1.25rem',
                display: 'grid',
                gap: 4,
                background: 'rgba(255,255,255,0.01)',
              }}
            >
              {TEST_RESULTS.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: t.pass ? 'var(--zen-accent-jade)' : 'var(--zen-accent-rust)' }}>
                    {t.pass ? '✓' : '✗'}
                  </span>
                  <span style={{ color: t.pass ? 'var(--zen-text-secondary)' : 'var(--zen-accent-rust)', opacity: t.pass ? 0.7 : 1 }}>
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
