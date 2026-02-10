<script setup lang="ts">
interface Props {
  maxWidth?: 'content' | 'prose' | 'full'
  padding?: boolean
}

withDefaults(defineProps<Props>(), {
  maxWidth: 'content',
  padding: true,
})
</script>

<template>
  <div
    :class="[
      'container',
      `container--${maxWidth}`,
      { 'container--padding': padding }
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.container--content {
  max-width: var(--max-width-content);
}

.container--prose {
  max-width: var(--max-width-prose);
}

.container--full {
  max-width: 100%;
}

.container--padding {
  padding-left: var(--space-6);
  padding-right: var(--space-6);
}

@media (min-width: 1024px) {
  .container--padding {
    padding-left: var(--space-8);
    padding-right: var(--space-8);
  }
}
</style>
