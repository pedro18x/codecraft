import { computed, ref } from 'vue'

interface KeyboardNavOptions {
  loop?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export function useKeyboardNav(itemCount: () => number, options: KeyboardNavOptions = {}) {
  const activeIndex = ref(0)
  const loop = options.loop ?? true
  const orientation = options.orientation ?? 'vertical'

  const maxIndex = computed(() => Math.max(0, itemCount() - 1))

  const setIndex = (index: number) => {
    if (loop) {
      if (index < 0) {
        activeIndex.value = maxIndex.value
        return
      }
      if (index > maxIndex.value) {
        activeIndex.value = 0
        return
      }
    }

    activeIndex.value = Math.min(maxIndex.value, Math.max(0, index))
  }

  const onKeydown = (event: KeyboardEvent) => {
    const isPrev =
      (orientation === 'vertical' && event.key === 'ArrowUp') ||
      (orientation === 'horizontal' && event.key === 'ArrowLeft')

    const isNext =
      (orientation === 'vertical' && event.key === 'ArrowDown') ||
      (orientation === 'horizontal' && event.key === 'ArrowRight')

    if (isPrev) {
      event.preventDefault()
      setIndex(activeIndex.value - 1)
      return
    }

    if (isNext) {
      event.preventDefault()
      setIndex(activeIndex.value + 1)
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      setIndex(0)
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      setIndex(maxIndex.value)
    }
  }

  return {
    activeIndex,
    setIndex,
    onKeydown,
  }
}
