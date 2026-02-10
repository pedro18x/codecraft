import { computed, onMounted, onUnmounted, ref } from 'vue'

export function useMotion() {
  const reducedMotion = ref(false)

  let media: MediaQueryList | null = null
  const onChange = (event: MediaQueryListEvent) => {
    reducedMotion.value = event.matches
  }

  onMounted(() => {
    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.value = media.matches
    media.addEventListener('change', onChange)
  })

  onUnmounted(() => {
    media?.removeEventListener('change', onChange)
  })

  const fastDuration = computed(() => (reducedMotion.value ? 0 : 150))
  const normalDuration = computed(() => (reducedMotion.value ? 0 : 220))

  const stagger = (index: number, step = 50) => `${reducedMotion.value ? 0 : index * step}ms`

  return {
    reducedMotion,
    fastDuration,
    normalDuration,
    stagger,
  }
}

export function useRevealOnScroll(threshold = 0.18) {
  const element = ref<HTMLElement | null>(null)
  const visible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          visible.value = true
          observer?.disconnect()
        }
      },
      { threshold }
    )

    if (element.value) {
      observer.observe(element.value)
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { element, visible }
}
