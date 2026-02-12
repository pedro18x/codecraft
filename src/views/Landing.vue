<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { problems } from '../data/problems'
import {
  faqItems,
  heroContent,
  howItWorksSteps,
  landingSectionLinks,
  proofTabs,
} from '../data/landingContent'
import { useAuth } from '../composables/useAuth'
import { useLandingMotion } from '../composables/useLandingMotion'
import LandingFaq from '../components/landing/LandingFaq.vue'
import LandingFinalCta from '../components/landing/LandingFinalCta.vue'
import LandingHero from '../components/landing/LandingHero.vue'
import LandingHowItWorks from '../components/landing/LandingHowItWorks.vue'
import LandingNav from '../components/landing/LandingNav.vue'
import LandingProblemTypes from '../components/landing/LandingProblemTypes.vue'
import LandingProofTabs from '../components/landing/LandingProofTabs.vue'

const router = useRouter()
const { isAuthenticated } = useAuth()
const { reducedMotion, section, backgroundFloat } = useLandingMotion()
const scrollY = ref(0)
let ticking = false

const updateScroll = () => {
  scrollY.value = window.scrollY
}

const onScroll = () => {
  if (reducedMotion.value) return
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    updateScroll()
    ticking = false
  })
}

const primaryCtaLabel = computed(() => (isAuthenticated.value ? 'Go to dashboard' : 'Get started free'))

const categories = computed(() => {
  return [...new Set(problems.flatMap((problem) => problem.categories))].sort((a, b) =>
    a.localeCompare(b)
  )
})

const easyCount = computed(() => problems.filter((problem) => problem.difficulty === 'Easy').length)
const mediumCount = computed(() => problems.filter((problem) => problem.difficulty === 'Medium').length)
const hardCount = computed(() => problems.filter((problem) => problem.difficulty === 'Hard').length)

const handlePrimaryCta = () => {
  if (isAuthenticated.value) {
    router.push('/dashboard')
    return
  }

  router.push('/register')
}

const handleSecondaryCta = () => {
  if (!isAuthenticated.value) {
    router.push('/login')
  }
}

const openDashboard = () => {
  router.push('/dashboard')
}

const sectionMotion = computed(() => section(0))

const decoParallaxStyle = (index: number) => {
  if (reducedMotion.value) return undefined
  const multipliers = [0.06, -0.04, 0.08]
  const shifted = scrollY.value * (multipliers[index] ?? 0)
  const capped = Math.max(-16, Math.min(16, shifted))
  return {
    transform: `translate3d(0, ${capped}px, 0)`,
  }
}

const decoFloatStyle = (index: number) => {
  const config = backgroundFloat(index)
  return {
    '--lp-float-duration': `${config.durationMs}ms`,
    '--lp-float-delay': `${config.delayMs ?? 0}ms`,
  }
}

