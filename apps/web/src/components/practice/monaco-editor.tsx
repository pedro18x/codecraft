'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import type { Monaco } from '@monaco-editor/react'

const MonacoEditorBase = dynamic(() => import('@monaco-editor/react'), { ssr: false })

// Ambient types injected into the editor so interview problems can reference
// ListNode / TreeNode without the user having to define them.
const PRACTICE_TYPES = `
declare class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null);
}
declare class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null);
}
`

// ── Custom Zen dark theme ────────────────────────────────────────────────────
// Colors sourced directly from tokens.css so the editor matches the site palette.
// zen-bg:        #171614   zen-surface-1: #211F1C   zen-surface-2: #2B2926
// zen-surface-3: #353230   zen-border:    #3A3735
// zen-text-primary:   #E8E4DF  zen-text-secondary: #9E9890  zen-text-tertiary: #6B665F
// zen-accent-rust:    #C75B3A  zen-accent-jade:    #3E7A55
// zen-accent-amber:   #C9A84C  zen-accent-slate:   #6B8DA6  zen-accent-moss: #7B8F6A
function defineZenTheme(monaco: Monaco) {
  monaco.editor.defineTheme('zen-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      // Identifiers / plain text
      { token: '',                  foreground: 'E8E4DF', background: '171614' },

      // Keywords: if, for, return, const, let, var, function, class, …
      { token: 'keyword',           foreground: '6B8DA6' }, // slate
      { token: 'keyword.control',   foreground: '6B8DA6' },
      { token: 'storage',           foreground: '6B8DA6' },
      { token: 'storage.type',      foreground: '6B8DA6' },

      // Functions / method names
      { token: 'entity.name.function', foreground: '3E7A55' }, // jade
      { token: 'support.function',     foreground: '3E7A55' },

      // Strings
      { token: 'string',            foreground: '7B8F6A' }, // moss

      // Numbers / constants
      { token: 'number',            foreground: 'C75B3A' }, // rust
      { token: 'constant.numeric',  foreground: 'C75B3A' },
      { token: 'constant.language', foreground: 'C75B3A' }, // true, false, null

      // Types / classes
      { token: 'type',              foreground: 'C9A84C' }, // amber
      { token: 'entity.name.type',  foreground: 'C9A84C' },
      { token: 'support.type',      foreground: 'C9A84C' },

      // Comments
      { token: 'comment',           foreground: '4A4743', fontStyle: 'italic' },

      // Variables / parameters
      { token: 'variable',          foreground: 'E8E4DF' },
      { token: 'variable.parameter', foreground: 'C9A84C' }, // amber for params

      // Operators & punctuation
      { token: 'punctuation',       foreground: '9E9890' }, // secondary
      { token: 'delimiter',         foreground: '9E9890' },

      // TypeScript-specific
      { token: 'type.identifier',   foreground: 'C9A84C' },
      { token: 'interface',         foreground: 'C9A84C' },
    ],
    colors: {
      // ── Editor canvas ──
      'editor.background':                '#171614',
      'editor.foreground':                '#E8E4DF',

      // ── Line highlight ──
      'editor.lineHighlightBackground':   '#211F1C',
      'editor.lineHighlightBorder':       '#2B2926',

      // ── Selection ──
      'editor.selectionBackground':       '#3E7A5540',
      'editor.inactiveSelectionBackground': '#3E7A5526',
      'editor.selectionHighlightBackground': '#3E7A5522',

      // ── Cursor ──
      'editorCursor.foreground':          '#E8E4DF',

      // ── Gutter ──
      'editorLineNumber.foreground':      '#4A4743',
      'editorLineNumber.activeForeground': '#9E9890',
      'editorGutter.background':          '#171614',

      // ── Whitespace & indent guides ──
      'editorWhitespace.foreground':      '#3A3735',
      'editorIndentGuide.background1':    '#2B2926',
      'editorIndentGuide.activeBackground1': '#3A3735',

      // ── Ruler ──
      'editorRuler.foreground':           '#2B2926',

      // ── Widget / hover popups ──
      'editorWidget.background':          '#211F1C',
      'editorWidget.border':              '#3A3735',
      'editorHoverWidget.background':     '#211F1C',
      'editorHoverWidget.border':         '#3A3735',

      // ── Suggestions dropdown ──
      'editorSuggestWidget.background':   '#211F1C',
      'editorSuggestWidget.border':       '#3A3735',
      'editorSuggestWidget.foreground':   '#E8E4DF',
      'editorSuggestWidget.selectedBackground': '#2B2926',
      'editorSuggestWidget.highlightForeground': '#3E7A55',

      // ── Find / match highlight ──
      'editor.findMatchBackground':       '#C9A84C33',
      'editor.findMatchHighlightBackground': '#C9A84C1A',

      // ── Bracket matching ──
      'editorBracketMatch.background':    '#3E7A5530',
      'editorBracketMatch.border':        '#3E7A55',

      // ── Scrollbar ──
      'scrollbarSlider.background':       '#3A373580',
      'scrollbarSlider.hoverBackground':  '#4A474380',
      'scrollbarSlider.activeBackground': '#6B665F80',

      // ── Error / warning squiggles ──
      'editorError.foreground':           '#C75B3A',
      'editorWarning.foreground':         '#C9A84C',
      'editorInfo.foreground':            '#6B8DA6',
    },
  })
}

