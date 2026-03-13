import { useEffect } from 'react'

type ShortcutMap = Record<string, () => void>

export function useKeyboardShortcuts(shortcuts: ShortcutMap, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handler = (e: KeyboardEvent) => {
      const key = [
        e.metaKey || e.ctrlKey ? '⌘' : '',
        e.shiftKey ? 'Shift' : '',
        e.key,
      ]
        .filter(Boolean)
        .join('+')

      const action = shortcuts[key]
      if (action) {
        e.preventDefault()
        action()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shortcuts, enabled])
}
