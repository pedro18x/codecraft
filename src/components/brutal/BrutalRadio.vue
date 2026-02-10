<script setup lang="ts">
import BrutalCheckbox from './BrutalCheckbox.vue'

interface Props {
  modelValue: string | number | null
  value: string | number
  label?: string
  name?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  label: '',
  name: '',
  disabled: false,
})

const emit = defineEmits<{ (event: 'update:modelValue', value: string | number | null): void }>()
</script>

<template>
  <BrutalCheckbox
    :model-value="modelValue"
    type="radio"
    :value="value"
    :label="label"
    :name="name"
    :disabled="disabled"
    @update:model-value="(v) => emit('update:modelValue', typeof v === 'boolean' ? null : v)"
  />
</template>
