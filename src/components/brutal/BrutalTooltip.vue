<script setup lang="ts">
interface Props {
  text: string
  position?: 'top' | 'bottom'
}

withDefaults(defineProps<Props>(), {
  position: 'top',
})
</script>

<template>
  <span class="brutal-tooltip-wrap" tabindex="0">
    <slot />
    <span class="brutal-tooltip" role="tooltip" :class="`brutal-tooltip--${position}`">
      {{ text }}
    </span>
  </span>
</template>

<style scoped>
.brutal-tooltip-wrap {
  position: relative;
  display: inline-flex;
}

.brutal-tooltip {
  position: absolute;
  left: 50%;
  z-index: 45;
  width: max-content;
  max-width: 14rem;
  border: 3px solid var(--color-border-strong);
  background: var(--color-warning);
  color: var(--color-accent-ink);
  box-shadow: 3px 3px 0 0 var(--color-shadow-strong);
  font-size: var(--text-xs);
  font-weight: var(--font-weight-semibold);
  padding: 0.35rem 0.45rem;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 4px);
  transition: opacity var(--duration-fast) var(--ease), transform var(--duration-fast) var(--ease);
}

.brutal-tooltip--top {
  bottom: calc(100% + 0.45rem);
}

.brutal-tooltip--bottom {
  top: calc(100% + 0.45rem);
}

.brutal-tooltip-wrap:hover .brutal-tooltip,
.brutal-tooltip-wrap:focus-visible .brutal-tooltip {
  opacity: 1;
  transform: translate(-50%, 0);
}

.brutal-tooltip-wrap:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 3px;
}

[data-theme='dark'] .brutal-tooltip {
  background: var(--color-surface-raised);
  color: var(--color-text-primary);
}
</style>
