'use client'

import { motion, useInView, useAnimation } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface BlurTextProps {
  text: string
  delay?: number
  animateBy?: 'words' | 'characters'
  direction?: 'top' | 'bottom'
  stepDuration?: number
  className?: string
}

export function BlurText({
  text,
  delay = 80,
  animateBy = 'words',
  direction = 'top',
  stepDuration = 0.4,
  className,
}: BlurTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  const tokens = animateBy === 'words' ? text.split(' ') : text.split('')

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <span ref={ref} className={className} style={{ display: 'inline' }}>
      {tokens.map((token, index) => (
        <motion.span
          key={index}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: {
              opacity: 0,
              filter: 'blur(10px)',
              y: direction === 'top' ? -20 : 20,
            },
            visible: {
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
            },
          }}
          transition={{
            duration: stepDuration,
            delay: (index * delay) / 1000,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {token}
          {animateBy === 'words' && index < tokens.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  )
}
