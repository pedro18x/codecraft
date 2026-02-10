<script setup lang="ts">
import type { Problem } from '@/types'

interface Props {
  problems: Problem[]
  searchQuery: string
  selectedDifficulty: string
}

interface Emits {
  (e: 'update:searchQuery', value: string): void
  (e: 'update:selectedDifficulty', value: string): void
  (e: 'selectProblem', problem: Problem): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const difficulties = ['All', 'Easy', 'Medium', 'Hard']

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return 'badge-success'
    case 'Medium':
      return 'badge-accent'
    case 'Hard':
      return 'badge-error'
    default:
      return 'badge-primary'
  }
}
</script>

<template>
  <div class="h-full flex flex-col backdrop-blur-sm">
    <!-- Search and Filters -->
    <div class="p-6 space-y-5 border-b border-white/20">
      <div>
        <label class="block text-sm font-bold mb-3 text-slate-700 uppercase tracking-wider">Search Problems</label>
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-accent-400/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
          <input
            type="text"
            :value="searchQuery"
            @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
            placeholder="Two Sum, Valid Parentheses..."
            class="input w-full relative z-10"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-bold mb-3 text-slate-700 uppercase tracking-wider">Difficulty</label>
        <div class="flex gap-3 flex-wrap">
          <button
            v-for="diff in difficulties"
            :key="diff"
            @click="emit('update:selectedDifficulty', diff)"
            :class="[
              'btn text-sm px-5 py-2.5',
              selectedDifficulty === diff ? 'btn-primary' : 'btn-secondary',
            ]"
          >
            {{ diff }}
          </button>
        </div>
      </div>

      <div class="glass-card px-4 py-3 inline-block">
        <span class="text-sm text-slate-600 font-semibold">
          <span class="gradient-text font-bold">{{ problems.length }}</span>
          <span class="ml-1">problem{{ problems.length !== 1 ? 's' : '' }} found</span>
        </span>
      </div>
    </div>

    <!-- Problems List -->
    <div class="flex-1 overflow-y-auto p-6">
      <div class="space-y-4">
        <button
          v-for="(problem, idx) in problems"
          :key="problem.id"
          @click="emit('selectProblem', problem)"
          class="w-full text-left glass-card-hover p-6 group animate-fade-in"
          :style="{ animationDelay: `${idx * 50}ms` }"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-4">
                <div class="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300/50">
                  <span class="font-mono font-bold text-slate-600 text-sm">{{ problem.id }}</span>
                </div>
                <h3 class="font-display font-bold text-xl text-slate-800 group-hover:gradient-text transition-all truncate">
                  {{ problem.title }}
                </h3>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="category in problem.categories.slice(0, 3)"
                  :key="category"
                  class="badge badge-primary text-xs"
                >
                  {{ category }}
                </span>
                <span
                  v-if="problem.categories.length > 3"
                  class="badge bg-slate-100 text-slate-600 border-slate-200 text-xs"
                >
                  +{{ problem.categories.length - 3 }}
                </span>
              </div>
            </div>
            <div>
              <span :class="['badge', getDifficultyColor(problem.difficulty)]">
                {{ problem.difficulty }}
              </span>
            </div>
          </div>
        </button>

        <div
          v-if="problems.length === 0"
          class="text-center py-20 animate-fade-in"
        >
          <div class="inline-block glass-card p-12 rounded-3xl">
            <div class="text-7xl mb-6 opacity-40">🔍</div>
            <p class="font-display font-bold text-2xl text-slate-700 mb-3">No problems found</p>
            <p class="text-sm text-slate-500">Try adjusting your filters or search query</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
