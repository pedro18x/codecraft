<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Language } from '@/types'

interface Props {
  language: Language
  code: string
  starterCode: Partial<Record<Language, string>>
}

interface Emits {
  (e: 'update:language', value: Language): void
  (e: 'update:code', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const languages: { value: Language; label: string; icon: string }[] = [
  { value: 'javascript', label: 'JavaScript', icon: 'JS' },
  { value: 'typescript', label: 'TypeScript', icon: 'TS' },
  { value: 'python', label: 'Python', icon: 'PY' },
]

const localCode = ref(props.code)

watch(
  () => props.code,
  (newCode) => {
    localCode.value = newCode
  }
)

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  localCode.value = target.value
  emit('update:code', target.value)
}

const handleReset = () => {
  localCode.value = props.starterCode[props.language] || ''
  emit('update:code', localCode.value)
}
</script>

<template>
  <div class="flex-1 flex flex-col border-b border-white/20 bg-white/20 backdrop-blur-md overflow-hidden">
    <!-- Editor Header -->
    <div class="border-b border-white/20 glass-card p-4 flex items-center justify-between">
      <div class="flex gap-2.5">
        <button
          v-for="lang in languages"
          :key="lang.value"
          @click="emit('update:language', lang.value)"
          :class="[
            'btn text-sm px-5 py-2.5 transition-all relative overflow-hidden',
            language === lang.value ? 'btn-primary' : 'btn-secondary',
          ]"
        >
          <span class="hidden sm:inline font-semibold">{{ lang.label }}</span>
          <span class="sm:hidden font-mono font-bold text-base">{{ lang.icon }}</span>
        </button>
      </div>

      <button
        @click="handleReset"
        class="btn btn-secondary text-sm px-5 py-2.5 flex items-center gap-2"
      >
        <span class="text-lg">↻</span>
        <span class="font-semibold">Reset</span>
      </button>
    </div>

    <!-- Code Editor -->
    <div class="flex-1 relative overflow-hidden">
      <!-- Ambient Glow -->
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none"></div>

      <textarea
        :value="localCode"
        @input="handleInput"
        class="absolute inset-0 w-full h-full p-8 font-mono text-sm leading-loose resize-none focus:outline-none bg-slate-950/95 backdrop-blur-xl text-emerald-400 border-none"
        spellcheck="false"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        placeholder="// Write your solution here...&#10;// Let your code shine ✨"
      ></textarea>
    </div>

    <!-- Editor Footer -->
    <div class="border-t border-slate-800/50 bg-slate-950/95 backdrop-blur-xl px-6 py-3 flex items-center justify-between text-sm">
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2.5">
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-slow shadow-glow"></div>
          <span class="text-emerald-400 font-mono font-semibold">Ready</span>
        </div>
        <div class="text-slate-500 font-mono">
          <span class="text-emerald-400 font-bold">{{ localCode.split('\n').length }}</span>
          <span class="ml-1">lines</span>
        </div>
        <div class="text-slate-500 font-mono">
          <span class="text-emerald-400 font-bold">{{ localCode.length }}</span>
          <span class="ml-1">chars</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-slate-500 font-mono uppercase text-xs tracking-wider">{{ language }}</span>
        <div class="w-2 h-2 rounded-full bg-slate-600"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea {
  tab-size: 2;
  caret-color: #10b981;
}

textarea::selection {
  background-color: rgba(16, 185, 129, 0.25);
}

textarea::placeholder {
  color: rgba(148, 163, 184, 0.3);
  font-style: italic;
}
</style>
