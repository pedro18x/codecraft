<script setup lang="ts">
import BrutalButton from './BrutalButton.vue'

interface Props {
  title: string
  description?: string
  actionLabel?: string
}

withDefaults(defineProps<Props>(), {
  description: '',
  actionLabel: '',
})

defineEmits<{ (event: 'action'): void }>()
</script>

<template>
  <section class="brutal-empty" role="status" aria-live="polite">
    <div class="brutal-empty__icon" aria-hidden="true">🧩</div>
    <h3 class="brutal-empty__title">{{ title }}</h3>
    <p v-if="description" class="brutal-empty__desc">{{ description }}</p>

    <BrutalButton
      v-if="actionLabel"
      variant="secondary"
      size="sm"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </BrutalButton>
  </section>
</template>

<style scoped>
.brutal-empty {
  border: 4px dashed var(--color-border-strong);
  background: var(--color-surface);
  box-shadow: 6px 6px 0 0 var(--color-shadow-strong);
  padding: 1.2rem;
  display: grid;
  gap: 0.6rem;
  justify-items: start;
}

.brutal-empty__icon {
  width: 2.4rem;
  height: 2.4rem;
  display: grid;
  place-items: center;
  border: 3px solid var(--color-border-strong);
  background: var(--color-warning);
  color: var(--color-accent-ink);
}

.brutal-empty__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  line-height: 1.1;
}

.brutal-empty__desc {
  margin: 0;
  color: var(--color-text-secondary);
  max-width: 48ch;
}
</style>