onMounted(() => {
  updateScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="landing-page mesh-bg">
    <div
      v-motion
      :initial="sectionMotion.initial"
      :visible-once="sectionMotion.visibleOnce"
      class="landing-page__deco-layer landing-page__deco-layer--one"
      :style="decoParallaxStyle(0)"
    >
      <div
        class="landing-page__deco landing-page__deco--one"
        :class="backgroundFloat(0).className"
        :style="decoFloatStyle(0)"
      />
    </div>
    <div
      v-motion
      :initial="sectionMotion.initial"
      :visible-once="sectionMotion.visibleOnce"
      class="landing-page__deco-layer landing-page__deco-layer--two"
      :style="decoParallaxStyle(1)"
    >
      <div
        class="landing-page__deco landing-page__deco--two"
        :class="backgroundFloat(1).className"
        :style="decoFloatStyle(1)"
      />
    </div>
    <div
      v-motion
      :initial="sectionMotion.initial"
      :visible-once="sectionMotion.visibleOnce"
      class="landing-page__deco-layer landing-page__deco-layer--three"
      :style="decoParallaxStyle(2)"
    >
      <div
        class="landing-page__deco landing-page__deco--three"
        :class="backgroundFloat(2).className"
        :style="decoFloatStyle(2)"
      />
    </div>

    <LandingNav :links="landingSectionLinks" :cta-label="primaryCtaLabel" @primary-cta="handlePrimaryCta" />

    <main class="landing-page__main">
      <LandingHero
        :hero="heroContent"
        :is-authenticated="isAuthenticated"
        :primary-cta-label="primaryCtaLabel"
        @primary-cta="handlePrimaryCta"
        @secondary-cta="handleSecondaryCta"
      />

      <LandingProofTabs :tabs="proofTabs" />

      <LandingHowItWorks :steps="howItWorksSteps" />

      <LandingProblemTypes
        :categories="categories"
        :total-problems="problems.length"
        :easy-count="easyCount"
        :medium-count="mediumCount"
        :hard-count="hardCount"
        @open-dashboard="openDashboard"
      />

      <LandingFaq :items="faqItems" />

      <LandingFinalCta
        :is-authenticated="isAuthenticated"
        :primary-cta-label="primaryCtaLabel"
        @primary-cta="handlePrimaryCta"
        @secondary-cta="handleSecondaryCta"
      />
    </main>
  </div>
</template>

<style scoped>
.landing-page {
  display: flow-root;
  min-height: 100dvh;
  position: relative;
  overflow: clip;
  padding-bottom: var(--space-12);
}

.landing-page__main {
  width: min(1180px, calc(100% - var(--space-6)));
  margin: 0 auto;
  padding: var(--space-12) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  position: relative;
  z-index: 1;
}

.landing-page__deco {
  border: var(--border-width) solid var(--color-border-strong);
  width: 100%;
  height: 100%;
}

.landing-page__deco-layer {
  position: absolute;
  z-index: 0;
  pointer-events: none;
}

.landing-page__deco-layer--one {
  width: 200px;
  height: 200px;
  top: 7%;
  left: 2%;
}

.landing-page__deco--one {
  background: var(--color-turquoise);
  opacity: 0.22;
  --shape-rotation: 13deg;
}

.landing-page__deco-layer--two {
  width: 92px;
  height: 92px;
  top: 11%;
  right: 8%;
}

.landing-page__deco--two {
  background: var(--color-coral);
  opacity: 0.19;
  --shape-rotation: 18deg;
}

.landing-page__deco-layer--three {
  width: 170px;
  height: 170px;
  bottom: 8%;
  right: 4%;
}

.landing-page__deco--three {
  background: var(--color-yellow);
  opacity: 0.22;
  --shape-rotation: -9deg;
}

:global([data-theme='dark'] .landing-page__deco) {
  border-color: var(--color-border);
}

:global([data-theme='dark'] .landing-page__deco--one) {
  background: color-mix(in srgb, var(--color-turquoise) 55%, var(--color-surface));
  opacity: 0.2;
}

:global([data-theme='dark'] .landing-page__deco--two) {
  background: color-mix(in srgb, var(--color-coral) 52%, var(--color-surface));
  opacity: 0.17;
}

:global([data-theme='dark'] .landing-page__deco--three) {
  background: color-mix(in srgb, var(--color-yellow) 50%, var(--color-surface));
  opacity: 0.19;
}

@media (max-width: 920px) {
  .landing-page__main {
    width: min(1180px, calc(100% - var(--space-5)));
    padding: var(--space-8) 0;
    gap: var(--space-12);
  }

  .landing-page__deco-layer--one {
    left: -60px;
  }

  .landing-page__deco-layer--three {
    right: -40px;
  }
}

@media (max-width: 680px) {
  .landing-page__deco-layer {
    display: none;
  }
}

:global(#how-it-works:target),
:global(#problem-types:target),
:global(#faq:target),
:global(#final-cta:target),
:global(#hero:target) {
  animation: target-ring-flash 520ms var(--ease) both;
}
</style>
