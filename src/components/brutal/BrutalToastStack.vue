<script setup lang="ts">
import BrutalToast from './BrutalToast.vue'
import { useToast } from '../../composables/useToast'

const { toasts, remove, pause, resume } = useToast()
</script>

<template>
  <Teleport to="body">
    <section class="brutal-toast-stack" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="toast-slide">
        <BrutalToast
          v-for="toast in toasts"
          :key="toast.id"
          :toast="toast"
          @close="remove"
          @pause="pause"
          @resume="resume"
        />
      </TransitionGroup>
    </section>
  </Teleport>
</template>

<style scoped>
.brutal-toast-stack {
  position: fixed;
  top: calc(5.5rem);
  right: 1rem;
  z-index: 90;
  display: grid;
  gap: 0.65rem;
  max-width: min(24rem, calc(100vw - 2rem));
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: transform var(--duration-normal) var(--ease), opacity var(--duration-normal) var(--ease);
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  transform: translateY(-16px);
  opacity: 0;
}
</style>
