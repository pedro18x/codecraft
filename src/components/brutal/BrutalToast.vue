<script setup lang="ts">
import { computed } from 'vue'
import type { ToastItem } from '../../composables/useToast'

interface Props {
  toast: ToastItem
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (event: 'close', id: number): void
  (event: 'pause', id: number): void
  (event: 'resume', id: number): void
}>()

const stripeClass = computed(() => `brutal-toast--${props.toast.type}`)
</script>

<template>
  <article
    class="brutal-toast"
    :class="stripeClass"
    role="status"
    aria-live="polite"
    @mouseenter="emit('pause', toast.id)"
    @mouseleave="emit('resume', toast.id)"
    @focusin="emit('pause', toast.id)"
    @focusout="emit('resume', toast.id)"
  >
    <div class="brutal-toast__content">
      <strong class="brutal-toast__title">{{ toast.title }}</strong>
      <p v-if="toast.message" class="brutal-toast__message">{{ toast.message }}</p>
    </div>

    <button type="button" class="brutal-toast__close" aria-label="Dismiss notification" @click="emit('close', toast.id)">
      ×
    </button>

    <span
      class="brutal-toast__progress"
      :style="{ animationDuration: `${toast.duration}ms` }"
      aria-hidden="true"
    />
  </article>
</template>

<style scoped>
.brutal-toast {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  width: min(22rem, calc(100vw - 2rem));
  background: var(--color-surface);
  border: 3px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  border-left-width: 10px;
  box-shadow: 3px 3px 0 0 var(--color-shadow-strong);
  padding: 0.7rem 0.8rem 0.95rem;
  overflow: hidden;
}

.brutal-toast--success {
  border-left-color: var(--color-turquoise);
}

.brutal-toast--error {
  border-left-color: var(--color-coral);
}

.brutal-toast--warning {
  border-left-color: var(--color-yellow);
}

.brutal-toast--info {
  border-left-color: #6c8eff;
}

.brutal-toast__title {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  letter-spacing: 0.01em;
}

.brutal-toast__message {
  margin: 0.25rem 0 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.brutal-toast__close {
  width: 1.8rem;
  height: 1.8rem;
  border: 2px solid var(--color-border-strong);
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
}

.brutal-toast__close:focus-visible {
  outline: 3px solid var(--color-yellow);
  outline-offset: 2px;
}

.brutal-toast__progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: var(--color-border-strong);
  transform-origin: left;
  animation-name: brutal-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.brutal-toast:hover .brutal-toast__progress,
.brutal-toast:focus-within .brutal-toast__progress {
  animation-play-state: paused;
}

@keyframes brutal-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}
</style>
