'use client'

import { CSSProperties } from 'react'

interface PerspectiveGridProps {
  className?: string
  lineColor?: string
  glowColor?: string
}

export function PerspectiveGrid({
  className = '',
  lineColor = 'rgba(62, 122, 85, 0.12)',
  glowColor = 'rgba(62, 122, 85, 0.06)',
}: PerspectiveGridProps) {
  const horizonStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: '-30%',
    right: '-30%',
    height: '65%',
    perspective: '280px',
    perspectiveOrigin: '50% 0%',
  }

  const gridStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    transform: 'rotateX(78deg)',
    transformOrigin: 'center bottom',
    backgroundImage: `
      linear-gradient(${lineColor} 1px, transparent 1px),
      linear-gradient(90deg, ${lineColor} 1px, transparent 1px)
    `,
    backgroundSize: '56px 56px',
    maskImage: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 75%)',
    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 75%)',
    animation: 'gridScroll 8s linear infinite',
  }

  const glowStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    background: `radial-gradient(ellipse 70% 60% at 50% 100%, ${glowColor} 0%, transparent 70%)`,
    pointerEvents: 'none',
  }

  const horizontalLineStyle: CSSProperties = {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, transparent 0%, ${lineColor} 30%, ${lineColor} 70%, transparent 100%)`,
  }

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      {/* Perspective grid floor */}
      <div style={horizonStyle}>
        <div style={gridStyle} />
      </div>

      {/* Horizon glow */}
      <div style={glowStyle} />

      {/* Horizon line */}
      <div style={horizontalLineStyle} />
    </div>
  )
}
