<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  rounded?: boolean
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  rounded: false,
})
</script>

<template>
  <span
    class="brutal-skeleton"
    :class="{ 'brutal-skeleton--rounded': rounded }"
    :style="{ width, height }"
    aria-hidden="true"
  />
</template>

<style scoped>
.brutal-skeleton {
  display: inline-block;
  border: 3px solid var(--color-ink);
  background: linear-gradient(
    90deg,
    var(--color-background) 0%,
    rgba(255, 230, 109, 0.65) 45%,
    var(--color-background) 100%
  );
  background-size: 200% 100%;
  animation: brutal-skeleton 1.2s linear infinite;
}

.brutal-skeleton--rounded {
  border-radius: 999px;
}

@keyframes brutal-skeleton {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
