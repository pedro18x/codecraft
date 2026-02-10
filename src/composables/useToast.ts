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
const remainingTime = new Map<number, number>()
const startedAt = new Map<number, number>()

const scheduleRemove = (id: number, delay: number) => {
  const timeout = setTimeout(() => {
    remove(id)
  }, delay)
  timers.set(id, timeout)
  remainingTime.set(id, delay)
  startedAt.set(id, Date.now())
}

const remove = (id: number) => {
  const timeout = timers.get(id)
  if (timeout) {
    clearTimeout(timeout)
    timers.delete(id)
  }
  remainingTime.delete(id)
  startedAt.delete(id)
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

  scheduleRemove(toast.id, toast.duration)

  return toast.id
}

const pause = (id: number) => {
  const timeout = timers.get(id)
  if (!timeout) return

  clearTimeout(timeout)
  timers.delete(id)

  const start = startedAt.get(id) ?? Date.now()
  const remaining = remainingTime.get(id) ?? 0
  const elapsed = Date.now() - start
  remainingTime.set(id, Math.max(0, remaining - elapsed))
}

const resume = (id: number) => {
  if (timers.has(id)) return
  const remaining = remainingTime.get(id)
  if (remaining === undefined) return
  scheduleRemove(id, remaining)
}

export function useToast() {
  return {
    toasts: readonly(toasts),
    push,
    remove,
    pause,
    resume,
    success: (title: string, message?: string) => push({ title, message, type: 'success' }),
    error: (title: string, message?: string) => push({ title, message, type: 'error' }),
    warning: (title: string, message?: string) => push({ title, message, type: 'warning' }),
    info: (title: string, message?: string) => push({ title, message, type: 'info' }),
  }
}
