'use client'

import { useEffect, useRef } from 'react'
import {
  useMotionValue,
  useSpring,
  useInView,
  motion,
} from 'framer-motion'

interface CountUpProps {
  to: number
  from?: number
  direction?: 'up' | 'down'
  delay?: number
  duration?: number
  className?: string
  startWhen?: boolean
  separator?: string
  onStart?: () => void
  onEnd?: () => void
}

export function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 1.5,
  className,
  startWhen = true,
  separator = '',
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })

  const start = direction === 'down' ? to : from
  const end = direction === 'down' ? from : to

  const motionValue = useMotionValue(start)
  const springValue = useSpring(motionValue, {
    stiffness: 80,
    damping: 20,
    duration,
  })

  const started = useRef(false)

  useEffect(() => {
    if (isInView && startWhen && !started.current) {
      started.current = true
      const timeout = setTimeout(() => {
        onStart?.()
        motionValue.set(end)
      }, delay * 1000)
      return () => clearTimeout(timeout)
    }
  }, [isInView, startWhen, delay, motionValue, end, onStart])

  useEffect(() => {
    const unsub = springValue.on('change', (latest) => {
      if (!ref.current) return
      const rounded = Math.round(latest)
      const formatted = separator
        ? rounded.toLocaleString().replace(/,/g, separator)
        : rounded.toString()
      ref.current.textContent = formatted
      if (rounded === end) onEnd?.()
    })
    return unsub
  }, [springValue, separator, end, onEnd])

  return (
    <motion.span ref={ref} className={className}>
      {start}
    </motion.span>
  )
}
