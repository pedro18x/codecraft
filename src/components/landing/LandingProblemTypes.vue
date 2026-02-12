<script setup lang="ts">
import Button from '../../design-system/components/Button.vue'
import Text from '../../design-system/components/Text.vue'
import { useLandingMotion } from '../../composables/useLandingMotion'

interface Props {
  categories: string[]
  totalProblems: number
  easyCount: number
  mediumCount: number
  hardCount: number
}

defineProps<Props>()
const { section, card } = useLandingMotion()

const emit = defineEmits<{
  (event: 'open-dashboard'): void
}>()
</script>

<template>
  <section id="problem-types" class="landing-types" data-testid="landing-problem-types">
    <div v-motion :initial="section(0).initial" :visible-once="section(0).visibleOnce" class="landing-types__head">
      <Text as="h2" variant="h2" weight="extrabold">Problem types for interview prep</Text>
      <Text as="p" variant="body" class="landing-types__intro">
        Build coverage across common interview patterns and calibrate by difficulty as your interviews get closer.
      </Text>
    </div>

    <div class="landing-types__meta">
      <div
        v-motion
        :initial="card(0).initial"
        :visible-once="card(0).visibleOnce"
        class="landing-types__meta-card"
      >
        <span class="landing-types__meta-label">Problems available now</span>
        <strong class="landing-types__meta-value">{{ totalProblems }}</strong>
      </div>
      <div
        v-motion
        :initial="card(1).initial"
        :visible-once="card(1).visibleOnce"
        class="landing-types__meta-card"
      >
        <span class="landing-types__meta-label">Easy</span>
        <strong class="landing-types__meta-value">{{ easyCount }}</strong>
      </div>
      <div
        v-motion
        :initial="card(2).initial"
        :visible-once="card(2).visibleOnce"
        class="landing-types__meta-card"
      >
        <span class="landing-types__meta-label">Medium</span>
        <strong class="landing-types__meta-value">{{ mediumCount }}</strong>
      </div>
      <div
        v-motion
        :initial="card(3).initial"
        :visible-once="card(3).visibleOnce"
        class="landing-types__meta-card"
      >
        <span class="landing-types__meta-label">Hard</span>
        <strong class="landing-types__meta-value">{{ hardCount }}</strong>
      </div>
    </div>

    <div class="landing-types__chips">
      <span
        v-for="(category, index) in categories"
        :key="category"
        v-motion
        :initial="card(index, 35).initial"
        :visible-once="card(index, 35).visibleOnce"
        class="landing-types__chip"
      >
        {{ category }}
      </span>
    </div>

    <Button variant="secondary" size="lg" @click="emit('open-dashboard')">
      Explore problem library
    </Button>
  </section>
</template>

<style scoped>
.landing-types {
  scroll-margin-top: calc(var(--space-16) + var(--space-8));
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.landing-types__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.landing-types__intro {
  color: var(--color-text-secondary);
  max-width: 720px;
}

.landing-types__meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-3);
}

.landing-types__meta-card {
  border: var(--border-width) solid var(--color-border-strong);
  box-shadow: var(--shadow-brutal-sm);
  background: var(--color-surface);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  transition: transform var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease);
}

.landing-types__meta-card:hover {
  transform: translate3d(0, -3px, 0);
  box-shadow: 1px 1px 0 0 var(--color-shadow-strong);
}

.landing-types__meta-label {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: var(--color-text-tertiary);
}

.landing-types__meta-value {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  line-height: 1;
}

.landing-types__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.landing-types__chip {
  padding: var(--space-2) var(--space-4);
  border: var(--border-thin) solid var(--color-border-strong);
  box-shadow: var(--shadow-brutal-sm);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
  background: var(--color-surface-raised);
  transition: transform var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease);
}

.landing-types__chip:hover {
  transform: translate3d(0, -2px, 0);
  box-shadow: 1px 1px 0 0 var(--color-shadow-strong);
}

.landing-types :deep(.brutal-btn) {
  width: fit-content;
}

@media (max-width: 920px) {
  .landing-types__meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 540px) {
  .landing-types__meta {
    grid-template-columns: 1fr;
  }
}
</style>
