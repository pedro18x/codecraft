'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, type ReactNode } from 'react'

interface ZenCanvasProps {
  children: ReactNode
  className?: string
}

export function ZenCanvas({ children, className }: ZenCanvasProps) {
  return (
    <div
      className={className}
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  )
}
