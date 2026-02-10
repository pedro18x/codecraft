<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  modelValue: boolean | string | number | null
  label?: string
  type?: 'checkbox' | 'radio'
  value?: string | number
  name?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  type: 'checkbox',
  value: 'on',
  name: '',
  disabled: false,
})

const emit = defineEmits<{ (event: 'update:modelValue', value: boolean | string | number | null): void }>()
const inputId = useId()

const checked = computed(() => {
  if (props.type === 'radio') return props.modelValue === props.value
  return Boolean(props.modelValue)
})

const onChange = () => {
  if (props.type === 'radio') {
    emit('update:modelValue', props.value)
    return
  }

  emit('update:modelValue', !checked.value)
}
</script>

<template>
  <label class="brutal-check" :class="{ 'brutal-check--disabled': disabled }" :for="inputId">
    <input
      :id="inputId"
      class="brutal-check__native"
      :type="type"
      :name="name"
      :checked="checked"
      :disabled="disabled"
      @change="onChange"
    >
    <span class="brutal-check__control" :class="[`brutal-check__control--${type}`, { 'brutal-check__control--checked': checked }]">
      <svg v-if="type === 'checkbox'" viewBox="0 0 16 16" class="brutal-check__icon">
        <path d="M3 8L6.5 11.5L13 5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span v-else class="brutal-check__dot" />
    </span>

    <span v-if="label" class="brutal-check__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.brutal-check {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  cursor: pointer;
}

.brutal-check__native {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.brutal-check__control {
  width: 1.3rem;
  height: 1.3rem;
  border: 3px solid var(--color-ink);
  background: var(--color-surface);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: scale(1);
  transition: transform var(--duration-fast) var(--ease), border-width var(--duration-fast) var(--ease), background-color var(--duration-fast) var(--ease);
}

.brutal-check__control--radio {
  border-radius: 999px;
}

.brutal-check__icon {
  width: 0.95rem;
  height: 0.95rem;
  color: var(--color-ink);
  opacity: 0;
  transform: scale(0.7);
  transition: opacity var(--duration-fast) var(--ease), transform var(--duration-fast) var(--ease);
}

.brutal-check__dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--color-ink);
  opacity: 0;
  transform: scale(0.6);
  transition: opacity var(--duration-fast) var(--ease), transform var(--duration-fast) var(--ease);
}

.brutal-check__control--checked {
  border-width: 4px;
  background: var(--color-yellow);
}

.brutal-check__control--checked .brutal-check__icon,
.brutal-check__control--checked .brutal-check__dot {
  opacity: 1;
  transform: scale(1);
}

.brutal-check__label {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
}

.brutal-check__native:focus-visible + .brutal-check__control {
  outline: 4px solid var(--color-yellow);
  outline-offset: 2px;
}

.brutal-check--disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
