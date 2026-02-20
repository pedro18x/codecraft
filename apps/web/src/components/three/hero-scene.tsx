'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import type { Mesh } from 'three'

export function HeroGeometry() {
  const mesh = useRef<Mesh>(null!)
  const { pointer } = useThree()

  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.x += delta * 0.1
    mesh.current.rotation.y += delta * 0.15
    mesh.current.position.x += (pointer.x * 0.5 - mesh.current.position.x) * 0.02
    mesh.current.position.y += (pointer.y * 0.3 - mesh.current.position.y) * 0.02
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={mesh} scale={1.8}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#C75B3A"
          roughness={0.6}
          metalness={0.1}
          distort={0.25}
          speed={1.5}
          transparent
          opacity={0.12}
        />
      </mesh>
    </Float>
  )
}
