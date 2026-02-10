import { computed, ref } from 'vue'

const activeModals = ref<Set<string>>(new Set())

export function useModal(id: string) {
  const isOpen = computed(() => activeModals.value.has(id))

  const open = () => {
    const next = new Set(activeModals.value)
    next.add(id)
    activeModals.value = next
  }

  const close = () => {
    const next = new Set(activeModals.value)
    next.delete(id)
    activeModals.value = next
  }

  const toggle = () => {
    if (isOpen.value) close()
    else open()
  }

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}
