<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { applyCodecraftMonacoTheme } from '../../utils/monacoTheme'
import type { Language } from '../../types'

interface Props {
  modelValue: string
  language: Language
  readOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readOnly: false,
})

const emit = defineEmits<{ (event: 'update:modelValue', value: string): void }>()

const rootRef = ref<HTMLDivElement | null>(null)
const loading = ref(true)
const failed = ref(false)

let monacoModule: typeof import('monaco-editor') | null = null
let editorInstance: import('monaco-editor').editor.IStandaloneCodeEditor | null = null

const monacoLanguage = (language: Language) => {
  if (language === 'javascript') return 'javascript'
  if (language === 'typescript') return 'typescript'
  return 'python'
}

const createEditor = async () => {
  if (!rootRef.value) return

  try {
    const [{ editor, languages }] = await Promise.all([
      import('monaco-editor/esm/vs/editor/editor.api'),
      import('monaco-editor/esm/vs/language/typescript/monaco.contribution'),
      import('monaco-editor/esm/vs/basic-languages/python/python.contribution'),
    ])

    const monaco = { editor, languages } as unknown as typeof import('monaco-editor')
    monacoModule = monaco
    await applyCodecraftMonacoTheme(monaco)

    const instance = editor.create(rootRef.value, {
      value: props.modelValue,
      language: monacoLanguage(props.language),
      readOnly: props.readOnly,
      automaticLayout: true,
      minimap: { enabled: true },
      fontFamily: 'JetBrains Mono, monospace',
      fontLigatures: true,
      fontSize: 14,
      lineHeight: 22,
      scrollbar: {
        alwaysConsumeMouseWheel: false,
      },
      smoothScrolling: true,
      padding: {
        top: 14,
        bottom: 14,
      },
      theme: 'codecraft-brutal',
    })

    editorInstance = instance

    instance.onDidChangeModelContent(() => {
      const value = instance.getValue()
      emit('update:modelValue', value)
    })

    loading.value = false
  } catch {
    failed.value = true
    loading.value = false
  }
}

watch(
  () => props.modelValue,
  (value) => {
    if (!editorInstance) return
    if (editorInstance.getValue() === value) return
    editorInstance.setValue(value)
  }
)

watch(
  () => props.language,
  (language) => {
    if (!editorInstance || !monacoModule) return

    const model = editorInstance.getModel()
    if (!model) return
    monacoModule.editor.setModelLanguage(model, monacoLanguage(language))
  }
)

onMounted(() => {
  createEditor()
})

onUnmounted(() => {
  editorInstance?.dispose()
})
</script>

<template>
  <div class="monaco-lazy">
    <div v-if="loading" class="monaco-loading" aria-live="polite">
      <span class="monaco-loading__bar" />
      <p>Booting editor engine...</p>
    </div>

    <textarea
      v-else-if="failed"
      class="monaco-fallback"
      :value="modelValue"
      spellcheck="false"
      aria-label="Code editor fallback"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />

    <div v-else ref="rootRef" class="monaco-root" />
  </div>
</template>

<style scoped>
.monaco-lazy {
  position: relative;
  width: 100%;
  height: 100%;
}

.monaco-root,
.monaco-fallback,
.monaco-loading {
  width: 100%;
  height: 100%;
}

.monaco-loading {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 0.7rem;
  background: #1a1a1a;
  color: #fffef9;
  font-family: var(--font-mono);
}

.monaco-loading__bar {
  width: min(18rem, 78%);
  height: 0.8rem;
  border: 3px solid #ffe66d;
  background: linear-gradient(90deg, #4ecdc4 0%, #ffe66d 50%, #ff6b6b 100%);
  background-size: 200% 100%;
  animation: monaco-load 1.2s linear infinite;
}

.monaco-fallback {
  border: 0;
  outline: none;
  resize: none;
  background: #161616;
  color: #fffef9;
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.5;
  padding: 1rem;
}

@keyframes monaco-load {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
