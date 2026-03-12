import { prisma } from '../config/database.js'
import { ApiError } from '../utils/apiResponse.js'

export async function getDashboardStats() {
  const [totalUsers, totalProblems, totalSubmissions, successfulSubmissions, problemsByDifficulty, recentUsers, recentSubmissions] =
    await Promise.all([
      prisma.user.count(),
      prisma.problem.count(),
      prisma.submission.count(),
      prisma.submission.count({ where: { success: true } }),
      prisma.problem.groupBy({
        by: ['difficulty'],
        _count: { id: true },
      }),
      prisma.user.findMany({
        select: { id: true, username: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.submission.findMany({
        select: {
          id: true,
          language: true,
          success: true,
          executionTimeMs: true,
          createdAt: true,
          user: { select: { username: true } },
          problem: { select: { title: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

  const successRate = totalSubmissions > 0
    ? Math.round((successfulSubmissions / totalSubmissions) * 10000) / 100
    : 0

  const difficultyMap: Record<string, number> = {}
  for (const row of problemsByDifficulty) {
    difficultyMap[row.difficulty] = row._count.id
  }

  return {
    totalUsers,
    totalProblems,
    totalSubmissions,
    successRate,
    problemsByDifficulty: difficultyMap,
    recentUsers,
    recentSubmissions,
  }
}

interface ListUsersParams {
  page: number
  limit: number
  search?: string
  role?: string
}

export async function listUsers({ page, limit, search, role }: ListUsersParams) {
  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { username: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (role) where.role = role

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, email: true, username: true, role: true,
        createdAt: true, updatedAt: true,
        _count: { select: { submissions: true, progress: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  return { users, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, email: true, username: true, role: true,
      createdAt: true, updatedAt: true,
      _count: { select: { submissions: true, progress: true } },
    },
  })
  if (!user) throw new ApiError('NOT_FOUND', 'User not found', 404)
  return user
}

export async function updateUserRole(id: number, role: string, adminId: number) {
  if (id === adminId) {
    throw new ApiError('FORBIDDEN', 'Cannot change your own role', 403)
  }
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new ApiError('NOT_FOUND', 'User not found', 404)

  return prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, email: true, username: true, role: true },
  })
}

export async function deleteUser(id: number, adminId: number) {
  if (id === adminId) {
    throw new ApiError('FORBIDDEN', 'Cannot delete your own account', 403)
  }
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new ApiError('NOT_FOUND', 'User not found', 404)

  await prisma.user.delete({ where: { id } })
}

interface ListProblemsParams {
  page: number
  limit: number
  search?: string
  difficulty?: string
}

export async function listProblems({ page, limit, search, difficulty }: ListProblemsParams) {
  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (difficulty) where.difficulty = difficulty

  const [problems, total] = await Promise.all([
    prisma.problem.findMany({
      where,
      select: {
        id: true, title: true, slug: true, difficulty: true,
        categories: true, createdAt: true,
        _count: { select: { submissions: true } },
      },
      orderBy: { id: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.problem.count({ where }),
  ])

  return { problems, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getProblemById(id: number) {
  const problem = await prisma.problem.findUnique({ where: { id } })
  if (!problem) throw new ApiError('NOT_FOUND', 'Problem not found', 404)
  return problem
}

export async function createProblem(data: {
  id: number
  title: string
  slug: string
  difficulty: string
  categories: string[]
  description: string
  examples: unknown
  constraints: string[]
  testCases: unknown
  starterCode: unknown
  hints: string[]
}) {
  const existing = await prisma.problem.findUnique({ where: { id: data.id } })
  if (existing) throw new ApiError('DUPLICATE', 'Problem with this ID already exists', 409)

  return prisma.problem.create({ data })
}

export async function updateProblem(id: number, data: Record<string, unknown>) {
  const existing = await prisma.problem.findUnique({ where: { id } })
  if (!existing) throw new ApiError('NOT_FOUND', 'Problem not found', 404)

  return prisma.problem.update({ where: { id }, data })
}

export async function deleteProblem(id: number) {
  const existing = await prisma.problem.findUnique({ where: { id } })
  if (!existing) throw new ApiError('NOT_FOUND', 'Problem not found', 404)

  await prisma.problem.delete({ where: { id } })
}

interface ListSubmissionsParams {
  page: number
  limit: number
  userId?: number
  problemId?: number
  success?: boolean
  language?: string
}

export async function listSubmissions({ page, limit, userId, problemId, success, language }: ListSubmissionsParams) {
  const where: Record<string, unknown> = {}
  if (userId) where.userId = userId
  if (problemId) where.problemId = problemId
  if (success !== undefined) where.success = success
  if (language) where.language = language

  const [submissions, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      select: {
        id: true, language: true, success: true, executionTimeMs: true, createdAt: true,
        user: { select: { id: true, username: true } },
        problem: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.submission.count({ where }),
  ])

  return { submissions, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getSubmissionById(id: number) {
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true } },
      problem: { select: { id: true, title: true } },
    },
  })
  if (!submission) throw new ApiError('NOT_FOUND', 'Submission not found', 404)
  return submission
}
