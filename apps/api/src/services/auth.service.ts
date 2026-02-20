import { createHash, randomUUID } from 'node:crypto'
import { prisma } from '../config/database.js'
import { env } from '../config/env.js'
import { hashPassword, comparePassword } from '../utils/bcrypt.js'
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type RefreshTokenPayload,
} from '../utils/jwt.js'
import { ApiError } from '../utils/apiResponse.js'
import { parseDurationToMs } from '../utils/duration.js'

function hashRefreshToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

interface RegisterInput {
  email: string
  username: string
  password: string
}

interface LoginInput {
  email: string
  password: string
}

interface AuthResult {
  user: { id: number; email: string; username: string; createdAt: Date }
  accessToken: string
  refreshToken: string
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: input.email }, { username: input.username }] },
  })

  if (existing) {
    const field = existing.email === input.email ? 'email' : 'username'
    throw new ApiError('DUPLICATE', `A user with this ${field} already exists`, 409)
  }

  const hashed = await hashPassword(input.password)

  const user = await prisma.user.create({
    data: {
      email: input.email,
      username: input.username,
      password: hashed,
    },
    select: { id: true, email: true, username: true, createdAt: true },
  })

  const tokens = await generateTokens(user)

  return { user, ...tokens }
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  })

  if (!user) {
    throw new ApiError('INVALID_CREDENTIALS', 'Invalid email or password', 401)
  }

  const valid = await comparePassword(input.password, user.password)
  if (!valid) {
    throw new ApiError('INVALID_CREDENTIALS', 'Invalid email or password', 401)
  }

  const tokens = await generateTokens(user)

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    },
    ...tokens,
  }
}

export async function refresh(refreshTokenValue: string): Promise<{ accessToken: string; refreshToken: string }> {
  // Verify the JWT itself
  let payload: RefreshTokenPayload
  try {
    payload = verifyRefreshToken(refreshTokenValue)
  } catch {
    throw new ApiError('INVALID_TOKEN', 'Invalid refresh token', 401)
  }

  // Check the token exists in DB (not revoked)
  const refreshTokenHash = hashRefreshToken(refreshTokenValue)
  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenHash },
  })

  if (!stored || stored.expiresAt < new Date() || stored.revokedAt) {
    if (stored) {
      await revokeTokenFamily(stored.userId, stored.tokenFamily)
    }
    throw new ApiError('TOKEN_EXPIRED', 'Refresh token expired', 401)
  }

  if (stored.userId !== payload.userId) {
    await revokeTokenFamily(stored.userId, stored.tokenFamily)
    throw new ApiError('INVALID_TOKEN', 'Invalid refresh token', 401)
  }

  if (stored.tokenFamily !== payload.tokenFamily || stored.tokenVersion !== payload.tokenVersion) {
    await revokeTokenFamily(stored.userId, stored.tokenFamily)
    throw new ApiError('INVALID_TOKEN', 'Refresh token family mismatch', 401)
  }

  // Revoke old token (rotation with reuse detection metadata preserved)
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  })

  // Get fresh user data
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, username: true },
  })

  if (!user) {
    throw new ApiError('USER_NOT_FOUND', 'User no longer exists', 401)
  }

  return generateTokens(user, {
    tokenFamily: stored.tokenFamily,
    tokenVersion: stored.tokenVersion + 1,
  })
}

export async function logout(refreshTokenValue: string, userId: number): Promise<void> {
  // Only revoke the token if it belongs to the authenticated user
  const refreshTokenHash = hashRefreshToken(refreshTokenValue)
  await prisma.refreshToken.updateMany({
    where: { token: refreshTokenHash, userId, revokedAt: null },
    data: { revokedAt: new Date() },
  })
}

export async function revokeRefreshToken(refreshTokenValue: string): Promise<void> {
  const refreshTokenHash = hashRefreshToken(refreshTokenValue)
  const token = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenHash },
    select: { userId: true, tokenFamily: true },
  })

  if (!token) {
    return
  }

  await revokeTokenFamily(token.userId, token.tokenFamily)
}

async function revokeTokenFamily(userId: number, tokenFamily: string) {
  await prisma.refreshToken.updateMany({
    where: { userId, tokenFamily, revokedAt: null },
    data: { revokedAt: new Date() },
  })
}

async function generateTokens(
  user: { id: number; email: string; username: string },
  tokenSeed?: { tokenFamily: string; tokenVersion: number }
) {
  const tokenFamily = tokenSeed?.tokenFamily ?? randomUUID()
  const tokenVersion = tokenSeed?.tokenVersion ?? 1

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    username: user.username,
  }

  const accessToken = signAccessToken(tokenPayload)
  const refreshTokenValue = signRefreshToken({
    ...tokenPayload,
    tokenFamily,
    tokenVersion,
  })
  const refreshTokenHash = hashRefreshToken(refreshTokenValue)

  // Store refresh token in DB for revocation support
  await prisma.refreshToken.create({
    data: {
      token: refreshTokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN)),
      tokenFamily,
      tokenVersion,
    },
  })

  return { accessToken, refreshToken: refreshTokenValue }
}

// Cleanup expired refresh tokens (call periodically)
export async function cleanupExpiredTokens(): Promise<number> {
  const { count } = await prisma.refreshToken.deleteMany({
    where: {
      OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }],
    },
  })
  return count
}
