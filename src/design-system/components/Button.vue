<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
})
</script>

<template>
  <button
    :class="[
      'brutal-btn',
      `brutal-btn--${variant}`,
      `brutal-btn--${size}`,
      {
        'brutal-btn--disabled': disabled,
        'brutal-btn--loading': loading,
      }
    ]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="brutal-btn__spinner" />
    <slot />
  </button>
</template>

<style scoped>
.brutal-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  border: var(--border-width) solid var(--color-ink);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  position: relative;
  box-shadow: var(--shadow-brutal);
  transition: transform var(--duration-fast) var(--ease),
              box-shadow var(--duration-fast) var(--ease);
}

.brutal-btn:hover:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: var(--shadow-brutal-sm);
}

.brutal-btn:active:not(:disabled) {
  transform: translate(4px, 4px);
  box-shadow: none;
}

.brutal-btn:focus-visible {
  outline: 3px solid var(--color-yellow);
  outline-offset: 2px;
}

/* ── Sizes ── */
.brutal-btn--sm {
  height: 2.25rem;
  padding: 0 var(--space-4);
  font-size: var(--text-sm);
}

.brutal-btn--md {
  height: 2.75rem;
  padding: 0 var(--space-6);
  font-size: var(--text-base);
}

.brutal-btn--lg {
  height: 3.25rem;
  padding: 0 var(--space-8);
  font-size: var(--text-lg);
}

/* ── Variants ── */
.brutal-btn--primary {
  background-color: var(--color-coral);
  color: var(--color-white);
}

.brutal-btn--primary:hover:not(:disabled) {
  background-color: var(--color-coral-dark);
}

.brutal-btn--secondary {
  background-color: var(--color-turquoise);
  color: var(--color-ink);
}

.brutal-btn--secondary:hover:not(:disabled) {
  background-color: var(--color-turquoise-dark);
}

.brutal-btn--ghost {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
}

.brutal-btn--ghost:hover:not(:disabled) {
  background-color: var(--color-surface-hover);
}

.brutal-btn--danger {
  background-color: var(--color-coral);
  color: var(--color-white);
}

/* ── States ── */
.brutal-btn--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.brutal-btn--loading {
  pointer-events: none;
}

/* ── Spinner ── */
.brutal-btn__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 0;
  animation: brutal-spin 0.6s linear infinite;
}

@keyframes brutal-spin {
  to { transform: rotate(360deg); }
}
</style>
