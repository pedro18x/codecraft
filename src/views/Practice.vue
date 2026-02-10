<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { problems } from '../data/problems'
import type { Language, TestResult } from '../types'
import { useCodeStorage } from '../composables/useCodeStorage'
import { useProblemProgress } from '../composables/useProblemProgress'
import { useAuth } from '../composables/useAuth'
import { api } from '../api/client'
import { getProblemSlug } from '../utils/problemUtils'
import { useToast } from '../composables/useToast'
import { useBreakpoints } from '../composables/useBreakpoints'
import ProblemPanel from '../components/practice/ProblemPanel.vue'
import EditorPanel from '../components/practice/EditorPanel.vue'
import Text from '../design-system/components/Text.vue'
import Button from '../design-system/components/Button.vue'

const route = useRoute()
const router = useRouter()
const { isDesktop } = useBreakpoints()

// Find problem from slug
const problem = computed(() => {
  const slug = route.params.slug as string
  return problems.find(p => getProblemSlug(p) === slug)
})

// Problem navigation
const currentProblemIndex = computed(() => {
  return problem.value ? problems.findIndex(p => p.id === problem.value!.id) : -1
})

const hasPrevious = computed(() => currentProblemIndex.value > 0)
const hasNext = computed(() => currentProblemIndex.value < problems.length - 1)

const goToPrevious = () => {
  if (hasPrevious.value) {
    const prevProblem = problems[currentProblemIndex.value - 1]
    router.push(`/practice/${getProblemSlug(prevProblem)}`)
  }
}

const goToNext = () => {
  if (hasNext.value) {
    const nextProblem = problems[currentProblemIndex.value + 1]
    router.push(`/practice/${getProblemSlug(nextProblem)}`)
  }
}

// UI State
const focusMode = ref(false)
const splitPosition = ref(50)
const isDragging = ref(false)
const showShortcuts = ref(false)

// Editor State
const selectedLanguage = ref<Language>('typescript')
const testResults = ref<TestResult[]>([])
const isRunning = ref(false)

// Auth state
const { isAuthenticated } = useAuth()
const { success, error: toastError, info } = useToast()

// Progress tracking
const { markAttempted, markCompleted } = useProblemProgress()

// Code storage with persistence
const codeStorage = computed(() => {
  if (!problem.value) return null
  return useCodeStorage(
    problem.value.id,
    selectedLanguage.value,
    problem.value.starterCode[selectedLanguage.value] || ''
  )
})

const userCode = computed({
  get: () => codeStorage.value?.code.value || '',
  set: (value) => {
    if (codeStorage.value) {
      codeStorage.value.code.value = value
    }
  },
})

// Mark problem as attempted when opening
watch(
  problem,
  (newProblem) => {
    if (newProblem) {
      markAttempted(newProblem.id)
      testResults.value = []
      focusMode.value = false
    }
  },
  { immediate: true }
)

// Reset code to starter
const resetCode = () => {
  if (codeStorage.value && confirm('Reset code to starter template? This cannot be undone.')) {
    codeStorage.value.resetCode()
    testResults.value = []
  }
}

// Split pane dragging
const handleMouseDown = () => {
  if (!isDesktop.value) return
  isDragging.value = true
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDesktop.value) return
  if (!isDragging.value) return
  const container = document.querySelector('.practice__content')
  if (!container) return

  const rect = container.getBoundingClientRect()
  const percentage = ((e.clientX - rect.left) / rect.width) * 100
  splitPosition.value = Math.max(30, Math.min(70, percentage))
}

const handleMouseUp = () => {
  isDragging.value = false
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})

watch(isDesktop, (desktop) => {
  if (!desktop) {
    isDragging.value = false
  }
})

// Keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  // Cmd/Ctrl + B: Toggle focus mode
  if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
    e.preventDefault()
    focusMode.value = !focusMode.value
  }

  // Cmd/Ctrl + Enter: Run tests
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault()
    runTests()
  }

  // Escape: Exit focus mode
  if (e.key === 'Escape' && focusMode.value) {
    focusMode.value = false
  }

  // Cmd/Ctrl + /: Show shortcuts
  if ((e.metaKey || e.ctrlKey) && e.key === '/') {
    e.preventDefault()
    showShortcuts.value = !showShortcuts.value
  }

  // Cmd/Ctrl + R: Reset code
  if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
    e.preventDefault()
    resetCode()
  }

  // Cmd/Ctrl + [: Previous problem
  if ((e.metaKey || e.ctrlKey) && e.key === '[') {
    e.preventDefault()
    goToPrevious()
  }

  // Cmd/Ctrl + ]: Next problem
  if ((e.metaKey || e.ctrlKey) && e.key === ']') {
    e.preventDefault()
    goToNext()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Run tests - uses backend API when authenticated, mock fallback otherwise
const runTests = async () => {
  if (!problem.value) return

  isRunning.value = true
  testResults.value = []

  if (isAuthenticated.value) {
    try {
      const result = await api.post<{
        success: boolean
        testResults: TestResult[]
        executionTimeMs: number
      }>('/submissions', {
        problemId: problem.value.id,
        language: selectedLanguage.value,
        code: userCode.value,
      })

      testResults.value = result.testResults

      if (result.success && problem.value) {
        markCompleted(problem.value.id)
        success('All tests passed', `Problem #${problem.value.id} marked as solved.`)
      } else {
        info('Tests finished', `${result.testResults.filter(item => item.passed).length}/${result.testResults.length} passed.`)
      }
    } catch (err) {
      // Show error as a failed test result
      testResults.value = problem.value.testCases.map((testCase) => ({
        passed: false,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        error: err instanceof Error ? err.message : 'Execution failed',
      }))
      toastError('Execution failed', err instanceof Error ? err.message : 'Execution failed')
    }
  } else {
    // Guest execution — real code execution without persistence
    try {
      const result = await api.post<{
        success: boolean
        testResults: TestResult[]
        executionTimeMs: number
      }>('/execute', {
        problemId: problem.value.id,
        language: selectedLanguage.value,
        code: userCode.value,
      })

      testResults.value = result.testResults

      if (result.success && problem.value) {
        markCompleted(problem.value.id)
        success('All tests passed', `Problem #${problem.value.id} marked as solved.`)
      } else {
        info('Tests finished', `${result.testResults.filter(item => item.passed).length}/${result.testResults.length} passed.`)
      }
    } catch (err) {
      testResults.value = problem.value.testCases.map((testCase) => ({
        passed: false,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        error: err instanceof Error ? err.message : 'Execution failed',
      }))
      toastError('Execution failed', err instanceof Error ? err.message : 'Execution failed')
    }
  }

  isRunning.value = false
}

const goBack = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div v-if="!problem" class="practice__not-found">
    <div class="not-found-content">
      <Text as="h1" variant="h2" weight="semibold">Problem not found</Text>
      <Button variant="ghost" @click="goBack">Back to dashboard</Button>
    </div>
  </div>

  <div v-else class="practice" :class="{ 'practice--focus': focusMode }">
    <!-- Header (hidden in focus mode) -->
    <header v-show="!focusMode" class="practice__header">
      <div class="practice__header-content">
        <button class="practice__back" @click="goBack" aria-label="Back to dashboard">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <Text as="h1" variant="body" weight="medium" class="practice__title">
          #{{ problem.id }} {{ problem.title }}
        </Text>

        <div class="practice__actions">
          <!-- Problem Navigation -->
          <div class="practice__nav">
            <button
              class="practice__nav-btn"
              @click="goToPrevious"
              :disabled="!hasPrevious"
              aria-label="Previous problem"
              title="Previous problem (⌘[)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button
              class="practice__nav-btn"
              @click="goToNext"
              :disabled="!hasNext"
              aria-label="Next problem"
              title="Next problem (⌘])"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <!-- Reset Code -->
          <button
            class="practice__action-btn"
            @click="resetCode"
            title="Reset code (⌘R)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8C2 4.686 4.686 2 8 2C11.314 2 14 4.686 14 8C14 11.314 11.314 14 8 14C6.344 14 4.844 13.266 3.781 12.094M8 4V8L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <Text variant="body-sm">Reset</Text>
          </button>

          <!-- Shortcuts Help -->
          <button
            class="practice__action-btn"
            @click="showShortcuts = !showShortcuts"
            :title="showShortcuts ? 'Hide shortcuts' : 'Show shortcuts (⌘/)'"
          >
            <Text variant="body-sm">{{ showShortcuts ? '✕' : '?' }}</Text>
          </button>

          <!-- Focus Mode -->
          <button
            class="practice__focus-toggle"
            @click="focusMode = !focusMode"
            :title="focusMode ? 'Exit focus (Esc)' : 'Focus mode (⌘B)'"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="12" height="12" stroke="currentColor" stroke-width="1.5" rx="1"/>
              <path v-if="!focusMode" d="M2 6H14M6 2V14" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <Text variant="body-sm">{{ focusMode ? 'Exit' : 'Focus' }}</Text>
          </button>
        </div>
      </div>
    </header>

    <!-- Keyboard Shortcuts Overlay -->
    <div v-if="showShortcuts" class="shortcuts-overlay" @click="showShortcuts = false">
      <div class="shortcuts-panel" @click.stop>
        <div class="shortcuts-header">
          <Text as="h2" variant="h4" weight="semibold">Keyboard Shortcuts</Text>
          <button class="shortcuts-close" @click="showShortcuts = false" aria-label="Close">
            <Text variant="body">✕</Text>
          </button>
        </div>
        <div class="shortcuts-list">
          <div class="shortcut-item">
            <Text variant="body-sm" class="shortcut-keys">⌘ B</Text>
            <Text variant="body-sm">Toggle focus mode</Text>
          </div>
          <div class="shortcut-item">
            <Text variant="body-sm" class="shortcut-keys">⌘ Enter</Text>
            <Text variant="body-sm">Run tests</Text>
          </div>
          <div class="shortcut-item">
            <Text variant="body-sm" class="shortcut-keys">⌘ R</Text>
            <Text variant="body-sm">Reset code</Text>
          </div>
          <div class="shortcut-item">
            <Text variant="body-sm" class="shortcut-keys">⌘ [</Text>
            <Text variant="body-sm">Previous problem</Text>
          </div>
          <div class="shortcut-item">
            <Text variant="body-sm" class="shortcut-keys">⌘ ]</Text>
            <Text variant="body-sm">Next problem</Text>
          </div>
          <div class="shortcut-item">
            <Text variant="body-sm" class="shortcut-keys">⌘ /</Text>
            <Text variant="body-sm">Show shortcuts</Text>
          </div>
          <div class="shortcut-item">
            <Text variant="body-sm" class="shortcut-keys">Esc</Text>
            <Text variant="body-sm">Exit focus mode</Text>
          </div>
        </div>
      </div>
    </div>

    <!-- Split Pane Content -->
    <div class="practice__content" :class="{ 'practice__content--stacked': !isDesktop }">
      <!-- Problem Description Panel -->
      <div
        class="practice__panel practice__panel--problem"
        :style="isDesktop ? { width: `${splitPosition}%` } : undefined"
      >
        <ProblemPanel :problem="problem" />
      </div>

      <!-- Resizer -->
      <div
        class="practice__resizer"
        @mousedown="handleMouseDown"
        :class="{ 'practice__resizer--dragging': isDragging }"
        title="Drag to resize"
      />

      <!-- Editor Panel -->
      <div
        class="practice__panel practice__panel--editor"
        :style="isDesktop ? { width: `${100 - splitPosition}%` } : undefined"
      >
        <EditorPanel
          v-model:code="userCode"
          v-model:language="selectedLanguage"
          :test-results="testResults"
          :is-running="isRunning"
          @run="runTests"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.practice {
  width: 100%;
  min-height: 100dvh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--color-background);
}

