'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const steps = [
  {
    n: '01',
    title: 'Pick a problem',
    body: 'Browse by difficulty, topic, or let the daily challenge guide you.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Write your solution',
    body: 'A distraction-free Monaco editor with syntax highlighting and auto-save.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M6.28 5.22a.75.75 0 0 1 0 1.06L2.56 10l3.72 3.72a.75.75 0 0 1-1.06 1.06L.97 10.53a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0zm7.44 0a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Run the tests',
    body: 'Get instant feedback across multiple test cases. Debug with confidence.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84z" />
      </svg>
    ),
  },
  {
    n: '04',
    title: 'Track progress',
    body: 'Your streak, solved count, and leaderboard rank update automatically.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2zM10 6a1.5 1.5 0 0 0-1.5 1.5v9a1.5 1.5 0 0 0 3 0v-9A1.5 1.5 0 0 0 10 6zM4.5 9A1.5 1.5 0 0 0 3 10.5v6a1.5 1.5 0 0 0 3 0v-6A1.5 1.5 0 0 0 4.5 9z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [24, -24])

  return (
    <section ref={ref} className="py-20 px-[var(--app-shell-gutter)]">
      <div className="max-w-[var(--max-width-content)] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          style={{ y }}
          className="text-center font-[family-name:var(--font-display)] font-bold text-3xl text-[var(--color-text-primary)] mb-12"
        >
          How it works
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-brutal-sm)]"
            >
              <div className="text-[var(--color-primary)] mb-4 opacity-80">{step.icon}</div>
              <span className="font-[family-name:var(--font-mono)] text-xs font-medium text-[var(--color-primary)] mb-3 block">{step.n}</span>
              <h3 className="font-[family-name:var(--font-display)] font-bold text-base text-[var(--color-text-primary)] mb-2">{step.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
