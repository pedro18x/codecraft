<script setup lang="ts">
import Text from '../../design-system/components/Text.vue'
import type { HowItWorksStep } from '../../data/landingContent'
import { useLandingMotion } from '../../composables/useLandingMotion'

interface Props {
  steps: HowItWorksStep[]
}

defineProps<Props>()
const { section, card } = useLandingMotion()
</script>

<template>
  <section id="how-it-works" class="landing-how" data-testid="landing-how-it-works">
    <div v-motion :initial="section(0).initial" :visible-once="section(0).visibleOnce" class="landing-how__head">
      <Text as="h2" variant="h2" weight="extrabold">How it works</Text>
      <Text as="p" variant="body" class="landing-how__intro">
        Keep the cycle tight: choose a problem, execute, iterate, and retain the learning.
      </Text>
    </div>

    <div class="landing-how__grid">
      <article
        v-for="(step, index) in steps"
        :key="step.title"
        v-motion
        :initial="card(index).initial"
        :visible-once="card(index).visibleOnce"
        class="landing-how__card"
      >
        <span class="landing-how__index">0{{ index + 1 }}</span>
        <Text as="h3" variant="h3" weight="bold">{{ step.title }}</Text>
        <Text as="p" variant="body" class="landing-how__text">{{ step.description }}</Text>
        <p class="landing-how__proof">{{ step.proof }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.landing-how {
  scroll-margin-top: calc(var(--space-16) + var(--space-8));
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.landing-how__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.landing-how__intro {
  color: var(--color-text-secondary);
  max-width: 700px;
}

.landing-how__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
}

.landing-how__card {
  border: var(--border-width) solid var(--color-border-strong);
  box-shadow: var(--shadow-brutal);
  background: var(--color-surface);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  transition: transform var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease);
}

.landing-how__card:hover {
  transform: translate3d(0, -3px, 0);
  box-shadow: var(--shadow-brutal-sm);
}

.landing-how__index {
  display: inline-flex;
  width: fit-content;
  padding: var(--space-1) var(--space-3);
  border: var(--border-thin) solid var(--color-border-strong);
  box-shadow: var(--shadow-brutal-sm);
  background: var(--color-yellow);
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: var(--font-weight-bold);
  transform: rotate(-1deg);
}

.landing-how__text {
  color: var(--color-text-secondary);
}

.landing-how__proof {
  margin: 0;
  padding: var(--space-2) var(--space-3);
  border-left: 4px solid var(--color-turquoise);
  background: color-mix(in srgb, var(--color-turquoise) 18%, var(--color-surface));
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  line-height: var(--line-height-normal);
}

@media (max-width: 1000px) {
  .landing-how__grid {
    grid-template-columns: 1fr;
  }
}
</style>
