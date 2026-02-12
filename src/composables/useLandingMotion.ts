import { computed } from 'vue'
import { useMotion as useSystemMotion } from './useMotion'

type MotionEasing = number[] | string

export interface LandingMotionTransition {
  duration: number
  delay?: number
  easing?: MotionEasing
}

export interface LandingMotionState {
  opacity?: number
  x?: number
  y?: number
  scale?: number
  rotate?: number
  transition?: LandingMotionTransition
}

export interface LandingRevealPreset {
  initial: LandingMotionState
  visibleOnce: LandingMotionState
}

export interface LandingLoopPreset {
  className: string
  durationMs: number
  delayMs?: number
}

const EASE_OUT = [0.16, 1, 0.3, 1]

export function useLandingMotion() {
  const { reducedMotion } = useSystemMotion()

  const reveal = (offsetY: number, delayMs: number, durationMs: number): LandingRevealPreset => {
    if (reducedMotion.value) {
      return {
        initial: { opacity: 1, y: 0 },
        visibleOnce: {
          opacity: 1,
          y: 0,
          transition: { duration: 0 },
        },
      }
    }

    return {
      initial: { opacity: 0, y: offsetY },
      visibleOnce: {
        opacity: 1,
        y: 0,
        transition: {
          duration: durationMs,
          delay: delayMs,
          easing: EASE_OUT,
        },
      },
    }
  }

  const hero = (index = 0): LandingRevealPreset => reveal(18, index * 70, 300)
  const section = (delayMs = 0): LandingRevealPreset => reveal(16, delayMs, 280)
  const card = (index = 0, stepMs = 55): LandingRevealPreset => reveal(14, index * stepMs, 250)

  const buttonPulse = computed<LandingLoopPreset>(() => ({
    className: reducedMotion.value ? '' : 'lp-cta-pulse',
    durationMs: 3200,
  }))

  const backgroundFloat = (index = 0): LandingLoopPreset => {
    const durations = [3200, 3900, 2800]
    const delays = [0, 120, 220]
    return {
      className: reducedMotion.value ? '' : 'lp-float-shape',
      durationMs: durations[index] ?? 3400,
      delayMs: delays[index] ?? 0,
    }
  }

  return {
    reducedMotion,
    hero,
    section,
    card,
    buttonPulse,
    backgroundFloat,
  }
}
