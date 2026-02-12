<script setup lang="ts">
import type { Problem } from '../../types'
import BrutalBadge from '../brutal/BrutalBadge.vue'
import BrutalButton from '../brutal/BrutalButton.vue'

interface Props {
  problem: Problem | null
}

defineProps<Props>()

defineEmits<{ (event: 'start', problemId: number): void }>()

const difficultyTone = (difficulty: NonNullable<Props['problem']>['difficulty']) =>
  difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'
</script>

<template>
  <aside class="daily-card animate-float">
    <div class="daily-card__header">
      <span class="daily-card__tag">Daily Challenge</span>
      <BrutalBadge
        v-if="problem"
        variant="difficulty"
        :tone="difficultyTone(problem.difficulty)"
      >
        {{ problem.difficulty }}
      </BrutalBadge>
    </div>

    <template v-if="problem">
      <h2 class="daily-card__title">#{{ problem.id }} {{ problem.title }}</h2>
      <p class="daily-card__copy">One focused attempt today keeps your streak alive.</p>
      <BrutalButton variant="primary" size="sm" @click="$emit('start', problem.id)">Start now</BrutalButton>
    </template>

    <template v-else>
      <h2 class="daily-card__title">No challenge available</h2>
      <p class="daily-card__copy">You cleared everything. Add more problems next.</p>
    </template>
  </aside>
</template>

<style scoped>
.daily-card {
  position: sticky;
  top: 8.8rem;
  border: var(--border-width) solid var(--color-border-strong);
  box-shadow: var(--shadow-brutal-md);
  background: var(--color-surface);
  padding: 0.9rem;
  display: grid;
  gap: 0.7rem;
}

.daily-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.daily-card__tag {
  display: inline-flex;
  align-items: center;
  border: 2px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-danger);
  color: var(--color-on-danger);
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  padding: 0.25rem 0.45rem;
}

.daily-card__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-xl);
  line-height: 1.2;
}

.daily-card__copy {
  margin: 0;
  color: var(--color-text-secondary);
}

@media (max-width: 1000px) {
  .daily-card {
    position: static;
  }
}
</style>