.practice__not-found {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  align-items: center;
}

/* ── Header ── */
.practice__header {
  height: 3rem;
  border-bottom: var(--border-width) solid var(--button-border);
  flex-shrink: 0;
  background-color: var(--color-surface);
  position: sticky;
  top: 0;
  z-index: 40;
}

.practice__header-content {
  height: 100%;
  width: 100%;
  min-width: 0;
  padding: 0 var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.practice__back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: var(--color-text-primary);
  background: none;
  border: var(--border-thin) solid transparent;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease);
}

.practice__back:hover {
  color: var(--color-text-primary);
  border-color: var(--button-border);
  background-color: var(--button-ghost-hover);
}

.practice__back:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

.practice__title {
  flex: 1;
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.practice__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: thin;
}

/* ── Nav buttons ── */
.practice__nav {
  display: flex;
  border: var(--border-thin) solid var(--button-border);
}

.practice__nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: var(--color-text-primary);
  background: var(--button-ghost-bg);
  border: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease);
}

.practice__nav-btn + .practice__nav-btn {
  border-left: var(--border-thin) solid var(--button-border);
}

.practice__nav-btn:hover:not(:disabled) {
  color: var(--color-text-primary);
  background-color: var(--button-ghost-hover);
}

.practice__nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.practice__nav-btn:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: -2px;
}

