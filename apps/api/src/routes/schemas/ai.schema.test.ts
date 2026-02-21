import { describe, it, expect } from 'vitest'
import { AiHintRequestSchema } from './ai.schema.js'

describe('AiHintRequestSchema', () => {
  it('accepts valid hint request', () => {
    expect(() =>
      AiHintRequestSchema.parse({ problemId: 1, mode: 'hint', hintLevel: 1 })
    ).not.toThrow()
  })

  it('accepts valid diagnose request', () => {
    expect(() =>
      AiHintRequestSchema.parse({
        problemId: 1,
        mode: 'diagnose',
        code: 'function foo() {}',
        language: 'javascript',
        failingTestCase: { input: '[1,2]', expectedOutput: '3' },
        errorMessage: 'TypeError',
      })
    ).not.toThrow()
  })

  it('rejects unknown mode', () => {
    expect(() =>
      AiHintRequestSchema.parse({ problemId: 1, mode: 'explain' })
    ).toThrow()
  })

  it('rejects hintLevel out of range', () => {
    expect(() =>
      AiHintRequestSchema.parse({ problemId: 1, mode: 'hint', hintLevel: 4 })
    ).toThrow()
  })

  it('rejects missing problemId', () => {
    expect(() =>
      AiHintRequestSchema.parse({ mode: 'hint', hintLevel: 1 })
    ).toThrow()
  })
})
