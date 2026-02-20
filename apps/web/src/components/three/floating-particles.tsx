'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Computed once at module load time — outside the React render cycle
// so Math.random() never runs during render.
const DEFAULT_COUNT = 80
const PARTICLE_POSITIONS = (() => {
  const pos = new Float32Array(DEFAULT_COUNT * 3)
  for (let i = 0; i < DEFAULT_COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 12
    pos[i * 3 + 1] = (Math.random() - 0.5) * 12
    pos[i * 3 + 2] = (Math.random() - 0.5) * 6
  }
  return pos
})()

export function FloatingParticles({ count: _count = 80 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null!)
  const positions = PARTICLE_POSITIONS

  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.y += delta * 0.02
    mesh.current.rotation.x += delta * 0.01
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#C75B3A"
        transparent
        opacity={0.25}
        sizeAttenuation
      />
    </points>
  )
}
