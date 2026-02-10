<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  variant?: 'difficulty' | 'category' | 'status'
  tone?: 'easy' | 'medium' | 'hard' | 'neutral' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  rotate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  variant: 'category',
  tone: 'neutral',
  size: 'md',
  rotate: true,
})

const toneClass = computed(() => {
  if (props.variant === 'difficulty') return `brutal-badge--difficulty-${props.tone}`
  return `brutal-badge--${props.tone}`
})
</script>

<template>
  <span
    class="brutal-badge"
    :class="[
      `brutal-badge--${size}`,
      toneClass,
      {
        'brutal-badge--rotate': rotate,
      },
    ]"
  >
    <slot>{{ label }}</slot>
  </span>
</template>

<style scoped>
.brutal-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  line-height: 1;
  transition: transform var(--duration-fast) var(--ease);
}

.brutal-badge--sm {
  font-size: 0.63rem;
  padding: 0.24rem 0.45rem;
}

.brutal-badge--md {
  font-size: 0.72rem;
  padding: 0.34rem 0.58rem;
}

.brutal-badge--rotate {
  transform: rotate(-1deg);
}

.brutal-badge--rotate:hover {
  transform: rotate(0deg);
}

.brutal-badge--difficulty-easy,
.brutal-badge--success {
  background: var(--color-turquoise);
  color: var(--color-accent-ink);
}

.brutal-badge--difficulty-medium,
.brutal-badge--warning {
  background: var(--color-yellow);
  color: var(--color-accent-ink);
}

.brutal-badge--difficulty-hard,
.brutal-badge--error {
  background: var(--color-coral);
  color: var(--color-white);
}

.brutal-badge--info {
  background: #6c8eff;
  color: var(--color-white);
}

.brutal-badge--neutral {
  background: var(--color-surface-raised);
  color: var(--color-text-primary);
}
</style>
