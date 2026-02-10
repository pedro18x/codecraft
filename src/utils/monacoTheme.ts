export const codecraftMonacoTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '8B95AA', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'C94752', fontStyle: 'bold' },
    { token: 'string', foreground: '35CFC1' },
    { token: 'number', foreground: 'F5C84C' },
    { token: 'type.identifier', foreground: '7C93E8' },
  ],
  colors: {
    'editor.background': '#121722',
    'editor.foreground': '#FFFEF9',
    'editor.lineHighlightBackground': '#1F2735',
    'editorCursor.foreground': '#F5C84C',
    'editor.selectionBackground': '#26324B',
    'editorLineNumber.foreground': '#72809A',
    'editorLineNumber.activeForeground': '#F5C84C',
    'editorIndentGuide.background1': '#2A3345',
    'editorIndentGuide.activeBackground1': '#3A4559',
  },
} as const

export async function applyCodecraftMonacoTheme(monaco: any) {
  monaco.editor.defineTheme('codecraft-brutal', codecraftMonacoTheme)
  monaco.editor.setTheme('codecraft-brutal')
}