/* ── Action buttons ── */
.practice__action-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-primary);
  background: var(--button-ghost-bg);
  border: var(--border-thin) solid var(--button-border);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease);
}

.practice__action-btn:hover {
  color: var(--color-text-primary);
  background-color: var(--button-ghost-hover);
}

.practice__action-btn:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

.practice__focus-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--button-ghost-bg);
  border: var(--border-thin) solid var(--button-border);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease);
}

.practice__focus-toggle:hover {
  background-color: var(--button-ghost-hover);
}

.practice__focus-toggle:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* ── Content Panes ── */
.practice__content {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}

.practice__panel {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.practice__panel--problem {
  border-right: var(--border-thin) solid var(--color-border-subtle);
}

.practice__resizer {
  width: 3px;
  background-color: var(--color-border-strong);
  cursor: col-resize;
  flex-shrink: 0;
  position: relative;
  transition: background-color var(--duration-fast) var(--ease);
}

.practice__resizer:hover,
.practice__resizer--dragging {
  background-color: var(--color-primary);
}

.practice__resizer::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -4px;
  right: -4px;
}

/* ── Shortcuts Overlay ── */
.shortcuts-overlay {
  position: fixed;
  inset: 0;
  background-color: color-mix(in srgb, var(--color-background) 78%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.shortcuts-panel {
  background-color: var(--color-surface);
  border: var(--border-thick) solid var(--color-border-strong);
  box-shadow: var(--shadow-brutal-lg);
  padding: var(--space-6);
  max-width: 400px;
  width: 90%;
  animation: bounceIn 0.3s ease-out;
}

.shortcuts-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.shortcuts-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: var(--color-text-primary);
  background: none;
  border: var(--border-thin) solid transparent;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease);
}

.shortcuts-close:hover {
  color: var(--color-text-primary);
  border-color: var(--color-border-strong);
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.shortcut-keys {
  font-family: var(--font-mono);
  background-color: var(--color-surface-raised);
  color: var(--color-text-primary);
  border: var(--border-thin) solid var(--color-border-strong);
  padding: var(--space-1) var(--space-3);
  min-width: 5rem;
  text-align: center;
  font-size: var(--text-sm);
  font-weight: var(--font-weight-bold);
}

@media (max-width: 1024px) {
  .practice__content,
  .practice__content--stacked {
    flex-direction: column;
  }

  .practice__panel--problem {
    width: 100% !important;
    height: min(52vh, 25rem);
    border-right: 0;
    border-bottom: var(--border-thin) solid var(--color-border-subtle);
  }

  .practice__panel--editor {
    width: 100% !important;
    flex: 1;
  }

  .practice__resizer {
    display: none;
  }
}

@media (max-width: 780px) {
  .practice__header {
    height: auto;
  }

  .practice__header-content {
    flex-wrap: wrap;
    padding: var(--space-2) var(--space-3);
    gap: var(--space-2);
  }

  .practice__title {
    width: 100%;
    order: 2;
  }

  .practice__actions {
    width: 100%;
    justify-content: flex-start;
  }
}

/* ── Focus Mode ── */
.practice--focus .practice__panel--problem {
  width: 100% !important;
}

.practice--focus .practice__panel--editor,
.practice--focus .practice__resizer {
  display: none;
}

/* Prevent text selection during drag */
.practice__resizer--dragging ~ * {
  user-select: none;
}
</style>
