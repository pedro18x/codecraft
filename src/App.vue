<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
import { useAuth } from './composables/useAuth'
import BrutalToastStack from './components/brutal/BrutalToastStack.vue'

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
  <a class="skip-link" href="#main-content">Skip to main content</a>

  <RouterView v-slot="{ Component, route }">
    <Transition name="route-fade" mode="out-in">
      <main :id="'main-content'" :key="route.path" class="route-frame">
        <component :is="Component" />
      </main>
    </Transition>
  </RouterView>

  <BrutalToastStack />
</template>

<style scoped>
.skip-link {
  position: fixed;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 999;
  transform: translateY(-150%);
  border: 3px solid var(--color-border-strong);
  background: var(--color-warning);
  box-shadow: 3px 3px 0 0 var(--color-shadow-strong);
  color: var(--color-accent-ink);
  font-weight: var(--font-weight-bold);
  padding: 0.4rem 0.6rem;
  text-decoration: none;
}

.skip-link:focus {
  transform: translateY(0);
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
}

:global(.route-fade-enter-active),
:global(.route-fade-leave-active) {
  transition: opacity 200ms var(--ease), transform 200ms var(--ease);
}

:global(.route-fade-enter-from),
:global(.route-fade-leave-to) {
  opacity: 0;
  transform: scale(0.985);
}

:global(.route-frame) {
  width: 100%;
  min-height: 100dvh;
}
</style>
