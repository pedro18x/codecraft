import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  let storedValue: string | null = null
  try {
    storedValue = localStorage.getItem(key)
  } catch {
    // localStorage may be unavailable in private browsing
  }

  const value = ref<T>(
    storedValue ? JSON.parse(storedValue) : defaultValue
  ) as Ref<T>

  watch(
    value,
    (newValue) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch {
        // Silently fail — storage may be full or unavailable
      }
    },
    { deep: true }
  )

  return value
}
