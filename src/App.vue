<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
import { useAuth } from './composables/useAuth'

const { fetchMe } = useAuth()

// 🥚 Easter Egg: Type "gabriela" anywhere to reveal a secret in console
let keyBuffer = ''
let resetTimeout: number | undefined

const triggerEasterEgg = () => {
  // Console log with style
  console.log(
    '%c╔════════════════════════════════════════╗\n' +
    '║                                        ║\n' +
    '║  💜  Built by Pedro                    ║\n' +
    '║      With love to Gabriela ✨          ║\n' +
    '║                                        ║\n' +
    '║  CodeCraft - Where code meets art      ║\n' +
    '║                                        ║\n' +
    '╚════════════════════════════════════════╝',
    'color: #a855f7; font-weight: bold; font-size: 14px; font-family: monospace; background: #000; padding: 20px; border: 4px solid #a855f7; box-shadow: 0 0 30px #a855f7;'
  )
}

const handleKeyDown = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target.isContentEditable
  ) {
    return
  }

  if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
    keyBuffer += e.key.toLowerCase()

    if (keyBuffer.length > 8) {
      keyBuffer = keyBuffer.slice(-8)
    }

    if (keyBuffer.includes('gabriela')) {
      triggerEasterEgg()
      keyBuffer = ''
    }
  }

  clearTimeout(resetTimeout)
  resetTimeout = setTimeout(() => {
    keyBuffer = ''
  }, 2000) as unknown as number
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  // Restore auth session from stored token
  fetchMe()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  clearTimeout(resetTimeout)
})
</script>

<template>
  <RouterView />
</template>

<style>
@import './design-system/tokens.css';
</style>
