<script setup lang="ts">
import { ref } from 'vue'
import type { Problem } from '@/types'

interface Props {
  problem: Problem
}

defineProps<Props>()

const showHints = ref(false)
const revealedHints = ref(0)

const revealNextHint = () => {
  revealedHints.value++
}

const toggleHints = () => {
  showHints.value = !showHints.value
  if (!showHints.value) {
    revealedHints.value = 0
  }
}
</script>

<template>
  <div class="p-8 space-y-8 max-w-5xl mx-auto">
    <!-- Title -->
    <div class="space-y-5 animate-slide-up">
      <div class="flex items-center gap-4">
        <div class="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-glass">
          <span class="font-mono font-bold text-white text-lg">#{{ problem.id }}</span>
        </div>
        <h1 class="font-display font-bold text-5xl text-slate-800 tracking-tight">{{ problem.title }}</h1>
      </div>
      <div class="flex gap-2 flex-wrap">
        <span
          v-for="category in problem.categories"
          :key="category"
          class="badge badge-primary"
        >
          {{ category }}
        </span>
      </div>
    </div>

    <!-- Description -->
    <div class="glass-card p-8 space-y-4 animate-slide-up" style="animation-delay: 0.1s">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></div>
        <h2 class="font-display font-bold text-2xl text-slate-800">Description</h2>
      </div>
      <div
        class="prose prose-slate prose-lg max-w-none leading-relaxed whitespace-pre-wrap text-slate-700"
        v-html="problem.description"
      ></div>
    </div>

    <!-- Examples -->
    <div class="space-y-5 animate-slide-up" style="animation-delay: 0.2s">
      <div class="flex items-center gap-3">
        <div class="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></div>
        <h2 class="font-display font-bold text-2xl text-slate-800">Examples</h2>
      </div>
      <div class="space-y-4">
        <div
          v-for="(example, idx) in problem.examples"
          :key="idx"
          class="glass-card p-6 space-y-4 hover:shadow-glass-lg transition-all duration-500 hover:scale-[1.01]"
        >
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span class="text-white font-bold text-xs">{{ idx + 1 }}</span>
            </div>
            <span class="font-bold text-primary-600 text-sm uppercase tracking-wider">Example</span>
          </div>
          <div class="space-y-3 font-mono text-sm">
            <div class="flex gap-3">
              <span class="text-slate-500 font-semibold min-w-[80px]">Input:</span>
              <span class="text-slate-800 font-bold">{{ example.input }}</span>
            </div>
            <div class="flex gap-3">
              <span class="text-slate-500 font-semibold min-w-[80px]">Output:</span>
              <span class="text-emerald-600 font-bold">{{ example.output }}</span>
            </div>
            <div
              v-if="example.explanation"
              class="pt-3 border-t border-white/50"
            >
              <span class="text-slate-500 font-semibold">Explanation:</span>
              <p class="mt-2 text-slate-700 font-sans leading-relaxed">{{ example.explanation }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Constraints -->
    <div class="glass-card p-8 space-y-5 bg-gradient-to-br from-primary-50/50 to-accent-50/30 animate-slide-up" style="animation-delay: 0.3s">
      <div class="flex items-center gap-3">
        <div class="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></div>
        <h2 class="font-display font-bold text-2xl text-slate-800">Constraints</h2>
      </div>
      <ul class="space-y-3 text-sm">
        <li
          v-for="(constraint, idx) in problem.constraints"
          :key="idx"
          class="flex items-start gap-4 p-3 rounded-xl bg-white/50 backdrop-blur-sm"
        >
          <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-white font-bold text-xs">•</span>
          </div>
          <span class="text-slate-700 font-mono leading-relaxed">{{ constraint }}</span>
        </li>
      </ul>
    </div>

    <!-- Hints -->
    <div
      v-if="problem.hints && problem.hints.length > 0"
      class="glass-card p-6 animate-slide-up"
      style="animation-delay: 0.4s"
    >
      <button
        @click="toggleHints"
        class="w-full flex items-center justify-between font-display font-bold text-xl text-slate-800 hover:text-primary-600 transition-colors group"
      >
        <span class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span class="text-xl">💡</span>
          </div>
          <span>Hints</span>
          <span class="text-sm font-medium text-slate-400 badge badge-primary">{{ problem.hints.length }}</span>
        </span>
        <span class="text-3xl text-slate-400 transition-transform duration-300" :class="showHints ? 'rotate-180' : ''">↓</span>
      </button>

      <div
        v-if="showHints"
        class="mt-6 space-y-4"
      >
        <div
          v-for="(hint, idx) in problem.hints"
          :key="idx"
          class="glass-card p-5 animate-slide-down"
          :style="{ animationDelay: `${idx * 100}ms` }"
        >
          <div
            v-if="idx < revealedHints"
            class="flex gap-4"
          >
            <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
              <span class="text-white font-bold text-sm">{{ idx + 1 }}</span>
            </div>
            <p class="text-sm text-slate-700 leading-relaxed flex-1">{{ hint }}</p>
          </div>
          <button
            v-else-if="idx === revealedHints"
            @click="revealNextHint"
            class="btn btn-primary w-full justify-center flex items-center gap-2"
          >
            <span>🔓</span>
            <span>Reveal Hint {{ idx + 1 }}</span>
          </button>
          <div
            v-else
            class="flex items-center justify-center gap-3 py-4 text-slate-400"
          >
            <span class="text-2xl">🔒</span>
            <span class="font-medium">Hint {{ idx + 1 }} Locked</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
