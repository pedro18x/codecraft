'use client'

import { ZenCanvas } from './zen-canvas'
import { FloatingParticles } from './floating-particles'

export function ZenBackground() {
  return (
    <ZenCanvas>
      <ambientLight intensity={0.3} />
      <fog attach="fog" args={['#171614', 4, 12]} />
      <FloatingParticles count={100} />
    </ZenCanvas>
  )
}
