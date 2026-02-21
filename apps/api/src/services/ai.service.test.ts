import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock openrouter before importing the service
vi.mock('../config/openrouter.js', () => ({
  openrouter: {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  },
  AI_MODELS: [
    'meta-llama/llama-3.3-70b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
  ],
}))

// Mock prisma
vi.mock('../config/database.js', () => ({
  prisma: {
    problem: {
      findUnique: vi.fn(),
    },
  },
}))

import { buildHintMessages, buildDiagnoseMessages } from './ai.service.js'

describe('buildHintMessages', () => {
  it('system prompt contains spoiler-guard rules', () => {
    const msgs = buildHintMessages({
      title: 'Two Sum',
      description: 'Find two numbers...',
      constraints: ['n >= 2'],
      hintLevel: 1,
    })
    const system = msgs.find((m) => m.role === 'system')!.content as string
    expect(system).toContain('NEVER write complete working code')
    expect(system).toContain('NEVER reveal the full algorithm')
  })

  it('level 1 user prompt mentions Level 1', () => {
    const msgs = buildHintMessages({
      title: 'Two Sum',
      description: 'Find two numbers...',
      constraints: ['n >= 2'],
      hintLevel: 1,
    })
    const user = msgs.find((m) => m.role === 'user')!.content as string
    expect(user).toContain('Level 1')
  })

  it('level 3 user prompt mentions Level 3', () => {
    const msgs = buildHintMessages({
      title: 'Two Sum',
      description: 'Find two numbers...',
      constraints: ['n >= 2'],
      hintLevel: 3,
    })
    const user = msgs.find((m) => m.role === 'user')!.content as string
    expect(user).toContain('Level 3')
  })
})

describe('buildDiagnoseMessages', () => {
  it('user code is wrapped in sentinel boundary', () => {
    const msgs = buildDiagnoseMessages({
      title: 'Two Sum',
      description: 'Find two numbers...',
      constraints: ['n >= 2'],
      code: 'function twoSum() { return 42 }',
      language: 'javascript',
      failingTestCase: { input: '[2,7]', expectedOutput: '0,1' },
      errorMessage: 'Wrong answer',
    })
    const user = msgs.find((m) => m.role === 'user')!.content as string
    expect(user).toContain('<USER_CODE_START>')
    expect(user).toContain('<USER_CODE_END>')
    expect(user).toContain('function twoSum() { return 42 }')
  })

  it('system prompt tells model to treat code as untrusted', () => {
    const msgs = buildDiagnoseMessages({
      title: 'Two Sum',
      description: 'Find two numbers...',
      constraints: [],
      code: 'x',
      language: 'python',
    })
    const system = msgs.find((m) => m.role === 'system')!.content as string
    expect(system).toContain('untrusted')
  })
})

import { prisma } from '../config/database.js'
import { openrouter } from '../config/openrouter.js'
import { streamAiHint } from './ai.service.js'

// Helper to create a fake Express Response for SSE
function makeFakeRes() {
  const written: string[] = []
  return {
    setHeader: vi.fn(),
    flushHeaders: vi.fn(),
    write: vi.fn((data: string) => written.push(data)),
    end: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    _written: written,
  }
}

describe('streamAiHint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws ApiError 404 when problem not found', async () => {
    vi.mocked(prisma.problem.findUnique).mockResolvedValue(null)
    const fakeRes = makeFakeRes()
    await expect(
      streamAiHint({ problemId: 999, mode: 'hint', hintLevel: 1 }, fakeRes as any)
    ).rejects.toThrow('Problem not found')
  })

  it('sets SSE headers and streams tokens', async () => {
    vi.mocked(prisma.problem.findUnique).mockResolvedValue({
      title: 'Two Sum',
      description: 'Find two numbers',
      constraints: ['n >= 2'],
    } as any)

    async function* mockChunks() {
      yield { choices: [{ delta: { content: 'Think ' } }] }
      yield { choices: [{ delta: { content: 'carefully.' } }] }
    }
    const mockStream = Object.assign(mockChunks(), { controller: { abort: vi.fn() } })
    vi.mocked(openrouter.chat.completions.create).mockResolvedValue(mockStream as any)

    const fakeRes = makeFakeRes()
    await streamAiHint({ problemId: 1, mode: 'hint', hintLevel: 1 }, fakeRes as any)

    expect(fakeRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream')
    expect(fakeRes._written.some((d) => d.includes('"token"'))).toBe(true)
    expect(fakeRes._written.some((d) => d.includes('"done":true'))).toBe(true)
    expect(fakeRes.end).toHaveBeenCalled()
  })

  it('falls back to second model when first throws', async () => {
    vi.mocked(prisma.problem.findUnique).mockResolvedValue({
      title: 'Two Sum',
      description: 'Find two numbers',
      constraints: [],
    } as any)

    const createMock = vi.mocked(openrouter.chat.completions.create)
    createMock.mockRejectedValueOnce(new Error('Service unavailable'))

    async function* mockChunks() {
      yield { choices: [{ delta: { content: 'Hint.' } }] }
    }
    const mockStream = Object.assign(mockChunks(), { controller: { abort: vi.fn() } })
    createMock.mockResolvedValueOnce(mockStream as any)

    const fakeRes = makeFakeRes()
    await streamAiHint({ problemId: 1, mode: 'hint', hintLevel: 1 }, fakeRes as any)

    expect(createMock).toHaveBeenCalledTimes(2)
    expect(fakeRes.end).toHaveBeenCalled()
  })
})
