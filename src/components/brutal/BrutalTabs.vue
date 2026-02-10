<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

interface TabItem {
  id: string
  label: string
}

interface Props {
  modelValue: string
  items: TabItem[]
}

const props = defineProps<Props>()
const emit = defineEmits<{ (event: 'update:modelValue', id: string): void }>()

const containerRef = ref<HTMLElement | null>(null)
const tabRefs = ref<Record<string, HTMLElement | null>>({})
const indicator = ref({ width: 0, left: 0 })

const setTabRef = (id: string, el: unknown) => {
  tabRefs.value[id] = el instanceof HTMLElement ? el : null
}

const updateIndicator = () => {
  const activeId = props.modelValue
  const activeEl = tabRefs.value[activeId]
  const container = containerRef.value
  if (!activeEl || !container) return

  const containerRect = container.getBoundingClientRect()
  const rect = activeEl.getBoundingClientRect()

  indicator.value = {
    left: rect.left - containerRect.left,
    width: rect.width,
  }
}

watch(
  () => props.modelValue,
  async () => {
    await nextTick()
    updateIndicator()
  },
  { immediate: true }
)

const onResize = () => updateIndicator()

onMounted(() => {
  window.addEventListener('resize', onResize)
  nextTick(updateIndicator)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div ref="containerRef" class="brutal-tabs" role="tablist" aria-orientation="horizontal">
    <button
      v-for="item in items"
      :key="item.id"
      :ref="(el) => setTabRef(item.id, el)"
      class="brutal-tabs__tab"
      :class="{ 'brutal-tabs__tab--active': modelValue === item.id }"
      role="tab"
      :tabindex="modelValue === item.id ? 0 : -1"
      :aria-selected="modelValue === item.id"
      :aria-controls="`panel-${item.id}`"
      @click="emit('update:modelValue', item.id)"
    >
      {{ item.label }}
    </button>

    <span
      class="brutal-tabs__indicator"
      :style="{ width: `${indicator.width}px`, transform: `translateX(${indicator.left}px)` }"
    />
  </div>
</template>

<style scoped>
.brutal-tabs {
  position: relative;
  display: flex;
  gap: 0.25rem;
  border-bottom: 4px solid var(--color-ink);
  padding-bottom: 0.25rem;
}

.brutal-tabs__tab {
  border: 3px solid transparent;
  border-bottom: 0;
  background: transparent;
  padding: 0.45rem 0.7rem 0.35rem;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease), transform var(--duration-fast) var(--ease), font-size var(--duration-fast) var(--ease);
}

.brutal-tabs__tab--active {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
  font-size: var(--text-base);
}

.brutal-tabs__tab:focus-visible {
  outline: 4px solid var(--color-yellow);
  outline-offset: 1px;
}

.brutal-tabs__indicator {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 4px;
  background: var(--color-coral);
  transition: transform 220ms var(--ease), width 220ms var(--ease);
}
</style>