function configureTypeScript(monaco: Monaco) {
  defineZenTheme(monaco)

  // Monaco 0.52+ moved the TS Language Service to the top-level
  // `monaco.typescript` namespace; `monaco.languages.typescript` is deprecated.
  monaco.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    lib: ['es2020', 'dom', 'dom.iterable'],
    // Relaxed settings appropriate for a practice environment — keeps
    // useful checks (syntax, basic types) without penalising starter
    // templates that deliberately lack a return body.
    strict: false,
    noImplicitAny: false,
    strictNullChecks: false,
    noUnusedLocals: false,
    noUnusedParameters: false,
  })
  monaco.typescript.typescriptDefaults.setDiagnosticsOptions({
    diagnosticCodesToIgnore: [2366],
  })
  monaco.typescript.typescriptDefaults.addExtraLib(
    PRACTICE_TYPES,
    'file:///practice-types.d.ts',
  )
}

interface MonacoEditorProps {
  language: string
  value: string
  onChange: (value: string) => void
}

export function MonacoEditor({ language, value, onChange }: MonacoEditorProps) {
  const monacoRef = useRef<Monaco | null>(null)
  const suppressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevLanguageRef = useRef(language)

  // Suppress diagnostics on language switch to prevent stale-code red squiggles
  // while useCodeStorage loads the incoming language's code from storage.
  useEffect(() => {
    if (prevLanguageRef.current === language) return
    prevLanguageRef.current = language

    const m = monacoRef.current
    if (!m) return

    m.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    })
    m.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    })

    if (suppressTimerRef.current) clearTimeout(suppressTimerRef.current)
    suppressTimerRef.current = setTimeout(() => {
      m.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
        diagnosticCodesToIgnore: [2366],
      })
      m.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      })
    }, 150)
  }, [language])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (suppressTimerRef.current) clearTimeout(suppressTimerRef.current)
    }
  }, [])

  return (
    <MonacoEditorBase
      height="100%"
      language={language === 'typescript' ? 'typescript' : language === 'python' ? 'python' : 'javascript'}
      value={value}
      onChange={(v) => onChange(v ?? '')}
      theme="zen-dark"
      beforeMount={configureTypeScript}
      onMount={(_editor, m) => { monacoRef.current = m }}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
        padding: { top: 16 },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        glyphMargin: false,
        folding: false,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 3,
        renderLineHighlight: 'all',
        tabSize: 2,
        automaticLayout: true,
      }}
    />
  )
}
