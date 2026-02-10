import { readonly, ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: number
  title: string
  message?: string
  type: ToastType
  duration: number
  createdAt: number
}

interface ToastPayload {
  title: string
  message?: string
  type?: ToastType
  duration?: number
}

const toasts = ref<ToastItem[]>([])
const timers = new Map<number, ReturnType<typeof setTimeout>>()

const remove = (id: number) => {
  const timeout = timers.get(id)
  if (timeout) {
    clearTimeout(timeout)
    timers.delete(id)
  }
  toasts.value = toasts.value.filter(item => item.id !== id)
}

const push = (payload: ToastPayload) => {
  const toast: ToastItem = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    title: payload.title,
    message: payload.message,
    type: payload.type ?? 'info',
    duration: payload.duration ?? 5000,
    createdAt: Date.now(),
  }

  toasts.value = [toast, ...toasts.value]

  const timeout = setTimeout(() => {
    remove(toast.id)
  }, toast.duration)

  timers.set(toast.id, timeout)

  return toast.id
}

export function useToast() {
  return {
    toasts: readonly(toasts),
    push,
    remove,
    success: (title: string, message?: string) => push({ title, message, type: 'success' }),
    error: (title: string, message?: string) => push({ title, message, type: 'error' }),
    warning: (title: string, message?: string) => push({ title, message, type: 'warning' }),
    info: (title: string, message?: string) => push({ title, message, type: 'info' }),
  }
}
