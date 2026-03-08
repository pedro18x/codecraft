'use client'

import { motion } from 'framer-motion'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  /** Seconds per word */
  duration?: number
  /** Stagger between each word in seconds */
  stagger?: number
}

const EASE = [0.22, 1, 0.36, 1] as const

export function SplitText({
  text,
  className = '',
  delay = 0,
  duration = 0.65,
  stagger = 0.07,
}: SplitTextProps) {
  const words = text.split(' ')

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.28em', verticalAlign: 'bottom' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '105%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: EASE,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
