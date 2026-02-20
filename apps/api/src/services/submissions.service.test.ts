import { describe, expect, test } from 'vitest'
import { buildSubmissionWhereInput } from './submissions.service.js'

describe('buildSubmissionWhereInput', () => {
  test('builds user-only filter when no problem id', () => {
    expect(buildSubmissionWhereInput(10)).toEqual({ userId: 10 })
  })

  test('builds user + problem filter', () => {
    expect(buildSubmissionWhereInput(10, 3)).toEqual({
      userId: 10,
      problemId: 3,
    })
  })
})
