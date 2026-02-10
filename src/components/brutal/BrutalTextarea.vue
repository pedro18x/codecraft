<script setup lang="ts">
import BrutalInput from './BrutalInput.vue'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  rows?: number
  disabled?: boolean
  required?: boolean
  error?: string
  success?: string
  maxLength?: number
}

withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  rows: 5,
  disabled: false,
  required: false,
  error: '',
  success: '',
  maxLength: undefined,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'blur', ev: FocusEvent): void
}>()
</script>

<template>
  <BrutalInput
    :model-value="modelValue"
    type="textarea"
    :label="label"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    :required="required"
    :error="error"
    :success="success"
    :max-length="maxLength"
    @update:model-value="(value) => emit('update:modelValue', String(value))"
    @blur="(ev) => emit('blur', ev)"
  >
    <template #icon>
      <slot name="icon" />
    </template>
  </BrutalInput>
</template>
