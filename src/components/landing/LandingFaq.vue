<script setup lang="ts">
import { ref } from 'vue'
import Text from '../../design-system/components/Text.vue'
import type { FaqItem } from '../../data/landingContent'
import { useLandingMotion } from '../../composables/useLandingMotion'

interface Props {
  items: FaqItem[]
}

defineProps<Props>()
const { section, card } = useLandingMotion()

const openItem = ref<string | null>(null)

const toggleItem = (id: string) => {
  openItem.value = openItem.value === id ? null : id
}
</script>

<template>
  <section id="faq" class="landing-faq" data-testid="landing-faq">
    <div v-motion :initial="section(0).initial" :visible-once="section(0).visibleOnce" class="landing-faq__head">
      <Text as="h2" variant="h2" weight="extrabold">FAQ</Text>
      <Text as="p" variant="body" class="landing-faq__intro">
        Clear answers before you start practicing.
      </Text>
    </div>

    <div class="landing-faq__list">
      <article
        v-for="(item, index) in items"
        :key="item.id"
        v-motion
        :initial="card(index).initial"
        :visible-once="card(index).visibleOnce"
        class="landing-faq__item"
      >
        <h3 class="landing-faq__title">
          <button
            class="landing-faq__toggle"
            :aria-expanded="openItem === item.id"
            :aria-controls="`${item.id}-panel`"
            :id="`${item.id}-button`"
            @click="toggleItem(item.id)"
          >
            <span>{{ item.question }}</span>
            <span
              class="landing-faq__icon"
              :class="{ 'landing-faq__icon--open': openItem === item.id }"
              aria-hidden="true"
            >
              {{ openItem === item.id ? '−' : '+' }}
            </span>
          </button>
        </h3>
        <div
          :id="`${item.id}-panel`"
          class="landing-faq__panel"
          role="region"
          :aria-labelledby="`${item.id}-button`"
          :hidden="openItem !== item.id"
        >
          <Text as="p" variant="body">{{ item.answer }}</Text>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.landing-faq {
  scroll-margin-top: calc(var(--space-16) + var(--space-8));
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.landing-faq__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.landing-faq__intro {
  color: var(--color-text-secondary);
}

.landing-faq__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.landing-faq__item {
  border: var(--border-width) solid var(--color-border-strong);
  box-shadow: var(--shadow-brutal);
  background: var(--color-surface);
  transition: transform var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease);
}

.landing-faq__item:hover {
  transform: translate3d(0, -2px, 0);
  box-shadow: var(--shadow-brutal-sm);
}

.landing-faq__title {
  margin: 0;
}

.landing-faq__toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  border: 0;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
  padding: var(--space-4) var(--space-5);
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
}

.landing-faq__toggle:hover {
  background: var(--color-surface-hover);
}

.landing-faq__toggle:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: -3px;
}

.landing-faq__icon {
  display: inline-flex;
  width: 1.6rem;
  height: 1.6rem;
  align-items: center;
  justify-content: center;
  border: var(--border-thin) solid var(--color-border-strong);
  box-shadow: var(--shadow-brutal-sm);
  background: var(--color-yellow);
  font-size: var(--text-lg);
  line-height: 1;
  transition: transform var(--duration-fast) var(--ease), opacity var(--duration-fast) var(--ease);
}

.landing-faq__icon--open {
  transform: rotate(180deg);
  opacity: 0.95;
}

.landing-faq__panel {
  padding: 0 var(--space-5) var(--space-5);
  color: var(--color-text-secondary);
}
</style>
