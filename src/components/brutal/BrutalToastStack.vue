<script setup lang="ts">
import BrutalToast from './BrutalToast.vue'
import { useToast } from '../../composables/useToast'

const { toasts, remove } = useToast()
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
        />
      </TransitionGroup>
    </section>
  </Teleport>
</template>

<style scoped>
.brutal-toast-stack {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 90;
  display: grid;
  gap: 0.65rem;
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
