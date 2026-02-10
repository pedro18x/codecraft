<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface DropdownOption {
  label: string
  value: string
  disabled?: boolean
}

interface Props {
  modelValue?: string
  options: DropdownOption[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Select...',
})

const emit = defineEmits<{ (event: 'update:modelValue', value: string): void }>()

const open = ref(false)
const highlightedIndex = ref(0)
const rootRef = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => {
  const selected = props.options.find(option => option.value === props.modelValue)
  return selected?.label ?? props.placeholder
})

const close = () => {
  open.value = false
}

const toggle = () => {
  open.value = !open.value
}

const select = (value: string) => {
  emit('update:modelValue', value)
  close()
}

const onOutsideClick = (event: MouseEvent) => {
  const target = event.target as Node | null
  if (!target || !rootRef.value) return
  if (!rootRef.value.contains(target)) close()
}

const onTriggerKeydown = (event: KeyboardEvent) => {
  if (!open.value && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    open.value = true
    highlightedIndex.value = Math.max(0, props.options.findIndex(option => option.value === props.modelValue))
    return
  }

  if (!open.value) return

  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    highlightedIndex.value = Math.min(props.options.length - 1, highlightedIndex.value + 1)
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    highlightedIndex.value = Math.max(0, highlightedIndex.value - 1)
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    const option = props.options[highlightedIndex.value]
    if (option && !option.disabled) select(option.value)
  }
}

onMounted(() => {
  window.addEventListener('click', onOutsideClick)
})

onUnmounted(() => {
  window.removeEventListener('click', onOutsideClick)
})
</script>

<template>
  <div ref="rootRef" class="brutal-dropdown">
    <button
      type="button"
      class="brutal-dropdown__trigger"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <span class="brutal-dropdown__label">{{ selectedLabel }}</span>
      <span class="brutal-dropdown__chevron" :class="{ 'brutal-dropdown__chevron--open': open }">⌄</span>
    </button>

    <Transition name="brutal-dropdown-fade">
      <ul v-if="open" class="brutal-dropdown__panel" role="listbox">
        <li v-for="(option, index) in options" :key="option.value" role="option" :aria-selected="modelValue === option.value">
          <button
            type="button"
            class="brutal-dropdown__option"
            :class="{
              'brutal-dropdown__option--active': modelValue === option.value,
              'brutal-dropdown__option--highlighted': highlightedIndex === index,
            }"
            :disabled="option.disabled"
            @mouseenter="highlightedIndex = index"
            @click="select(option.value)"
          >
            {{ option.label }}
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.brutal-dropdown {
  position: relative;
  min-width: 12rem;
}

.brutal-dropdown__trigger {
  width: 100%;
  border: 3px solid var(--color-ink);
  background: var(--color-surface);
  box-shadow: 3px 3px 0 0 var(--color-ink);
  min-height: 2.6rem;
  padding: 0.45rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  cursor: pointer;
}

.brutal-dropdown__trigger:focus-visible {
  outline: 4px solid var(--color-yellow);
  outline-offset: 2px;
}

.brutal-dropdown__label {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
}

.brutal-dropdown__chevron {
  font-size: 1rem;
  transition: transform var(--duration-fast) var(--ease);
}

.brutal-dropdown__chevron--open {
  transform: rotate(180deg);
}

.brutal-dropdown__panel {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0.35rem;
  border: 3px solid var(--color-ink);
  background: var(--color-surface);
  box-shadow: 4px 4px 0 0 var(--color-ink);
  z-index: 20;
}

.brutal-dropdown__option {
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  padding: 0.45rem 0.5rem;
  font-size: var(--text-sm);
  cursor: pointer;
}

.brutal-dropdown__option--highlighted {
  background: var(--color-background);
}

.brutal-dropdown__option--active {
  background: var(--color-yellow);
  font-weight: var(--font-weight-bold);
}

.brutal-dropdown__option:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.brutal-dropdown-fade-enter-active,
.brutal-dropdown-fade-leave-active {
  transition: opacity var(--duration-fast) var(--ease), transform var(--duration-fast) var(--ease);
}

.brutal-dropdown-fade-enter-from,
.brutal-dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
