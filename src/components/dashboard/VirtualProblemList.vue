<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BrutalBadge from '../brutal/BrutalBadge.vue'
import { useKeyboardNav } from '../../composables/useKeyboardNav'

export interface VirtualProblemItem {
  id: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  categories: string[]
  acceptance: number
  status: 'todo' | 'attempted' | 'solved'
}

interface Props {
  items: VirtualProblemItem[]
  viewportHeight?: number
  rowHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  viewportHeight: 620,
  rowHeight: 94,
})

const emit = defineEmits<{ (event: 'select', id: number): void }>()

const containerRef = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const overscan = 6

const { activeIndex, onKeydown, setIndex } = useKeyboardNav(() => props.items.length)

const startIndex = computed(() => Math.max(0, Math.floor(scrollTop.value / props.rowHeight) - overscan))
const endIndex = computed(() => {
  const visible = Math.ceil(props.viewportHeight / props.rowHeight) + overscan * 2
  return Math.min(props.items.length, startIndex.value + visible)
})

const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value).map((item, offset) => {
    const index = startIndex.value + offset
    return {
      ...item,
      index,
      top: index * props.rowHeight,
    }
  })
)

const totalHeight = computed(() => props.items.length * props.rowHeight)

const onScroll = () => {
  scrollTop.value = containerRef.value?.scrollTop ?? 0
}

const onEnter = () => {
  const selected = props.items[activeIndex.value]
  if (selected) emit('select', selected.id)
}

const statusTone = (status: VirtualProblemItem['status']) => {
  if (status === 'solved') return 'success'
  if (status === 'attempted') return 'warning'
  return 'info'
}

const difficultyTone = (difficulty: VirtualProblemItem['difficulty']) =>
  difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'

watch(activeIndex, (index) => {
  const container = containerRef.value
  if (!container) return

  const rowTop = index * props.rowHeight
  const rowBottom = rowTop + props.rowHeight

  if (rowTop < container.scrollTop) {
    container.scrollTop = rowTop
  } else if (rowBottom > container.scrollTop + props.viewportHeight) {
    container.scrollTop = rowBottom - props.viewportHeight
  }
})
</script>

<template>
  <div class="virtual-list-wrap">
    <div class="virtual-list-header" role="row">
      <span>Problem</span>
      <span>Difficulty</span>
      <span>Acceptance</span>
      <span>Status</span>
    </div>

    <div
      ref="containerRef"
      class="virtual-list"
      tabindex="0"
      role="listbox"
      aria-label="Problems"
      :style="{ height: `${viewportHeight}px` }"
      @scroll="onScroll"
      @keydown="onKeydown"
      @keyup.enter.prevent="onEnter"
      @keyup.space.prevent="onEnter"
    >
      <div :style="{ height: `${totalHeight}px` }" class="virtual-list__spacer">
        <button
          v-for="item in visibleItems"
          :key="item.id"
          class="problem-row"
          :class="{ 'problem-row--active': activeIndex === item.index }"
          :style="{ transform: `translateY(${item.top}px)` }"
          role="option"
          :aria-selected="activeIndex === item.index"
          @mouseenter="setIndex(item.index)"
          @focus="setIndex(item.index)"
          @click="emit('select', item.id)"
        >
          <div class="problem-row__title-wrap">
            <span class="problem-row__id">#{{ item.id }}</span>
            <div>
              <p class="problem-row__title">{{ item.title }}</p>
              <p class="problem-row__categories">{{ item.categories.slice(0, 3).join(' · ') }}</p>
            </div>
          </div>

          <BrutalBadge
            variant="difficulty"
            size="sm"
            :tone="difficultyTone(item.difficulty)"
          >
            {{ item.difficulty }}
          </BrutalBadge>

          <div class="problem-row__acceptance">
            <div class="progress-track">
              <span class="progress-fill" :style="{ width: `${item.acceptance}%` }" />
            </div>
            <span class="progress-label">{{ item.acceptance }}%</span>
          </div>

          <BrutalBadge variant="status" size="sm" :tone="statusTone(item.status)">
            {{ item.status }}
          </BrutalBadge>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.virtual-list-wrap {
  border: 3px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  box-shadow: 5px 5px 0 0 var(--color-shadow-strong);
  background: var(--color-surface);
  overflow: hidden;
}

.virtual-list-header {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) 0.8fr 0.95fr 0.8fr;
  gap: 0.5rem;
  border-bottom: 3px solid var(--color-border-strong);
  background: var(--color-surface-raised);
  padding: 0.6rem 0.7rem;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: var(--font-weight-bold);
}

.virtual-list {
  overflow: auto;
}

.virtual-list:focus-visible {
  outline: 4px solid var(--color-focus-ring);
  outline-offset: -4px;
}

.virtual-list__spacer {
  position: relative;
}

.problem-row {
  position: absolute;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) 0.8fr 0.95fr 0.8fr;
  align-items: center;
  gap: 0.5rem;
  min-height: 94px;
  padding: 0.6rem 0.7rem;
  border: 0;
  border-bottom: 2px solid var(--color-border-subtle);
  background: var(--color-surface);
  color: var(--color-text-primary);
  text-align: left;
  cursor: pointer;
}

.problem-row:nth-child(odd) {
  background: color-mix(in srgb, var(--color-surface) 88%, var(--color-border-strong) 12%);
}

.problem-row:hover {
  background: color-mix(in srgb, var(--color-warning-bg) 74%, var(--color-surface) 26%);
}

.problem-row--active {
  background: color-mix(in srgb, var(--color-warning-bg) 86%, var(--color-surface) 14%) !important;
}

.problem-row__title-wrap {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  min-width: 0;
}

.problem-row__id {
  border: 2px solid var(--color-border-strong);
  background: var(--color-background);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: var(--font-weight-semibold);
  padding: 0.2rem 0.35rem;
  line-height: 1;
}

.problem-row__title {
  margin: 0;
  font-weight: var(--font-weight-semibold);
}

.problem-row__categories {
  margin: 0.2rem 0 0;
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.problem-row__acceptance {
  display: grid;
  gap: 0.25rem;
}

.progress-track {
  height: 10px;
  border: 2px solid var(--color-border-strong);
  background: var(--color-background);
}

.progress-fill {
  display: block;
  height: 100%;
  background: var(--color-success);
  transition: width 300ms ease-out;
}

.progress-label {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
}

@media (max-width: 940px) {
  .virtual-list-header {
    display: none;
  }

  .problem-row {
    grid-template-columns: 1fr;
    min-height: 124px;
    gap: 0.4rem;
  }
}
</style>
