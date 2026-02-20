'use client'

import { useRef, useState, CSSProperties } from 'react'
import { motion, useSpring } from 'framer-motion'

interface TiltedCardProps {
  containerHeight?: string
  containerWidth?: string
  cardHeight?: string
  cardWidth?: string
  scaleOnHover?: number
  rotateAmplitude?: number
  className?: string
  children: React.ReactNode
}

export function TiltedCard({
  containerHeight = '280px',
  containerWidth = '100%',
  cardHeight = '100%',
  cardWidth = '100%',
  scaleOnHover = 1.03,
  rotateAmplitude = 12,
  className,
  children,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const rotateX = useSpring(0, { stiffness: 200, damping: 20 })
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 })
  const scale = useSpring(1, { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5   // -0.5 → 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5    // -0.5 → 0.5
    rotateX.set(-y * rotateAmplitude)
    rotateY.set(x * rotateAmplitude)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    scale.set(scaleOnHover)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
  }

  const containerStyle: CSSProperties = {
    perspective: '800px',
    height: containerHeight,
    width: containerWidth,
  }

  const cardStyle: CSSProperties = {
    height: cardHeight,
    width: cardWidth,
    transformStyle: 'preserve-3d',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: isHovered ? 'var(--shadow-brutal-lg)' : 'var(--shadow-brutal)',
    overflow: 'hidden',
    cursor: 'default',
  }

  const contentStyle: CSSProperties = {
    transform: 'translateZ(30px)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  }

  return (
    <div style={containerStyle} className={className}>
      <motion.div
        ref={ref}
        style={{ ...cardStyle, rotateX, rotateY, scale }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        transition={{ duration: 0.15 }}
      >
        <div style={contentStyle}>
          {children}
        </div>
      </motion.div>
    </div>
  )
}
