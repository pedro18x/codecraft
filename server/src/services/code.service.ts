import { prisma } from '../config/database.js'
import { ApiError } from '../utils/apiResponse.js'

const VALID_LANGUAGES = ['javascript', 'typescript', 'python'] as const

export type CodeLanguage = (typeof VALID_LANGUAGES)[number]

export interface CodeParams {
  problemId: number
  language: CodeLanguage
}

export function parseCodeParams(params: { problemId: string; language: string }): CodeParams {
  const problemId = Number.parseInt(params.problemId, 10)
  if (Number.isNaN(problemId) || problemId <= 0) {
    throw new ApiError('VALIDATION_ERROR', 'Invalid problem ID', 400)
  }

  const language = params.language
  if (!VALID_LANGUAGES.includes(language as CodeLanguage)) {
    throw new ApiError('VALIDATION_ERROR', 'Invalid language', 400)
  }

  return { problemId, language: language as CodeLanguage }
}

export async function getSavedCode(userId: number, params: CodeParams) {
  const saved = await prisma.savedCode.findUnique({
    where: {
      userId_problemId_language: {
        userId,
        problemId: params.problemId,
        language: params.language,
      },
    },
  })

  return saved?.code ?? null
}

export async function saveCode(userId: number, params: CodeParams, code: string) {
  return prisma.savedCode.upsert({
    where: {
      userId_problemId_language: {
        userId,
        problemId: params.problemId,
        language: params.language,
      },
    },
    update: { code },
    create: {
      userId,
      problemId: params.problemId,
      language: params.language,
      code,
    },
  })
}
