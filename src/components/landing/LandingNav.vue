<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Button from '../../design-system/components/Button.vue'
import Text from '../../design-system/components/Text.vue'
import type { LandingSectionLink } from '../../data/landingContent'
import { useLandingMotion } from '../../composables/useLandingMotion'
import { useTheme } from '../../composables/useTheme'

interface Props {
  links: LandingSectionLink[]
  ctaLabel: string
}

defineProps<Props>()
const { section, buttonPulse } = useLandingMotion()
const { theme, toggleTheme } = useTheme()

const emit = defineEmits<{
  (event: 'primary-cta'): void
}>()

const activeHash = ref('#hero')
const navMotion = computed(() => section(0))
const primaryPulseClass = computed(() => buttonPulse.value.className)
const themeLabel = computed(() => `Theme: ${theme.value === 'dark' ? 'Dark' : 'Light'}`)

const syncHash = () => {
  activeHash.value = window.location.hash || '#hero'
}

onMounted(() => {
  syncHash()
  window.addEventListener('hashchange', syncHash)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', syncHash)
})
</script>

<template>
  <header
    v-motion
    :initial="navMotion.initial"
    :visible-once="navMotion.visibleOnce"
    class="neo-nav landing-nav"
    data-testid="landing-nav"
  >
    <div class="neo-nav__inner landing-nav__inner">
      <a
        href="#hero"
        class="neo-nav__brand link-underline"
        :class="{ 'is-active': activeHash === '#hero' }"
      >
        <span class="neo-nav__brand-dot" />
        <Text as="span" variant="caption" weight="extrabold">CodeCraft</Text>
      </a>

      <nav class="neo-nav__links landing-nav__links" aria-label="Landing sections">
        <a
          v-for="link in links"
          :key="link.id"
          :href="`#${link.id}`"
          class="neo-nav__link link-underline"
          :class="{ 'is-active': activeHash === `#${link.id}` }"
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="neo-nav__actions">
        <button
          class="neo-nav__theme-toggle"
          type="button"
          :aria-label="themeLabel"
          @click="toggleTheme"
        >
          <span class="neo-nav__theme-label">{{ themeLabel }}</span>
          <svg
            v-if="theme === 'dark'"
            class="neo-nav__theme-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg
            v-else
            class="neo-nav__theme-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>

        <Button :class="primaryPulseClass" variant="primary" size="sm" @click="emit('primary-cta')">
          {{ ctaLabel }}
        </Button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.landing-nav {
  z-index: 20;
}

.landing-nav__inner {
  gap: var(--space-3);
}

@media (max-width: 920px) {
  .landing-nav__links {
    gap: var(--space-3);
  }

  .landing-nav :deep(.brutal-btn),
  .landing-nav .neo-nav__theme-toggle {
    min-height: 2rem;
  }
}
</style>
