<script setup lang="ts">
import { computed } from 'vue'
import Button from '../../design-system/components/Button.vue'
import Text from '../../design-system/components/Text.vue'
import type { HeroContent } from '../../data/landingContent'
import { useLandingMotion } from '../../composables/useLandingMotion'

interface Props {
  hero: HeroContent
  isAuthenticated: boolean
  primaryCtaLabel: string
}

defineProps<Props>()
const { hero: heroMotion, card, buttonPulse } = useLandingMotion()

const emit = defineEmits<{
  (event: 'primary-cta'): void
  (event: 'secondary-cta'): void
}>()

const primaryPulseClass = computed(() => buttonPulse.value.className)
</script>

<template>
  <section id="hero" class="landing-hero" data-testid="landing-hero">
    <div class="landing-hero__content">
      <div
        v-motion
        :initial="heroMotion(0).initial"
        :visible-once="heroMotion(0).visibleOnce"
        class="landing-hero__badge"
      >
        <span class="landing-hero__badge-dot" />
        <Text variant="caption" weight="bold">{{ hero.badge }}</Text>
      </div>

      <div
        v-motion
        :initial="heroMotion(1).initial"
        :visible-once="heroMotion(1).visibleOnce"
        class="landing-hero__headline"
      >
        <Text as="h1" variant="hero" weight="extrabold" class="landing-hero__title">
          {{ hero.title }}
          <span class="landing-hero__accent">{{ hero.titleAccent }}</span>
        </Text>
        <Text
          v-motion
          :initial="heroMotion(2).initial"
          :visible-once="heroMotion(2).visibleOnce"
          as="p"
          variant="body"
          class="landing-hero__description"
        >
          {{ hero.description }}
        </Text>
      </div>

      <div
        v-motion
        :initial="heroMotion(3).initial"
        :visible-once="heroMotion(3).visibleOnce"
        class="landing-hero__actions"
      >
        <Button :class="primaryPulseClass" variant="primary" size="lg" @click="emit('primary-cta')">
          {{ primaryCtaLabel }}
        </Button>
        <Button v-if="!isAuthenticated" variant="ghost" size="lg" @click="emit('secondary-cta')">
          Sign in
        </Button>
      </div>

      <p
        v-if="!isAuthenticated"
        v-motion
        :initial="heroMotion(4).initial"
        :visible-once="heroMotion(4).visibleOnce"
        class="landing-hero__guest"
      >
        <router-link to="/dashboard" class="landing-hero__guest-link">or continue as guest</router-link>
      </p>

      <div
        v-motion
        :initial="heroMotion(5).initial"
        :visible-once="heroMotion(5).visibleOnce"
        class="landing-hero__pills"
      >
        <span
          v-for="(pill, index) in hero.pills"
          :key="pill"
          v-motion
          :initial="card(index).initial"
          :visible-once="card(index).visibleOnce"
          class="landing-hero__pill"
          :class="`landing-hero__pill--${index}`"
        >
          {{ pill }}
        </span>
      </div>
    </div>

    <div
      v-motion
      :initial="heroMotion(6).initial"
      :visible-once="heroMotion(6).visibleOnce"
      class="landing-hero__preview"
    >
      <div class="landing-hero__preview-top">
        <div class="landing-hero__dots">
          <span class="dot dot--coral" />
          <span class="dot dot--yellow" />
          <span class="dot dot--turquoise" />
        </div>
        <Text variant="caption" weight="medium" class="landing-hero__preview-title">
          {{ hero.previewTitle }}
        </Text>
      </div>
      <div class="landing-hero__preview-body">
        <pre><code>{{ hero.previewCode }}</code></pre>
      </div>
    </div>
  </section>
</template>

<style scoped>
.landing-hero {
  scroll-margin-top: calc(var(--space-16) + var(--space-8));
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(380px, 520px);
  gap: var(--space-12);
  align-items: center;
}

.landing-hero__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.landing-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  width: fit-content;
  padding: var(--space-2) var(--space-4);
  border: var(--border-thin) solid var(--color-border-strong);
  box-shadow: var(--shadow-brutal-sm);
  background: var(--color-surface);
}

