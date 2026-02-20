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

function configureTypeScript(monaco: Monaco) {
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
      theme="vs-dark"
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
