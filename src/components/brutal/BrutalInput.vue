<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  modelValue: string | number
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea'
  placeholder?: string
  rows?: number
  disabled?: boolean
  required?: boolean
  error?: string
  success?: string
  maxLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  type: 'text',
  placeholder: '',
  rows: 4,
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

const inputId = useId()
const hasError = computed(() => !!props.error)
const hasSuccess = computed(() => !!props.success && !props.error)
const isTextarea = computed(() => props.type === 'textarea')
const length = computed(() => String(props.modelValue ?? '').length)
const hasCounter = computed(() => typeof props.maxLength === 'number' && isTextarea.value)

const onInput = (ev: Event) => {
  const target = ev.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <label class="brutal-input" :class="{ 'brutal-input--error': hasError, 'brutal-input--success': hasSuccess }" :for="inputId">
    <span class="brutal-input__field-wrap">
      <component
        :is="isTextarea ? 'textarea' : 'input'"
        :id="inputId"
        :value="modelValue"
        :type="isTextarea ? undefined : type"
        :rows="isTextarea ? rows : undefined"
        :placeholder="placeholder || ' '"
        :required="required"
        :disabled="disabled"
        :maxlength="maxLength"
        class="brutal-input__field"
        @input="onInput"
        @blur="emit('blur', $event)"
      />
      <span v-if="label" class="brutal-input__label">{{ label }}</span>
      <span class="brutal-input__icon">
        <slot name="icon" />
      </span>
    </span>

    <span v-if="hasError" class="brutal-input__helper brutal-input__helper--error">{{ error }}</span>
    <span v-else-if="hasSuccess" class="brutal-input__helper brutal-input__helper--success">{{ success }}</span>

    <span v-if="hasCounter" class="brutal-input__counter">
      {{ length }}/{{ maxLength }}
    </span>
  </label>
</template>

<style scoped>
.brutal-input {
  display: grid;
  gap: 0.36rem;
}

.brutal-input__field-wrap {
  position: relative;
}

.brutal-input__field {
  width: 100%;
  border: 3px solid var(--color-ink);
  background: var(--color-surface);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  padding: 1rem 0.9rem 0.55rem;
  transition: box-shadow var(--duration-fast) var(--ease), border-color var(--duration-fast) var(--ease), transform var(--duration-fast) var(--ease);
}

textarea.brutal-input__field {
  resize: vertical;
  min-height: 7.5rem;
}

.brutal-input__field:focus {
  outline: 0;
  box-shadow: 0 0 0 4px var(--color-yellow);
}

.brutal-input__field::placeholder {
  color: transparent;
}

.brutal-input__label {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  background: transparent;
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  pointer-events: none;
  transition: top var(--duration-fast) var(--ease), transform var(--duration-fast) var(--ease), font-size var(--duration-fast) var(--ease), background-color var(--duration-fast) var(--ease), padding var(--duration-fast) var(--ease);
}

.brutal-input__field:focus + .brutal-input__label,
.brutal-input__field:not(:placeholder-shown) + .brutal-input__label {
  top: 0;
  transform: translateY(-50%);
  font-size: var(--text-xs);
  padding: 0 0.3rem;
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

.brutal-input__icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.brutal-input--error .brutal-input__field {
  border-color: var(--color-coral);
  animation: brutal-shake 360ms ease-in-out;
}

.brutal-input--success .brutal-input__field {
  border-color: var(--color-turquoise);
}

.brutal-input__helper {
  font-size: var(--text-xs);
  font-weight: var(--font-weight-medium);
}

.brutal-input__helper--error {
  color: var(--color-coral);
}

.brutal-input__helper--success {
  color: #15846d;
}

.brutal-input__counter {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  text-align: right;
  font-family: var(--font-mono);
}

@keyframes brutal-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-8px);
  }
  75% {
    transform: translateX(8px);
  }
}
</style>
