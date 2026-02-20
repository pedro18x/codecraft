'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { DecryptedText } from './decrypted-text'

export function FinalCta() {
  return (
    <section className="py-24 px-[var(--app-shell-gutter)] border-t border-[var(--color-border)]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-[var(--max-width-prose)] mx-auto text-center grid gap-6"
      >
        <h2 className="font-[family-name:var(--font-display)] font-extrabold text-[clamp(2rem,4vw,3rem)] leading-tight text-[var(--color-text-primary)]">
          <DecryptedText
            text="Ready to start practicing?"
            animateOn="view"
            sequential={true}
            revealDirection="start"
            speed={35}
            encryptedClassName="text-[var(--color-text-tertiary)]"
          />
        </h2>
        <p className="text-[var(--color-text-secondary)] text-lg">
          Join the community. Track your progress. Land the job.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 font-[family-name:var(--font-display)] font-bold text-lg border border-[var(--button-border)] rounded-[var(--radius-md)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-md)] hover:opacity-90 transition-all duration-200 no-underline"
          >
            Get started free
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