.landing-hero__badge-dot {
  width: 8px;
  height: 8px;
  border: 1px solid var(--color-ink);
  background: var(--color-turquoise);
}

.landing-hero__headline {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.landing-hero__title {
  color: var(--color-text-primary);
  text-wrap: balance;
}

.landing-hero__accent {
  display: inline-block;
  color: var(--color-coral);
  position: relative;
}

.landing-hero__accent::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.2rem;
  z-index: -1;
  height: 8px;
  background: var(--color-yellow);
  transform: rotate(-1deg);
}

.landing-hero__description {
  max-width: 560px;
  color: var(--color-text-secondary);
  font-size: var(--text-lg);
}

.landing-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.landing-hero__guest {
  margin: 0;
}

.landing-hero__guest-link {
  color: var(--color-text-tertiary);
  font-size: var(--text-sm);
  text-decoration: none;
  border-bottom: 1px dashed currentColor;
}

.landing-hero__guest-link:hover,
.landing-hero__guest-link:focus-visible {
  color: var(--color-text-primary);
}

.landing-hero__guest-link:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 3px;
}

.landing-hero__pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.landing-hero__pill {
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-bold);
  border: var(--border-thin) solid var(--color-border-strong);
  box-shadow: var(--shadow-brutal-sm);
  transition: transform var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease);
}

.landing-hero__pill:hover {
  transform: translate(1px, 1px) rotate(0deg);
  box-shadow: 1px 1px 0 0 var(--color-shadow-strong);
}

.landing-hero__pill--0 {
  background: var(--color-turquoise);
  transform: rotate(-1.2deg);
}

.landing-hero__pill--1 {
  background: var(--color-yellow);
  transform: rotate(1deg);
}

.landing-hero__pill--2 {
  background: var(--color-coral);
  color: var(--color-white);
  transform: rotate(-0.6deg);
}

.landing-hero__preview {
  border: var(--border-thick) solid var(--color-border-strong);
  box-shadow: var(--shadow-brutal-lg);
  overflow: hidden;
  transition: transform var(--duration-normal) var(--ease),
    box-shadow var(--duration-normal) var(--ease);
}

.landing-hero__preview:hover {
  transform: translate3d(0, -4px, 0);
  box-shadow: var(--shadow-brutal);
}

.landing-hero__preview:focus-within {
  transform: translate3d(0, -3px, 0);
  box-shadow: var(--shadow-brutal);
}

.landing-hero__preview-top {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: var(--color-accent-ink);
  padding: var(--space-3) var(--space-4);
}

.landing-hero__dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.28);
}

.dot--coral {
  background: var(--color-coral);
}

.dot--yellow {
  background: var(--color-yellow);
}

.dot--turquoise {
  background: var(--color-turquoise);
}

.landing-hero__preview-title {
  color: rgba(255, 255, 255, 0.62);
}

.landing-hero__preview-body {
  background: #0d0d0d;
  color: #e5e5e5;
  padding: var(--space-6);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.7;
}

.landing-hero__preview-body pre {
  margin: 0;
  white-space: pre-wrap;
}

:global([data-theme='dark'] .landing-hero__accent)::after {
  content: none;
}

:global([data-theme='dark'] .landing-hero__preview-top) {
  background: color-mix(in srgb, var(--color-accent-ink) 82%, var(--color-surface-raised));
}

:global([data-theme='dark'] .dot) {
  border-color: rgba(207, 207, 207, 0.18);
}

:global([data-theme='dark'] .landing-hero__preview-title) {
  color: rgba(207, 207, 207, 0.56);
}

:global([data-theme='dark'] .landing-hero__preview-body) {
  background: #0b0b0b;
  color: #d7d7d7;
}

@media (max-width: 980px) {
  .landing-hero {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .landing-hero__description {
    max-width: none;
  }
}

@media (max-width: 768px) {
  .landing-hero {
    text-align: left;
  }

  .landing-hero__preview {
    display: none;
  }

  .landing-hero__title.text--hero {
    font-size: var(--text-4xl);
  }
}
</style>
