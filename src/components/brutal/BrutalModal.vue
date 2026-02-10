<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  closeOnBackdrop: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'close'): void
}>()

const panelRef = ref<HTMLElement | null>(null)
const previousFocused = ref<HTMLElement | null>(null)

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const onBackdrop = () => {
  if (props.closeOnBackdrop) close()
}

const getFocusable = () => {
  const panel = panelRef.value
  if (!panel) return [] as HTMLElement[]
  const selectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  return [...panel.querySelectorAll<HTMLElement>(selectors)].filter(el => !el.hasAttribute('disabled'))
}

const onKeyDown = (ev: KeyboardEvent) => {
  if (!props.modelValue) return

  if (ev.key === 'Escape') {
    ev.preventDefault()
    close()
    return
  }

  if (ev.key !== 'Tab') return

  const focusable = getFocusable()
  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (ev.shiftKey && document.activeElement === first) {
    ev.preventDefault()
    last.focus()
  } else if (!ev.shiftKey && document.activeElement === last) {
    ev.preventDefault()
    first.focus()
  }
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      previousFocused.value = document.activeElement as HTMLElement | null
      document.body.style.overflow = 'hidden'
      await nextTick()
      const focusable = getFocusable()
      focusable[0]?.focus()
      window.addEventListener('keydown', onKeyDown)
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
      previousFocused.value?.focus()
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="brutal-modal-fade">
      <div v-if="modelValue" class="brutal-modal" role="dialog" aria-modal="true" @click="onBackdrop">
        <Transition name="brutal-modal-up">
          <section
            v-if="modelValue"
            ref="panelRef"
            class="brutal-modal__panel"
            @click.stop
          >
            <header class="brutal-modal__header">
              <h2 v-if="title" class="brutal-modal__title">{{ title }}</h2>
              <button class="brutal-modal__close" type="button" aria-label="Close modal" @click="close">
                ×
              </button>
            </header>

            <div class="brutal-modal__body">
              <slot />
            </div>

            <footer v-if="$slots.footer" class="brutal-modal__footer">
              <slot name="footer" />
            </footer>
          </section>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.brutal-modal {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(15, 15, 15, 0.5);
  backdrop-filter: blur(4px);
  z-index: 70;
  padding: 1.25rem;
}

.brutal-modal__panel {
  width: min(42rem, 100%);
  max-height: min(80vh, 52rem);
  overflow: auto;
  background: var(--color-surface);
  border: 3px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  box-shadow: 6px 6px 0 0 var(--color-shadow-strong);
}

.brutal-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.8rem 1rem;
  border-bottom: 2px solid var(--color-border-strong);
  background: var(--color-background);
}

.brutal-modal__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-weight-extrabold);
  margin: 0;
}

.brutal-modal__close {
  width: 2rem;
  height: 2rem;
  border: 2px solid var(--color-border-strong);
  background: var(--color-coral);
  color: var(--color-white);
  font-size: 1.25rem;
  line-height: 1;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 2px 2px 0 0 var(--color-shadow-strong);
}

.brutal-modal__close:focus-visible {
  outline: 4px solid var(--color-yellow);
  outline-offset: 2px;
}

.brutal-modal__body {
  padding: 1rem;
}

.brutal-modal__footer {
  border-top: 2px solid var(--color-border-strong);
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
}

.brutal-modal-fade-enter-active,
.brutal-modal-fade-leave-active {
  transition: opacity var(--duration-normal) var(--ease);
}

.brutal-modal-fade-enter-from,
.brutal-modal-fade-leave-to {
  opacity: 0;
}

.brutal-modal-up-enter-active,
.brutal-modal-up-leave-active {
  transition: transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity var(--duration-normal) var(--ease);
}

.brutal-modal-up-enter-from,
.brutal-modal-up-leave-to {
  transform: translateY(28px);
  opacity: 0;
}
</style>
