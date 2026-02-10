<script setup lang="ts">
interface Props {
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  spacing: 'md',
})
</script>

<template>
  <div
    :class="[
      'divider',
      `divider--${orientation}`,
      `divider--spacing-${spacing}`
    ]"
  />
</template>

<style scoped>
.divider {
  background-color: var(--color-border);
}

.divider--horizontal {
  width: 100%;
  height: var(--border-width);
}

.divider--vertical {
  width: var(--border-width);
  height: 100%;
}

/* Spacing */
.divider--spacing-sm.divider--horizontal {
  margin: var(--space-4) 0;
}

.divider--spacing-md.divider--horizontal {
  margin: var(--space-6) 0;
}

.divider--spacing-lg.divider--horizontal {
  margin: var(--space-8) 0;
}

.divider--spacing-sm.divider--vertical {
  margin: 0 var(--space-4);
}

.divider--spacing-md.divider--vertical {
  margin: 0 var(--space-6);
}

.divider--spacing-lg.divider--vertical {
  margin: 0 var(--space-8);
}
</style>
