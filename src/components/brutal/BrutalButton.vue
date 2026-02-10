<script setup lang="ts">
import { computed, ref } from 'vue'

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
})

const emit = defineEmits<{ (event: 'click', ev: MouseEvent): void }>()

const ripples = ref<Ripple[]>([])

const isDisabled = computed(() => props.disabled || props.loading)

const onClick = (ev: MouseEvent) => {
  if (isDisabled.value) return

  const el = ev.currentTarget as HTMLButtonElement | null
  if (el) {
    const rect = el.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    ripples.value.push({
      id: Date.now() + Math.random(),
      x: ev.clientX - rect.left - size / 2,
      y: ev.clientY - rect.top - size / 2,
      size,
    })
  }

  emit('click', ev)
}

const onRippleEnd = (id: number) => {
  ripples.value = ripples.value.filter(ripple => ripple.id !== id)
}
</script>

<template>
  <button
    :type="type"
    class="brutal-button"
    :class="[
      `brutal-button--${variant}`,
      `brutal-button--${size}`,
      {
        'brutal-button--loading': loading,
        'brutal-button--block': block,
      },
    ]"
    :disabled="isDisabled"
    @click="onClick"
  >
    <span class="brutal-button__ripples" aria-hidden="true">
      <span
        v-for="ripple in ripples"
        :key="ripple.id"
        class="brutal-button__ripple"
        :style="{
          left: `${ripple.x}px`,
          top: `${ripple.y}px`,
          width: `${ripple.size}px`,
          height: `${ripple.size}px`,
        }"
        @animationend="onRippleEnd(ripple.id)"
      />
    </span>

    <span class="brutal-button__content">
      <slot name="left-icon" />
      <span class="brutal-button__label"><slot /></span>
      <span v-if="loading" class="brutal-button__spinner" aria-hidden="true" />
      <slot v-else name="right-icon" />
    </span>
  </button>
</template>

<style scoped>
.brutal-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--button-border);
  border-radius: var(--radius-md);
  box-shadow: 3px 3px 0 0 var(--button-shadow);
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
  font-family: var(--font-body);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.005em;
  line-height: 1.2;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  transform: translate(0, 0);
  transition: transform var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease), background-color var(--duration-fast) var(--ease), color var(--duration-fast) var(--ease), border-color var(--duration-fast) var(--ease);
}

.brutal-button:hover:not(:disabled) {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0 0 var(--button-shadow);
}

.brutal-button:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 0 transparent;
}

.brutal-button:focus-visible {
  outline: 4px solid var(--color-focus-ring);
  outline-offset: 3px;
}

.brutal-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: 1px 1px 0 0 var(--color-border-subtle);
  border-color: var(--color-border-subtle);
}

.brutal-button--primary {
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
}

.brutal-button--primary:hover:not(:disabled) {
  background: var(--button-primary-hover);
}

.brutal-button--secondary {
  background: var(--button-secondary-bg);
  color: var(--button-secondary-text);
}

.brutal-button--secondary:hover:not(:disabled) {
  background: var(--button-secondary-hover);
}

.brutal-button--ghost {
  background: var(--button-ghost-bg);
  color: var(--button-ghost-text);
}

.brutal-button--ghost:hover:not(:disabled) {
  background: var(--button-ghost-hover);
}

.brutal-button--danger {
  background: var(--button-danger-bg);
  color: var(--button-danger-text);
}

.brutal-button--danger:hover:not(:disabled) {
  background: var(--button-danger-hover);
}

.brutal-button--sm {
  min-height: 2.4rem;
  padding: 0.25rem 0.9rem;
  font-size: var(--text-sm);
}

.brutal-button--md {
  min-height: 2.95rem;
  padding: 0.5rem 1.2rem;
  font-size: var(--text-base);
}

.brutal-button--lg {
  min-height: 3.4rem;
  padding: 0.6rem 1.4rem;
  font-size: var(--text-lg);
}

.brutal-button--block {
  width: 100%;
}

.brutal-button__content {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

.brutal-button__label {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.brutal-button__ripples {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.brutal-button__ripple {
  position: absolute;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
  transform: scale(0);
  animation: brutal-ripple 520ms ease-out;
}

.brutal-button__spinner {
  width: 0.9rem;
  height: 0.9rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 999px;
  animation: brutal-spin 650ms linear infinite;
}

@keyframes brutal-ripple {
  to {
    transform: scale(1.8);
    opacity: 0;
  }
}

@keyframes brutal-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
