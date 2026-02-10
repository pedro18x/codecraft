<script setup lang="ts">
import { computed } from 'vue'

interface StepItem {
  label: string
}

interface Props {
  variant?: 'bar' | 'circular' | 'steps'
  value?: number
  max?: number
  indeterminate?: boolean
  steps?: StepItem[]
  currentStep?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'bar',
  value: 0,
  max: 100,
  indeterminate: false,
  steps: () => [],
  currentStep: 0,
})

const percentage = computed(() => {
  if (!props.max) return 0
  return Math.max(0, Math.min(100, Math.round((props.value / props.max) * 100)))
})

const radius = 32
const circumference = 2 * Math.PI * radius
const dashOffset = computed(() => circumference - (percentage.value / 100) * circumference)
</script>

<template>
  <div class="brutal-progress">
    <div v-if="variant === 'bar'" class="brutal-progress__bar">
      <div
        class="brutal-progress__fill"
        :class="{ 'brutal-progress__fill--indeterminate': indeterminate }"
        :style="indeterminate ? undefined : { width: `${percentage}%` }"
      />
    </div>

    <div v-else-if="variant === 'circular'" class="brutal-progress__circular">
      <svg viewBox="0 0 80 80" class="brutal-progress__ring" aria-hidden="true">
        <circle cx="40" cy="40" :r="radius" class="brutal-progress__ring-bg" />
        <circle
          cx="40"
          cy="40"
          :r="radius"
          class="brutal-progress__ring-fill"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
        />
      </svg>
      <span class="brutal-progress__value">{{ percentage }}%</span>
    </div>

    <ol v-else class="brutal-progress__steps">
      <li
        v-for="(step, index) in steps"
        :key="step.label"
        class="brutal-progress__step"
        :class="{
          'brutal-progress__step--done': index < currentStep,
          'brutal-progress__step--active': index === currentStep,
        }"
      >
        <span class="brutal-progress__step-index">{{ index + 1 }}</span>
        <span class="brutal-progress__step-label">{{ step.label }}</span>
      </li>
    </ol>

    <span v-if="variant !== 'steps'" class="brutal-progress__text">{{ percentage }}%</span>
  </div>
</template>

<style scoped>
.brutal-progress {
  display: grid;
  gap: 0.5rem;
}

.brutal-progress__bar {
  height: 0.8rem;
  border: 3px solid var(--color-border-strong);
  background: var(--color-surface);
  overflow: hidden;
}

.brutal-progress__fill {
  height: 100%;
  width: 0;
  background: repeating-linear-gradient(
    -45deg,
    var(--color-success),
    var(--color-success) 9px,
    var(--color-success-bg) 9px,
    var(--color-success-bg) 18px
  );
  transition: width 260ms var(--ease);
}

.brutal-progress__fill--indeterminate {
  width: 45%;
  animation: brutal-loading 1s linear infinite;
}

.brutal-progress__text {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.brutal-progress__circular {
  position: relative;
  width: 5rem;
  height: 5rem;
  display: grid;
  place-items: center;
}

.brutal-progress__ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.brutal-progress__ring-bg,
.brutal-progress__ring-fill {
  fill: none;
  stroke-width: 8;
}

.brutal-progress__ring-bg {
  stroke: var(--color-border-subtle);
}

.brutal-progress__ring-fill {
  stroke: var(--color-primary);
  transition: stroke-dashoffset 260ms var(--ease);
}

.brutal-progress__value {
  position: absolute;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-bold);
}

.brutal-progress__steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.brutal-progress__step {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 3px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  padding: 0.35rem 0.45rem;
  font-size: var(--text-xs);
}

.brutal-progress__step-index {
  width: 1.1rem;
  height: 1.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-border-strong);
  background: var(--color-background);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-display);
}

.brutal-progress__step--done {
  background: var(--color-success);
  color: var(--color-accent-ink);
}

.brutal-progress__step--active {
  background: var(--color-warning);
  color: var(--color-accent-ink);
}

.brutal-progress__step-label {
  font-family: var(--font-body);
  font-weight: var(--font-weight-semibold);
}

@keyframes brutal-loading {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(320%);
  }
}
</style>
