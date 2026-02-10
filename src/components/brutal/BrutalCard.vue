<script setup lang="ts">
import { computed, useSlots } from 'vue'

interface Props {
  variant?: 'elevated' | 'flat' | 'interactive'
  accent?: 'coral' | 'turquoise' | 'yellow' | null
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'flat',
  accent: null,
  padding: 'md',
})

const slots = useSlots()

const hasHeader = computed(() => !!slots.header)
const hasFooter = computed(() => !!slots.footer)
</script>

<template>
  <article
    class="brutal-card"
    :class="[
      `brutal-card--${variant}`,
      `brutal-card--padding-${padding}`,
      {
        'brutal-card--accent-coral': accent === 'coral',
        'brutal-card--accent-turquoise': accent === 'turquoise',
        'brutal-card--accent-yellow': accent === 'yellow',
      },
    ]"
  >
    <header v-if="hasHeader" class="brutal-card__header">
      <slot name="header" />
    </header>

    <div class="brutal-card__body">
      <slot />
    </div>

    <footer v-if="hasFooter" class="brutal-card__footer">
      <slot name="footer" />
    </footer>
  </article>
</template>

<style scoped>
.brutal-card {
  position: relative;
  background: var(--color-surface);
  border: 3px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  box-shadow: 3px 3px 0 0 var(--color-shadow-strong);
  transition: transform var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease);
}

.brutal-card--flat {
  box-shadow: 3px 3px 0 0 var(--color-shadow-strong);
}

.brutal-card--elevated {
  box-shadow: 6px 6px 0 0 var(--color-shadow-strong);
}

.brutal-card--interactive {
  cursor: pointer;
  box-shadow: 6px 6px 0 0 var(--color-shadow-strong);
}

.brutal-card--interactive:hover {
  transform: translate(1px, 1px);
  box-shadow: 4px 4px 0 0 var(--color-shadow-strong);
}

.brutal-card--interactive:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 0 transparent;
}

.brutal-card--padding-none .brutal-card__body {
  padding: 0;
}

.brutal-card--padding-sm .brutal-card__body {
  padding: 0.75rem;
}

.brutal-card--padding-md .brutal-card__body {
  padding: 1rem;
}

.brutal-card--padding-lg .brutal-card__body {
  padding: 1.35rem;
}

.brutal-card--accent-coral {
  border-left-width: 10px;
  border-left-color: var(--color-coral);
}

.brutal-card--accent-turquoise {
  border-left-width: 10px;
  border-left-color: var(--color-turquoise);
}

.brutal-card--accent-yellow {
  border-left-width: 10px;
  border-left-color: var(--color-yellow);
}

.brutal-card__header,
.brutal-card__footer {
  padding: 0.95rem 1rem;
  border-bottom: 2px solid var(--color-border-strong);
  background: var(--color-background);
}

.brutal-card__footer {
  border-top: 2px solid var(--color-border-strong);
  border-bottom: 0;
}
</style>
