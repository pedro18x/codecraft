'use client'

import { CSSProperties } from 'react'

interface DotGridProps {
  /**
   * Dot color (CSS color value)
   * @default 'rgba(255, 255, 255, 0.2)'
   */
  dotColor?: string
  /**
   * Background color (CSS color value)
   * @default 'transparent'
   */
  backgroundColor?: string
  /**
   * Spacing between dots in pixels
   * @default 40
   */
  spacing?: number
  /**
   * Dot size in pixels
   * @default 1.5
   */
  dotSize?: number
  /**
   * Enable subtle fade animation
   * @default true
   */
  animate?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * DotGrid - Clean, minimal dot pattern background
 * Inspired by reactbits.dev/backgrounds/dot-grid
 *
 * Performance-optimized with pure CSS/SVG patterns.
 * No WebGL/Three.js overhead.
 */
export function DotGrid({
  dotColor = 'rgba(255, 255, 255, 0.2)',
  backgroundColor = 'transparent',
  spacing = 40,
  dotSize = 1.5,
  animate = true,
  className = '',
}: DotGridProps) {
  const dotGridStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor,
    backgroundImage: `radial-gradient(circle, ${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
    backgroundSize: `${spacing}px ${spacing}px`,
    backgroundPosition: '0 0',
    ...(animate && {
      animation: 'dotGridFade 8s ease-in-out infinite',
    }),
  }

  return (
    <>
      {animate && (
        <style jsx global>{`
          @keyframes dotGridFade {
            0%, 100% {
              opacity: 0.5;
            }
            50% {
              opacity: 0.8;
            }
          }
        `}</style>
      )}
      <div
        className={className}
        style={dotGridStyle}
        aria-hidden="true"
      />
    </>
  )
}
