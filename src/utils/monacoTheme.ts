export const codecraftMonacoTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '9B9B9B', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'E07272', fontStyle: 'bold' },
    { token: 'operator', foreground: 'F2F2F2' },
    { token: 'string', foreground: '5DB8B1' },
    { token: 'number', foreground: 'D5C15F' },
    { token: 'type.identifier', foreground: 'CFCFCF' },
    { token: 'delimiter', foreground: 'CFCFCF' },
  ],
  colors: {
    'editor.background': '#080808',
    'editor.foreground': '#F2F2F2',
    'editor.lineHighlightBackground': '#101010',
    'editorCursor.foreground': '#F0E38A',
    'editor.selectionBackground': '#1D1D1DCC',
    'editor.inactiveSelectionBackground': '#16161699',
    'editor.selectionHighlightBackground': '#24242499',
    'editorLineNumber.foreground': '#6F6F6F',
    'editorLineNumber.activeForeground': '#F2F2F2',
    'editorIndentGuide.background1': '#1D1D1D',
    'editorIndentGuide.activeBackground1': '#4B4B4B',
    'editorBracketMatch.background': '#161616',
    'editorBracketMatch.border': '#4B4B4B',
    'editorGutter.background': '#080808',
    'minimap.selectionHighlight': '#4B4B4B55',
  },
} as const

export async function applyCodecraftMonacoTheme(monaco: any) {
  monaco.editor.defineTheme('codecraft-brutal', codecraftMonacoTheme)
  monaco.editor.setTheme('codecraft-brutal')
}
