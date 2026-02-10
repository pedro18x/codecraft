import ts from 'typescript'

type TranspileResult =
  | { ok: true; code: string }
  | { ok: false; error: string }

export function transpileTypeScript(code: string): TranspileResult {
  const result = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ES2020,
    },
  })

  const diagnostics =
    result.diagnostics?.filter((d) => d.category === ts.DiagnosticCategory.Error) || []

  if (diagnostics.length > 0) {
    const first = diagnostics[0]
    const message = ts.flattenDiagnosticMessageText(first.messageText, '\n')
    return { ok: false, error: `TypeScript compile error: ${message}` }
  }

  return { ok: true, code: result.outputText }
}
