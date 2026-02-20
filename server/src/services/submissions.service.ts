import type { Prisma } from '@prisma/client'
import { prisma } from '../config/database.js'
import { logger } from '../utils/logger.js'
import type { ExecuteProblemCodeResult } from './execution.service.js'

interface SaveSubmissionInput {
  userId: number
  problemId: number
  language: 'javascript' | 'typescript' | 'python'
  code: string
  execution: ExecuteProblemCodeResult
}

export async function saveSubmissionAndProgress({
  userId,
  problemId,
  language,
  code,
  execution,
}: SaveSubmissionInput) {
  const submission = await prisma.submission.create({
    data: {
      userId,
      problemId,
      language,
      code,
      success: execution.success,
      testResults: execution.testResults as unknown as Prisma.InputJsonValue,
      executionTimeMs: execution.executionTimeMs,
    },
  })

  await prisma.progress.upsert({
    where: {
      userId_problemId: { userId, problemId },
    },
    update: {
      attempts: { increment: 1 },
      lastAttempt: new Date(),
      ...(execution.success ? { status: 'completed', completedAt: new Date() } : {}),
    },
    create: {
      userId,
      problemId,
      status: execution.success ? 'completed' : 'attempted',
      attempts: 1,
      lastAttempt: new Date(),
      ...(execution.success ? { completedAt: new Date() } : {}),
    },
  })

  if (execution.success) {
    logger.info('product_event', {
      event_name: 'problem_completed',
      userId,
      route: '/api/submissions',
      problemId,
      language,
    })
  }

  return {
    id: submission.id,
    success: execution.success,
    testResults: execution.testResults,
    executionTimeMs: execution.executionTimeMs,
  }
}

export function buildSubmissionWhereInput(userId: number, problemId?: number): Prisma.SubmissionWhereInput {
  return {
    userId,
    ...(problemId ? { problemId } : {}),
  }
}

export async function listSubmissions(userId: number, problemId?: number) {
  const where = buildSubmissionWhereInput(userId, problemId)

  return prisma.submission.findMany({
    where,
    select: {
      id: true,
      problemId: true,
      language: true,
      success: true,
      testResults: true,
      executionTimeMs: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}
