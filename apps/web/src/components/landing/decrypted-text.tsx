'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useInView } from 'framer-motion'

interface DecryptedTextProps {
  text: string
  speed?: number
  maxIterations?: number
  sequential?: boolean
  revealDirection?: 'start' | 'end' | 'center'
  useOriginalCharsOnly?: boolean
  characters?: string
  className?: string
  parentClassName?: string
  encryptedClassName?: string
  animateOn?: 'hover' | 'view' | 'both'
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

export function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = DEFAULT_CHARS,
  className,
  parentClassName,
  encryptedClassName,
  animateOn = 'hover',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isAnimating, setIsAnimating] = useState(false)
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const iterationRef = useRef(0)

  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })

  const charPool = useOriginalCharsOnly ? text.split('').filter(c => c !== ' ') : characters.split('')

  const randomChar = useCallback(
    () => charPool[Math.floor(Math.random() * charPool.length)],
    [charPool]
  )

  const getRevealOrder = useCallback(
    (length: number): number[] => {
      const indices = Array.from({ length }, (_, i) => i)
      if (revealDirection === 'end') return indices.reverse()
      if (revealDirection === 'center') {
        const mid = Math.floor(length / 2)
        return indices.sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid))
      }
      return indices
    },
    [revealDirection]
  )

  const animate = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setRevealedIndices(new Set())
    iterationRef.current = 0

    const revealOrder = getRevealOrder(text.length)
    let revealedCount = 0

    intervalRef.current = setInterval(() => {
      if (sequential) {
        if (revealedCount < text.length) {
          const nextIndex = revealOrder[revealedCount]
          setRevealedIndices(prev => new Set([...prev, nextIndex]))
          setDisplayText(
            text
              .split('')
              .map((char, i) => {
                if (char === ' ') return ' '
                if (revealedIndices.has(i) || i === nextIndex) return char
                return randomChar()
              })
              .join('')
          )
          revealedCount++
        } else {
          clearInterval(intervalRef.current!)
          setDisplayText(text)
          setIsAnimating(false)
        }
      } else {
        iterationRef.current++
        if (iterationRef.current >= maxIterations) {
          clearInterval(intervalRef.current!)
          setDisplayText(text)
          setRevealedIndices(new Set(Array.from({ length: text.length }, (_, i) => i)))
          setIsAnimating(false)
        } else {
          setDisplayText(
            text
              .split('')
              .map(char => (char === ' ' ? ' ' : randomChar()))
              .join('')
          )
        }
      }
    }, speed)
  }, [isAnimating, sequential, text, speed, maxIterations, getRevealOrder, randomChar, revealedIndices])

  // Trigger on view
  useEffect(() => {
    if ((animateOn === 'view' || animateOn === 'both') && isInView && !isAnimating) {
      animate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, animateOn])

  // Cleanup
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  const handleMouseEnter = () => {
    if (animateOn === 'hover' || animateOn === 'both') animate()
  }

  return (
    <span
      ref={ref}
      className={parentClassName}
      onMouseEnter={handleMouseEnter}
      style={{ display: 'inline-block' }}
    >
      {displayText.split('').map((char, i) => (
        <span
          key={i}
          className={
            char !== ' ' && !revealedIndices.has(i) && isAnimating
              ? encryptedClassName
              : className
          }
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}
