<script setup lang="ts">
import { computed } from 'vue'
import type { Language, TestResult } from '../../types'
import Text from '../../design-system/components/Text.vue'
import MonacoEditorLazy from './MonacoEditorLazy.vue'

interface Props {
  code: string
  language: Language
  testResults: TestResult[]
  isRunning: boolean
}

interface Emits {
  (e: 'update:code', value: string): void
  (e: 'update:language', value: Language): void
  (e: 'run'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const languages: Language[] = ['javascript', 'typescript', 'python']

const localCode = computed({
  get: () => props.code,
  set: (value) => emit('update:code', value),
})

const localLanguage = computed({
  get: () => props.language,
  set: (value) => emit('update:language', value),
})

const hasResults = computed(() => props.testResults.length > 0)
const passedCount = computed(() => props.testResults.filter(r => r.passed).length)
const allPassed = computed(() => hasResults.value && passedCount.value === props.testResults.length)
</script>

<template>
  <div class="editor-panel">
    <!-- Toolbar -->
    <div class="editor-toolbar">
      <div class="editor-toolbar__tabs">
        <button
          v-for="lang in languages"
          :key="lang"
          :class="['lang-tab', { 'lang-tab--active': localLanguage === lang }]"
          @click="localLanguage = lang"
        >
          {{ lang }}
        </button>
      </div>

      <button
        class="run-btn"
        :class="{ 'run-btn--running': isRunning }"
        @click="emit('run')"
        :disabled="isRunning"
      >
        <svg v-if="!isRunning" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 1L12 7L3 13V1Z" fill="currentColor"/>
        </svg>
        <span v-else class="run-btn__spinner" />
        {{ isRunning ? 'Running...' : 'Run' }}
        <span class="run-btn__shortcut">&#8984;&#x23CE;</span>
      </button>
    </div>

    <!-- Code Editor -->
    <div class="editor-area">
      <MonacoEditorLazy
        v-model="localCode"
        :language="localLanguage"
      />
    </div>

    <!-- Test Results -->
    <div v-if="hasResults" class="results-panel" :class="{ 'results-panel--passed': allPassed }">
      <div class="results-header">
        <div class="results-header__status">
          <span v-if="allPassed" class="results-icon results-icon--pass">&#10003;</span>
          <span v-else class="results-icon results-icon--fail">&#10007;</span>
          <Text variant="body" weight="bold">
            {{ allPassed ? 'All tests passed' : `${passedCount}/${testResults.length} passed` }}
          </Text>
        </div>
      </div>

      <div class="results-list">
        <div
          v-for="(result, index) in testResults"
          :key="index"
          :class="['result-card', result.passed ? 'result-card--passed' : 'result-card--failed']"
        >
          <div class="result-card__header">
            <Text variant="body-sm" weight="bold">
              Test {{ index + 1 }}
            </Text>
            <span :class="['result-badge', result.passed ? 'result-badge--passed' : 'result-badge--failed']">
              {{ result.passed ? 'PASS' : 'FAIL' }}
            </span>
          </div>

          <div class="result-card__body">
            <div class="result-row">
              <Text variant="caption" weight="semibold" class="result-label">Input</Text>
              <Text variant="body-sm" mono class="result-value">{{ result.input }}</Text>
            </div>
            <div class="result-row">
              <Text variant="caption" weight="semibold" class="result-label">Expected</Text>
              <Text variant="body-sm" mono class="result-value">{{ result.expectedOutput }}</Text>
            </div>
            <div v-if="!result.passed && result.actualOutput" class="result-row">
              <Text variant="caption" weight="semibold" class="result-label result-label--error">Actual</Text>
              <Text variant="body-sm" mono class="result-value result-value--error">{{ result.actualOutput }}</Text>
            </div>
            <div v-if="result.error" class="result-row">
              <Text variant="caption" weight="semibold" class="result-label result-label--error">Error</Text>
              <Text variant="body-sm" mono class="result-value result-value--error">{{ result.error }}</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
}

/* ── Toolbar ── */
.editor-toolbar {
  height: 3rem;
  padding: 0 var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  border-bottom: var(--border-width) solid var(--color-border-strong);
  background-color: var(--color-background);
  flex-shrink: 0;
}

.editor-toolbar__tabs {
  display: flex;
}

.lang-tab {
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease),
              border-color var(--duration-fast) var(--ease);
  text-transform: capitalize;
}

.lang-tab:hover {
  color: var(--color-text-primary);
}

.lang-tab--active {
  color: var(--color-text-primary);
  border-bottom-color: var(--color-primary);
}

.lang-tab:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: -2px;
}

/* ── Run Button ── */
.run-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  height: 2.25rem;
  padding: 0 var(--space-4);
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  font-size: var(--text-sm);
  background-color: var(--button-secondary-bg);
  color: var(--button-secondary-text);
  border: var(--border-thin) solid var(--button-border);
  box-shadow: 2px 2px 0 0 var(--button-shadow);
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease),
              box-shadow var(--duration-fast) var(--ease),
              background-color var(--duration-fast) var(--ease);
}

.run-btn:hover:not(:disabled) {
  background-color: var(--button-secondary-hover);
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 0 var(--button-shadow);
}

.run-btn:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.run-btn:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
}

.run-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.run-btn--running {
  background-color: var(--color-warning);
  color: var(--color-accent-ink);
}

.run-btn__shortcut {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: currentColor;
  opacity: 0.5;
  margin-left: var(--space-1);
}

.run-btn__spinner {
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Editor Area ── */
.editor-area {
  flex: 1;
  overflow: auto;
  background-color: var(--color-surface);
}

/* ── Results Panel ── */
.results-panel {
  border-top: var(--border-width) solid var(--color-border-strong);
  background-color: var(--color-background);
  max-height: 40%;
  overflow-y: auto;
  flex-shrink: 0;
}

.results-header {
  padding: var(--space-3) var(--space-5);
  border-bottom: var(--border-thin) solid var(--color-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.results-header__status {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.results-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  font-weight: bold;
  font-size: var(--text-sm);
  border: var(--border-thin) solid var(--color-border-strong);
}

.results-icon--pass {
  background-color: var(--color-success);
  color: var(--color-accent-ink);
}

.results-icon--fail {
  background-color: var(--color-error);
  color: var(--color-on-danger);
}

.results-list {
  display: flex;
  flex-direction: column;
}

.result-card {
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border-subtle);
}

.result-card:last-child {
  border-bottom: none;
}

.result-card--passed {
  border-left: 4px solid var(--color-success);
}

.result-card--failed {
  border-left: 4px solid var(--color-error);
}

.result-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.result-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.result-row {
  display: flex;
  gap: var(--space-3);
  align-items: baseline;
}

.result-label {
  min-width: 60px;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.result-label--error {
  color: var(--color-error);
}

.result-value {
  color: var(--color-text-primary);
}

.result-value--error {
  color: var(--color-error);
}

.result-badge {
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  font-size: 0.625rem;
  letter-spacing: 0.06em;
  padding: 2px var(--space-2);
  border: 1px solid var(--color-border-strong);
}

.result-badge--passed {
  background-color: var(--color-success);
  color: var(--color-accent-ink);
}

.result-badge--failed {
  background-color: var(--color-error);
  color: var(--color-on-danger);
}
</style>
