import { describe, expect, test } from 'vitest'
import { parseCodeParams } from './code.service.js'

describe('parseCodeParams', () => {
  test('parses valid params', () => {
    expect(parseCodeParams({ problemId: '12', language: 'typescript' })).toEqual({
      problemId: 12,
      language: 'typescript',
    })
  })

  test('throws for invalid problem id', () => {
    expect(() => parseCodeParams({ problemId: 'nope', language: 'javascript' })).toThrow(
      'Invalid problem ID'
    )
  })

  test('throws for invalid language', () => {
    expect(() => parseCodeParams({ problemId: '1', language: 'ruby' })).toThrow(
      'Invalid language'
    )
  })
})
