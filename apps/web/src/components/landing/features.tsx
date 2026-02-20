'use client'

import { motion } from 'framer-motion'
import { SpotlightCard } from './spotlight-card'
import { DecryptedText } from './decrypted-text'

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M6 16h6" />
      </svg>
    ),
    title: 'Distraction-free editor',
    body: 'Monaco editor with syntax highlighting. Nothing between you and the problem.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 12l2 2 4-4" />
        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.51 0 2.93.37 4.18 1.03" />
        <path d="M20 4l-8 8" />
        <path d="M15 4h5v5" />
      </svg>
    ),
    title: 'Instant test feedback',
    body: 'Run all test cases in one click. See exactly which inputs fail and why.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    title: 'Track every session',
    body: 'Solved count, streak, leaderboard rank — all update the moment you submit.',
  },
]

export function Features() {
  return (
    <section className="py-20 px-[var(--app-shell-gutter)]">
      <div className="max-w-[var(--max-width-content)] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center font-[family-name:var(--font-display)] font-bold text-3xl text-[var(--color-text-primary)] mb-12"
        >
          <DecryptedText
            text="Built for focused practice"
            animateOn="view"
            sequential={true}
            revealDirection="start"
            speed={40}
            encryptedClassName="text-[var(--color-text-tertiary)]"
          />
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <SpotlightCard className="h-[280px]">
                <div className="flex flex-col h-full p-6 gap-4">
                  <div className="text-[var(--color-primary)]">
                    {feature.icon}
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] font-bold text-lg text-[var(--color-text-primary)] leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex-1">
                    {feature.body}
                  </p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
