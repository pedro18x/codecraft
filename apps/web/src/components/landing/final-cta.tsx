'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { DecryptedText } from './decrypted-text'

export function FinalCta() {
  return (
    <section className="py-24 px-[var(--app-shell-gutter)]">
      <div className="max-w-[var(--max-width-content)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard
            glow="none"
            style={{
              padding: '4rem 3rem',
              textAlign: 'center',
              display: 'grid',
              gap: '1.5rem',
            }}
          >
            <h2
              className="font-[family-name:var(--font-display)] font-extrabold leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--zen-text-primary)' }}
            >
              <DecryptedText
                text="Ready to start practicing?"
                animateOn="view"
                sequential={true}
                revealDirection="start"
                speed={35}
                encryptedClassName="text-[var(--color-text-tertiary)]"
              />
            </h2>

            <p style={{ color: 'var(--zen-text-secondary)', fontSize: '1.1rem', maxWidth: '40ch', margin: '0 auto' }}>
              Join the community. Track your progress. Land the job.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 font-[family-name:var(--font-display)] font-bold text-lg rounded-[var(--radius-md)] no-underline transition-all duration-200"
                style={{
                  background: 'var(--zen-accent-jade)',
                  color: 'var(--button-primary-text)',
                  boxShadow: '0 0 32px var(--glass-glow-jade)',
                }}
              >
                Get started free
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
