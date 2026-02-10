export const codecraftMonacoTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '8A8379', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'C84A56', fontStyle: 'bold' },
    { token: 'string', foreground: '2FC2B5' },
    { token: 'number', foreground: 'E8B93F' },
    { token: 'type.identifier', foreground: 'B8B2A7' },
  ],
  colors: {
    'editor.background': '#101012',
    'editor.foreground': '#FFFEF9',
    'editor.lineHighlightBackground': '#1B1C1F',
    'editorCursor.foreground': '#E8B93F',
    'editor.selectionBackground': '#2B2D33',
    'editorLineNumber.foreground': '#7A756B',
    'editorLineNumber.activeForeground': '#E8B93F',
    'editorIndentGuide.background1': '#26272C',
    'editorIndentGuide.activeBackground1': '#3A3C43',
  },
} as const

export async function applyCodecraftMonacoTheme(monaco: any) {
  monaco.editor.defineTheme('codecraft-brutal', codecraftMonacoTheme)
  monaco.editor.setTheme('codecraft-brutal')
}
