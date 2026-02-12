<script setup lang="ts">
import { computed } from 'vue'
import Button from '../../design-system/components/Button.vue'
import Text from '../../design-system/components/Text.vue'
import { useLandingMotion } from '../../composables/useLandingMotion'

interface Props {
  isAuthenticated: boolean
  primaryCtaLabel: string
}

defineProps<Props>()
const { section, buttonPulse } = useLandingMotion()

const emit = defineEmits<{
  (event: 'primary-cta'): void
  (event: 'secondary-cta'): void
}>()

const finalCtaMotion = computed(() => section(0))
const primaryPulseClass = computed(() => buttonPulse.value.className)
</script>

<template>
  <section id="final-cta" class="landing-final" data-testid="landing-final-cta">
    <div
      v-motion
      :initial="finalCtaMotion.initial"
      :visible-once="finalCtaMotion.visibleOnce"
      class="landing-final__card"
    >
      <Text as="h2" variant="h2" weight="extrabold">Your next interview prep session starts now</Text>
      <Text as="p" variant="body" class="landing-final__text">
        Keep the loop tight: solve, run, improve, repeat. Show up prepared when it matters.
      </Text>

      <div class="landing-final__actions">
        <Button :class="primaryPulseClass" variant="primary" size="lg" @click="emit('primary-cta')">
          {{ primaryCtaLabel }}
        </Button>
        <Button v-if="!isAuthenticated" variant="ghost" size="lg" @click="emit('secondary-cta')">
          Sign in
        </Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.landing-final {
  scroll-margin-top: calc(var(--space-16) + var(--space-8));
}

.landing-final__card {
  border: var(--border-thick) solid var(--color-border-strong);
  box-shadow: var(--shadow-brutal-lg);
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--color-coral) 28%, var(--color-surface)),
    color-mix(in srgb, var(--color-yellow) 30%, var(--color-surface))
  );
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  transition: transform var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease);
}

.landing-final__card:hover {
  transform: translate3d(0, -3px, 0);
  box-shadow: var(--shadow-brutal);
}

.landing-final__text {
  color: var(--color-text-primary);
  max-width: 720px;
}

.landing-final__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

:global([data-theme='dark'] .landing-final__card) {
  background: linear-gradient(
    145deg,
    var(--dark-lp-accent-wash-1),
    var(--dark-lp-accent-wash-2)
  );
}

@media (max-width: 768px) {
  .landing-final__card {
    padding: var(--space-6);
  }
}
</style>
