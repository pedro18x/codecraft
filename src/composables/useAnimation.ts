import { onMounted, onUnmounted, ref, type Ref } from 'vue'

interface RevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useReveal<T extends HTMLElement>(options: RevealOptions = {}) {
  const target = ref<T | null>(null)
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          isVisible.value = true
          if (options.once !== false) {
            observer?.disconnect()
          }
        } else if (options.once === false) {
          isVisible.value = false
        }
      },
      {
        threshold: options.threshold ?? 0.2,
        rootMargin: options.rootMargin ?? '0px',
      }
    )

    if (target.value) observer.observe(target.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return {
    target,
    isVisible,
  }
}

export function staggerDelay(index: number, stepMs = 50) {
  return `${Math.max(0, index) * stepMs}ms`
}

export function useReducedMotion() {
  const prefersReduced = ref(false)
  let media: MediaQueryList | null = null

  const onChange = (event: MediaQueryListEvent) => {
    prefersReduced.value = event.matches
  }

  onMounted(() => {
    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReduced.value = media.matches
    media.addEventListener('change', onChange)
  })

  onUnmounted(() => {
    media?.removeEventListener('change', onChange)
  })

  return {
    prefersReduced,
  }
}

export function useElementVisibility<T extends HTMLElement>(
  target: Ref<T | null>,
  onVisible: () => void,
  threshold = 0.25
) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          onVisible()
          observer?.disconnect()
        }
      },
      { threshold }
    )

    if (target.value) observer.observe(target.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}
