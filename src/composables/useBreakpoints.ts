import { computed, onMounted, onUnmounted, ref } from 'vue'

const width = ref<number>(typeof window === 'undefined' ? 1280 : window.innerWidth)

export function useBreakpoints() {
  const onResize = () => {
    width.value = window.innerWidth
  }

  onMounted(() => {
    onResize()
    window.addEventListener('resize', onResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
  })

  const isMobile = computed(() => width.value < 768)
  const isTablet = computed(() => width.value >= 768 && width.value < 1024)
  const isDesktop = computed(() => width.value >= 1024)

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
  }
}
