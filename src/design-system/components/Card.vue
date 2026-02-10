<script setup lang="ts">
interface Props {
  interactive?: boolean
  elevated?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  accent?: 'coral' | 'turquoise' | 'yellow' | null
}

withDefaults(defineProps<Props>(), {
  interactive: false,
  elevated: false,
  padding: 'md',
  accent: null,
})
</script>

<template>
  <div
    :class="[
      'brutal-card',
      `brutal-card--padding-${padding}`,
      {
        'brutal-card--interactive': interactive,
        'brutal-card--elevated': elevated,
        'brutal-card--accent-coral': accent === 'coral',
        'brutal-card--accent-turquoise': accent === 'turquoise',
        'brutal-card--accent-yellow': accent === 'yellow',
      }
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.brutal-card {
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-ink);
  box-shadow: var(--shadow-brutal);
  transition: transform var(--duration-fast) var(--ease),
              box-shadow var(--duration-fast) var(--ease);
}

/* ── Interactive hover ── */
.brutal-card--interactive {
  cursor: pointer;
}

.brutal-card--interactive:hover {
  transform: translate(2px, 2px);
  box-shadow: var(--shadow-brutal-sm);
}

.brutal-card--interactive:active {
  transform: translate(4px, 4px);
  box-shadow: none;
}

/* ── Elevated — bigger shadow ── */
.brutal-card--elevated {
  box-shadow: var(--shadow-brutal-lg);
}

.brutal-card--elevated:hover {
  box-shadow: var(--shadow-brutal);
}

/* ── Padding ── */
.brutal-card--padding-none { padding: 0; }
.brutal-card--padding-sm { padding: var(--space-4); }
.brutal-card--padding-md { padding: var(--space-6); }
.brutal-card--padding-lg { padding: var(--space-8); }

/* ── Color accent strips ── */
.brutal-card--accent-coral { border-left: 6px solid var(--color-coral); }
.brutal-card--accent-turquoise { border-left: 6px solid var(--color-turquoise); }
.brutal-card--accent-yellow { border-left: 6px solid var(--color-yellow); }
</style>
