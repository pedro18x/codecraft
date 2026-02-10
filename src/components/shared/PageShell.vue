<script setup lang="ts">
interface Props {
  width?: 'content' | 'full'
}

withDefaults(defineProps<Props>(), {
  width: 'content',
})
</script>

<template>
  <div class="page-shell" :class="`page-shell--${width}`">
    <slot />
  </div>
</template>

<style scoped>
.page-shell {
  margin: 0 auto;
  padding: 1rem;
}

.page-shell--content {
  width: min(80rem, 100%);
}

.page-shell--full {
  width: 100%;
}

@media (max-width: 640px) {
  .page-shell {
    padding: 0.7rem;
  }
}
</style>
