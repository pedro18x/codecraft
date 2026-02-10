export const codecraftMonacoTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '8E99B0', fontStyle: 'italic' },
    { token: 'keyword', foreground: '7C9BFF', fontStyle: 'bold' },
    { token: 'operator', foreground: 'EEF2FF' },
    { token: 'string', foreground: '4DD4AC' },
    { token: 'number', foreground: 'F6C760' },
    { token: 'type.identifier', foreground: '78C4FF' },
    { token: 'delimiter', foreground: 'B7C0D4' },
  ],
  colors: {
    'editor.background': '#0F1115',
    'editor.foreground': '#EEF2FF',
    'editor.lineHighlightBackground': '#161A22',
    'editorCursor.foreground': '#F6C760',
    'editor.selectionBackground': '#252D3DCC',
    'editor.inactiveSelectionBackground': '#1D233088',
    'editor.selectionHighlightBackground': '#1D233099',
    'editorLineNumber.foreground': '#8E99B0',
    'editorLineNumber.activeForeground': '#7C9BFF',
    'editorIndentGuide.background1': '#252D3D',
    'editorIndentGuide.activeBackground1': '#4A5670',
    'editorBracketMatch.background': '#1D2330',
    'editorBracketMatch.border': '#7C9BFF',
    'editorGutter.background': '#0F1115',
    'minimap.selectionHighlight': '#7C9BFF66',
  },
} as const

export async function applyCodecraftMonacoTheme(monaco: any) {
  monaco.editor.defineTheme('codecraft-brutal', codecraftMonacoTheme)
  monaco.editor.setTheme('codecraft-brutal')
}
