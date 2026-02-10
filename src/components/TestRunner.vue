<script setup lang="ts">
import { computed } from 'vue'
import type { TestResult } from '@/types'

interface Props {
  testResults: TestResult[]
  isRunning: boolean
}

interface Emits {
  (e: 'runTests'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const passedTests = computed(() => props.testResults.filter((r) => r.passed).length)
const totalTests = computed(() => props.testResults.length)
const allPassed = computed(() => totalTests.value > 0 && passedTests.value === totalTests.value)
</script>

<template>
  <div class="h-96 border-t border-white/20 glass-card flex flex-col">
    <!-- Test Runner Header -->
    <div class="border-b border-white/20 p-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
          <span class="text-xl">🧪</span>
        </div>
        <h3 class="font-display font-bold text-xl text-slate-800">Test Results</h3>
      </div>
      <button
        @click="emit('runTests')"
        :disabled="isRunning"
        :class="[
          'btn flex items-center gap-2.5',
          isRunning ? 'btn-secondary opacity-60 cursor-not-allowed' : 'btn-primary',
        ]"
      >
        <span v-if="isRunning" class="text-lg animate-spin">⏳</span>
        <span v-else class="text-lg">▶</span>
        <span class="font-semibold">{{ isRunning ? 'Running Tests...' : 'Run Tests' }}</span>
      </button>
    </div>

    <!-- Test Results -->
    <div class="flex-1 overflow-y-auto p-5 space-y-4">
      <!-- Loading State -->
      <div
        v-if="isRunning"
        class="flex items-center justify-center h-full"
      >
        <div class="text-center space-y-6 animate-fade-in">
          <div class="relative w-20 h-20 mx-auto">
            <div class="absolute inset-0 border-4 border-primary-200 rounded-full animate-ping"></div>
            <div class="absolute inset-0 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div>
            <p class="font-display font-bold text-xl text-slate-700 mb-2">Running tests...</p>
            <p class="text-sm text-slate-500">Executing your solution</p>
          </div>
        </div>
      </div>

      <!-- Results Summary -->
      <div
        v-else-if="testResults.length > 0"
        :class="[
          'glass-card p-6 mb-4 animate-scale-in relative overflow-hidden',
        ]"
      >
        <div class="absolute inset-0 opacity-10" :class="allPassed ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-red-400 to-red-600'"></div>
        <div class="relative flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center" :class="allPassed ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-red-400 to-red-600'">
              <span class="text-3xl">{{ allPassed ? '🎉' : '💪' }}</span>
            </div>
            <div>
              <div class="font-display font-bold text-2xl text-slate-800">
                {{ passedTests }}<span class="text-slate-400">/</span>{{ totalTests }}
                <span class="text-lg ml-1">Tests Passed</span>
              </div>
              <div class="text-sm text-slate-600 mt-1 font-medium">
                {{ allPassed ? '✨ Perfect! All tests passed!' : '⚡ Keep going! You\'re almost there!' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Individual Test Results -->
      <div
        v-for="(result, idx) in testResults"
        :key="idx"
        :class="[
          'glass-card p-5 space-y-4 animate-slide-up relative overflow-hidden',
        ]"
        :style="{ animationDelay: `${idx * 100}ms` }"
      >
        <div class="absolute top-0 right-0 w-32 h-32 opacity-5" :class="result.passed ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-red-400 to-red-600'"></div>

        <div class="relative flex items-start justify-between gap-4">
          <div class="flex-1 space-y-4">
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-glass',
                  result.passed ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : 'bg-gradient-to-br from-red-500 to-red-700',
                ]"
              >
                {{ result.passed ? '✓' : '✗' }}
              </div>
              <span class="font-display font-bold text-lg text-slate-800">Test Case {{ idx + 1 }}</span>
            </div>

            <div class="font-mono text-sm space-y-3 pl-13">
              <div class="glass-card p-4 space-y-2">
                <div class="flex gap-3">
                  <span class="text-slate-500 font-semibold min-w-[80px]">Input:</span>
                  <span class="text-slate-800 font-bold flex-1 break-all">{{ result.input }}</span>
                </div>
                <div class="flex gap-3">
                  <span class="text-slate-500 font-semibold min-w-[80px]">Expected:</span>
                  <span class="text-emerald-600 font-bold flex-1 break-all">{{ result.expectedOutput }}</span>
                </div>
                <div v-if="!result.passed" class="flex gap-3">
                  <span class="text-slate-500 font-semibold min-w-[80px]">Got:</span>
                  <span class="text-red-600 font-bold flex-1 break-all">{{ result.actualOutput || 'undefined' }}</span>
                </div>
              </div>
              <div
                v-if="result.error"
                class="glass-card p-4 bg-red-50/50 border-red-200"
              >
                <div class="flex gap-2 items-start">
                  <span class="text-red-600 font-bold">Error:</span>
                  <span class="text-red-700 text-xs flex-1">{{ result.error }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!isRunning && testResults.length === 0"
        class="flex items-center justify-center h-full"
      >
        <div class="text-center space-y-6 animate-fade-in">
          <div class="relative inline-block">
            <div class="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-400 blur-3xl opacity-30"></div>
            <div class="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-glass-xl floating">
              <span class="text-5xl">🧪</span>
            </div>
          </div>
          <div>
            <p class="font-display font-bold text-xl text-slate-700 mb-2">Ready to test your code</p>
            <p class="text-sm text-slate-500">Click "Run Tests" to execute your solution</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
