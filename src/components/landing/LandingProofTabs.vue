<script setup lang="ts">
import { computed, ref } from 'vue'
import Text from '../../design-system/components/Text.vue'
import type { ProofTabContent } from '../../data/landingContent'
import { useLandingMotion } from '../../composables/useLandingMotion'

interface Props {
  tabs: ProofTabContent[]
}

const props = defineProps<Props>()
const { section, card } = useLandingMotion()

const activeTabId = ref(props.tabs[0]?.id ?? 'execution')
const tabButtons = ref<Array<HTMLButtonElement | null>>([])

const activeIndex = computed(() =>
  Math.max(
    0,
    props.tabs.findIndex((tab) => tab.id === activeTabId.value)
  )
)

const activeTab = computed(() => props.tabs[activeIndex.value] ?? props.tabs[0])

const setTabButton = (element: HTMLButtonElement | null, index: number) => {
  tabButtons.value[index] = element
}

const selectTabByIndex = (index: number) => {
  if (!props.tabs[index]) return
  activeTabId.value = props.tabs[index].id
}

const onTabKeydown = (event: KeyboardEvent, index: number) => {
  if (!props.tabs.length) return

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    const next = (index + 1) % props.tabs.length
    selectTabByIndex(next)
    tabButtons.value[next]?.focus()
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    const prev = (index - 1 + props.tabs.length) % props.tabs.length
    selectTabByIndex(prev)
    tabButtons.value[prev]?.focus()
  }

  if (event.key === 'Home') {
    event.preventDefault()
    selectTabByIndex(0)
    tabButtons.value[0]?.focus()
  }

  if (event.key === 'End') {
    event.preventDefault()
    const last = props.tabs.length - 1
    selectTabByIndex(last)
    tabButtons.value[last]?.focus()
  }
}
</script>

<template>
  <section
    v-motion
    :initial="section(0).initial"
    :visible-once="section(0).visibleOnce"
    class="landing-proof"
    data-testid="landing-proof-tabs"
  >
    <div v-motion :initial="section(1).initial" :visible-once="section(1).visibleOnce" class="landing-proof__head">
      <Text as="h2" variant="h2" weight="extrabold">Product proof, not promises</Text>
      <Text as="p" variant="body" class="landing-proof__intro">
        See how practice works from problem selection to iteration and progress tracking.
      </Text>
    </div>

    <div
      v-motion
      :initial="section(2).initial"
      :visible-once="section(2).visibleOnce"
      class="landing-proof__tabs"
      role="tablist"
      aria-label="Product proof tabs"
    >
      <button
        v-for="(tab, index) in tabs"
        :id="`proof-tab-${tab.id}`"
        :key="tab.id"
        :ref="(el) => setTabButton(el as HTMLButtonElement | null, index)"
        v-motion
        :initial="card(index).initial"
        :visible-once="card(index).visibleOnce"
        class="landing-proof__tab"
        :class="{ 'landing-proof__tab--active': tab.id === activeTabId }"
        role="tab"
        :aria-selected="tab.id === activeTabId"
        :aria-controls="`proof-panel-${tab.id}`"
        :tabindex="tab.id === activeTabId ? 0 : -1"
        @click="selectTabByIndex(index)"
        @keydown="onTabKeydown($event, index)"
      >
        {{ tab.label }}
      </button>
    </div>

    <article
      v-if="activeTab"
      :id="`proof-panel-${activeTab.id}`"
      class="landing-proof__panel"
      role="tabpanel"
      :aria-labelledby="`proof-tab-${activeTab.id}`"
      tabindex="0"
    >
      <div class="landing-proof__copy">
        <Text as="h3" variant="h3" weight="bold">{{ activeTab.title }}</Text>
        <Text as="p" variant="body" class="landing-proof__text">{{ activeTab.description }}</Text>
        <ul class="landing-proof__list">
          <li v-for="item in activeTab.bullets" :key="item">{{ item }}</li>
        </ul>
      </div>
      <pre class="landing-proof__snippet"><code>{{ activeTab.snippet }}</code></pre>
    </article>
  </section>
</template>

<style scoped>
.landing-proof {
  scroll-margin-top: calc(var(--space-16) + var(--space-8));
  border: var(--border-thick) solid var(--color-border-strong);
  box-shadow: var(--shadow-brutal-lg);
  background: var(--color-surface);
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.landing-proof__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.landing-proof__intro {
  max-width: 720px;
  color: var(--color-text-secondary);
}

.landing-proof__tabs {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.landing-proof__tab {
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  border: var(--border-width) solid var(--color-border-strong);
  background: var(--color-surface-raised);
  color: var(--color-text-primary);
  padding: var(--space-2) var(--space-4);
  box-shadow: var(--shadow-brutal-sm);
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease);
}

.landing-proof__tab:hover {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 0 var(--color-shadow-strong);
}

.landing-proof__tab--active {
  background: var(--color-turquoise);
  color: var(--color-accent-ink);
}

.landing-proof__tab:focus-visible,
.landing-proof__panel:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
}

.landing-proof__panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(250px, 360px);
  gap: var(--space-6);
  border: var(--border-width) solid var(--color-border-strong);
  box-shadow: var(--shadow-brutal);
  background: var(--color-surface-raised);
  padding: var(--space-6);
  animation: slideUp 0.25s var(--ease) both;
  transition: transform var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease);
}

.landing-proof__panel:hover {
  transform: translate3d(0, -2px, 0);
  box-shadow: var(--shadow-brutal-sm);
}

.landing-proof__copy {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.landing-proof__text {
  color: var(--color-text-secondary);
}

.landing-proof__list {
  margin: 0;
  padding-left: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  color: var(--color-text-secondary);
}

.landing-proof__snippet {
  margin: 0;
  border: var(--border-width) solid var(--color-border-strong);
  box-shadow: var(--shadow-brutal-sm);
  background: var(--color-accent-ink);
  color: var(--color-turquoise);
  padding: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  white-space: pre-wrap;
  transition: transform var(--duration-fast) var(--ease);
}

.landing-proof__panel:hover .landing-proof__snippet {
  transform: translate3d(0, -1px, 0);
}

:global([data-theme='dark'] .landing-proof__tab--active) {
  background: color-mix(in srgb, var(--color-turquoise) 62%, var(--color-surface-raised));
  color: var(--color-text-primary);
  border-color: color-mix(in srgb, var(--color-turquoise) 38%, var(--color-border-strong));
}

@media (max-width: 880px) {
  .landing-proof {
    padding: var(--space-6);
  }

  .landing-proof__panel {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .landing-proof__panel {
    animation: none;
  }
}
</style>
