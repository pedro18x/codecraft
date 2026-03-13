'use client'

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const saved = localStorage.getItem('theme') as Theme | null
  return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      document.documentElement.setAttribute('data-theme', next)
      return next
    })
  }, [])

  const value = useMemo<ThemeContextValue>(() => ({ theme, toggle }), [theme, toggle])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
