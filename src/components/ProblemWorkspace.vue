<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ProblemDescription from './ProblemDescription.vue'
import CodeEditor from './CodeEditor.vue'
import TestRunner from './TestRunner.vue'
import type { Problem, Language, TestResult } from '@/types'

interface Props {
  problem: Problem
}

interface Emits {
  (e: 'back'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedLanguage = ref<Language>('typescript')
const userCode = ref('')
const testResults = ref<TestResult[]>([])
const isRunning = ref(false)
const showDescription = ref(true)

// Initialize code when problem changes
watch(
  () => props.problem,
  (newProblem) => {
    userCode.value = newProblem.starterCode[selectedLanguage.value] || ''
    testResults.value = []
  },
  { immediate: true }
)

// Update code when language changes
watch(selectedLanguage, (newLang) => {
  userCode.value = props.problem.starterCode[newLang] || ''
  testResults.value = []
})

const handleLanguageChange = (lang: Language) => {
  selectedLanguage.value = lang
}

const handleCodeChange = (code: string) => {
  userCode.value = code
}

const handleRunTests = async () => {
  isRunning.value = true
  testResults.value = []

  // Simulate test execution
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock test results
  testResults.value = props.problem.testCases.map((testCase, idx) => ({
    passed: idx < 2, // First 2 pass for demo
    input: testCase.input,
    expectedOutput: testCase.expectedOutput,
    actualOutput: idx < 2 ? testCase.expectedOutput : 'undefined',
    error: idx >= 2 ? 'Function returned undefined' : undefined,
  }))

  isRunning.value = false
}

const toggleView = () => {
  showDescription.value = !showDescription.value
}

const passedTests = computed(() => testResults.value.filter((r) => r.passed).length)
const totalTests = computed(() => testResults.value.length)
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="border-b border-white/20 glass-card backdrop-blur-2xl p-5 flex items-center justify-between animate-slide-down">
      <button
        @click="emit('back')"
        class="btn btn-secondary flex items-center gap-2.5"
      >
        <span class="text-xl">←</span>
        <span class="font-semibold">Back to Problems</span>
      </button>

      <div class="hidden md:flex items-center gap-4">
        <button
          @click="toggleView"
          class="btn btn-secondary lg:hidden"
        >
          {{ showDescription ? 'Show Editor' : 'Show Description' }}
        </button>

        <div
          v-if="testResults.length > 0"
          class="glass-card px-6 py-3"
        >
          <span class="font-display font-bold text-sm">
            <span :class="passedTests === totalTests ? 'text-emerald-600' : 'text-red-600'">
              {{ passedTests }}/{{ totalTests }}
            </span>
            <span class="text-slate-600 ml-1.5">Tests Passed</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Split View -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Problem Description -->
      <div
        :class="[
          'w-full lg:w-1/2 border-r border-white/20 bg-white/10 backdrop-blur-sm overflow-y-auto',
          !showDescription && 'hidden lg:block',
        ]"
      >
        <ProblemDescription :problem="problem" />
      </div>

      <!-- Code Editor & Test Runner -->
      <div
        :class="['flex-1 flex flex-col overflow-hidden', !showDescription || 'hidden lg:flex']"
      >
        <CodeEditor
          :language="selectedLanguage"
          :code="userCode"
          :starter-code="problem.starterCode"
          @update:language="handleLanguageChange"
          @update:code="handleCodeChange"
        />

        <TestRunner
          :test-results="testResults"
          :is-running="isRunning"
          @run-tests="handleRunTests"
        />
      </div>
    </div>
  </div>
</template>
