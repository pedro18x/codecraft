export const codecraftMonacoTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '7B7B7B', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'FF6B6B', fontStyle: 'bold' },
    { token: 'string', foreground: '4ECDC4' },
    { token: 'number', foreground: 'FFE66D' },
    { token: 'type.identifier', foreground: '6C8EFF' },
  ],
  colors: {
    'editor.background': '#161616',
    'editor.foreground': '#FFFEF9',
    'editor.lineHighlightBackground': '#222222',
    'editorCursor.foreground': '#FFE66D',
    'editor.selectionBackground': '#2A3A3A',
    'editorLineNumber.foreground': '#818181',
    'editorLineNumber.activeForeground': '#FFE66D',
    'editorIndentGuide.background1': '#2E2E2E',
    'editorIndentGuide.activeBackground1': '#444444',
  },
}

export async function applyCodecraftMonacoTheme(monaco: {
  editor: {
    defineTheme: (name: string, theme: Record<string, unknown>) => void
    setTheme: (name: string) => void
  }
}) {
  monaco.editor.defineTheme('codecraft-brutal', codecraftMonacoTheme)
  monaco.editor.setTheme('codecraft-brutal')
}
