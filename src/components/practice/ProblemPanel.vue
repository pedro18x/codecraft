<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Problem } from '../../types'
import Text from '../../design-system/components/Text.vue'
import BrutalBadge from '../brutal/BrutalBadge.vue'

interface Props {
  problem: Problem
}

const props = defineProps<Props>()

const showHints = ref(false)
const revealedHints = ref(0)

watch(() => props.problem.id, () => {
  showHints.value = false
  revealedHints.value = 0
})

const revealNextHint = () => {
  if (props.problem.hints && revealedHints.value < props.problem.hints.length) {
    revealedHints.value++
  }
}
</script>

<template>
  <div class="problem-panel">
    <div class="problem-panel__content">
      <!-- Header -->
      <div class="problem-panel__header">
        <div class="problem-panel__meta">
          <BrutalBadge
            variant="difficulty"
            :tone="problem.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'"
            :label="problem.difficulty"
          />
          <div class="problem-panel__categories">
            <span
              v-for="cat in problem.categories"
              :key="cat"
              class="category-pill"
            >
              {{ cat }}
            </span>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="problem-panel__section">
        <Text as="div" variant="body" class="problem-panel__description">
          {{ problem.description }}
        </Text>
      </div>

      <div class="section-divider" />

      <!-- Examples -->
      <div class="problem-panel__section">
        <Text as="h2" variant="h4" weight="bold" class="section-heading">
          Examples
        </Text>
        <div class="examples">
          <div
            v-for="(example, index) in problem.examples"
            :key="index"
            class="example-block"
          >
            <div class="example-block__label">
              <Text variant="caption" weight="bold">EXAMPLE {{ index + 1 }}</Text>
            </div>
            <div class="example-block__content">
              <div class="example-line">
                <Text variant="body-sm" weight="semibold">Input:</Text>
                <Text variant="body-sm" mono>{{ example.input }}</Text>
              </div>
              <div class="example-line">
                <Text variant="body-sm" weight="semibold">Output:</Text>
                <Text variant="body-sm" mono>{{ example.output }}</Text>
              </div>
              <div v-if="example.explanation" class="example-line example-line--explain">
                <Text variant="body-sm" class="example-explanation">{{ example.explanation }}</Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-divider" />

      <!-- Constraints -->
      <div class="problem-panel__section">
        <Text as="h2" variant="h4" weight="bold" class="section-heading">
          Constraints
        </Text>
        <ul class="constraints-list">
          <li v-for="(constraint, index) in problem.constraints" :key="index">
            <Text variant="body-sm" mono>{{ constraint }}</Text>
          </li>
        </ul>
      </div>

      <!-- Hints -->
      <template v-if="problem.hints && problem.hints.length > 0">
        <div class="section-divider" />
        <div class="problem-panel__section">
          <button class="hints-toggle" @click="showHints = !showHints; if (showHints && revealedHints === 0) revealedHints = 1">
            <Text as="h2" variant="h4" weight="bold" class="section-heading">
              Hints ({{ problem.hints.length }})
            </Text>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              :class="{ 'hints-icon--open': showHints }"
              class="hints-icon"
            >
              <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <div v-if="showHints" class="hints-list">
            <div
              v-for="(hint, index) in problem.hints.slice(0, revealedHints)"
              :key="index"
              class="hint-item"
            >
              <span class="hint-number">{{ index + 1 }}</span>
              <Text variant="body-sm">{{ hint }}</Text>
            </div>

            <button
              v-if="revealedHints < problem.hints.length"
              class="hints-reveal-btn"
              @click="revealNextHint"
            >
              Show hint {{ revealedHints + 1 }} of {{ problem.hints.length }}
            </button>

            <Text v-if="revealedHints === 0" variant="muted" class="hints-collapsed">
              Click below to reveal hints one at a time
            </Text>
          </div>

          <Text v-else variant="muted" class="hints-collapsed">
            Click to reveal hints
          </Text>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.problem-panel {
  height: 100%;
  overflow-y: auto;
  background-color: var(--color-background);
}

.problem-panel__content {
  max-width: min(72rem, 100%);
  margin: 0;
  padding: var(--space-6) clamp(var(--space-4), 2vw, var(--space-8));
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* ── Header ── */
.problem-panel__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.problem-panel__meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.problem-panel__categories {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.category-pill {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  padding: var(--space-1) var(--space-3);
  border: var(--border-thin) solid var(--color-border-strong);
  box-shadow: 1px 1px 0 0 var(--color-shadow-strong);
  color: var(--color-text-secondary);
  background: var(--color-surface-raised);
  transition: transform var(--duration-fast) var(--ease);
}

.category-pill:hover {
  transform: translate(-1px, -1px);
}

/* ── Section ── */
.problem-panel__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.section-heading {
  color: var(--color-text-primary);
}

.section-divider {
  height: var(--border-thin);
  background-color: var(--color-border-subtle);
}

.problem-panel__description {
  line-height: var(--line-height-relaxed);
  white-space: pre-line;
  color: var(--color-text-secondary);
}

/* ── Examples ── */
.examples {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.example-block {
  border: var(--border-thin) solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.example-block__label {
  padding: var(--space-2) var(--space-4);
  background-color: var(--color-accent-ink);
  color: var(--color-white);
  letter-spacing: 0.06em;
}

.example-block__content {
  padding: var(--space-4);
  background-color: var(--color-surface);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.example-line {
  display: flex;
  gap: var(--space-3);
  align-items: baseline;
}

.example-line--explain {
  margin-top: var(--space-2);
  padding-top: var(--space-2);
  border-top: 1px solid var(--color-border-subtle);
}

.example-explanation {
  color: var(--color-text-tertiary);
  font-style: italic;
}

/* ── Constraints ── */
.constraints-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.constraints-list li {
  padding-left: var(--space-5);
  position: relative;
}

.constraints-list li::before {
  content: '';
  position: absolute;
  left: var(--space-2);
  top: 0.6em;
  width: 6px;
  height: 6px;
  background-color: var(--color-success);
  border: 1px solid var(--color-border-strong);
}

/* ── Hints ── */
.hints-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}

.hints-toggle:hover .section-heading {
  color: var(--color-primary);
}

.hints-toggle:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
}

.hints-icon {
  color: var(--color-text-secondary);
  transition: transform var(--duration-normal) var(--ease);
}

.hints-icon--open {
  transform: rotate(180deg);
}

.hints-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.hint-item {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-warning-bg);
  border: 1px solid var(--color-warning);
}

.hint-number {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-warning);
  border: 1px solid var(--color-border-strong);
  color: var(--color-accent-ink);
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  font-size: var(--text-xs);
}

.hints-reveal-btn {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  font-size: var(--text-sm);
  background: var(--color-warning);
  color: var(--color-accent-ink);
  border: var(--border-thin) solid var(--color-border-strong);
  box-shadow: 2px 2px 0 0 var(--color-shadow-strong);
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease),
              box-shadow var(--duration-fast) var(--ease);
}

.hints-reveal-btn:hover {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 0 var(--color-shadow-strong);
}

.hints-reveal-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.hints-collapsed {
  font-style: italic;
}
</style>
