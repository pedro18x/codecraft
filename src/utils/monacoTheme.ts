export const codecraftMonacoTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: 'A3A3A3', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'FF6B6B', fontStyle: 'bold' },
    { token: 'operator', foreground: 'F5F5F5' },
    { token: 'string', foreground: '4ECDC4' },
    { token: 'number', foreground: 'FFE66D' },
    { token: 'type.identifier', foreground: 'D4D4D4' },
    { token: 'delimiter', foreground: 'D4D4D4' },
  ],
  colors: {
    'editor.background': '#0A0A0A',
    'editor.foreground': '#F5F5F5',
    'editor.lineHighlightBackground': '#111111',
    'editorCursor.foreground': '#FFE66D',
    'editor.selectionBackground': '#1F1F1FCC',
    'editor.inactiveSelectionBackground': '#17171788',
    'editor.selectionHighlightBackground': '#26262699',
    'editorLineNumber.foreground': '#737373',
    'editorLineNumber.activeForeground': '#F5F5F5',
    'editorIndentGuide.background1': '#1F1F1F',
    'editorIndentGuide.activeBackground1': '#4A4A4A',
    'editorBracketMatch.background': '#171717',
    'editorBracketMatch.border': '#4A4A4A',
    'editorGutter.background': '#0A0A0A',
    'minimap.selectionHighlight': '#4A4A4A66',
  },
} as const

export async function applyCodecraftMonacoTheme(monaco: any) {
  monaco.editor.defineTheme('codecraft-brutal', codecraftMonacoTheme)
  monaco.editor.setTheme('codecraft-brutal')
}
