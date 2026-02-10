import { ref, onMounted, watch } from 'vue'

export function useTheme() {
  const theme = ref<'light' | 'dark'>('light')

  const updateTheme = () => {
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.value = savedTheme || (systemPrefersDark ? 'dark' : 'light')
    updateTheme()
  })

  watch(theme, updateTheme)

  return {
    theme,
    toggleTheme,
  }
}
