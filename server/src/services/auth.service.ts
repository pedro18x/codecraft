import { prisma } from '../config/database.js'
import { env } from '../config/env.js'
import { hashPassword, comparePassword } from '../utils/bcrypt.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js'
import { ApiError } from '../utils/apiResponse.js'

/** Parse duration strings like "7d", "24h", "30m" to milliseconds */
function parseDurationToMs(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/)
  if (!match) return 7 * 24 * 60 * 60 * 1000 // default 7 days
  const value = parseInt(match[1])
  const unit = match[2]
  switch (unit) {
    case 's': return value * 1000
    case 'm': return value * 60 * 1000
    case 'h': return value * 60 * 60 * 1000
    case 'd': return value * 24 * 60 * 60 * 1000
    default: return 7 * 24 * 60 * 60 * 1000
  }
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
  let payload
  try {
    payload = verifyRefreshToken(refreshTokenValue)
  } catch {
    throw new ApiError('INVALID_TOKEN', 'Invalid refresh token', 401)
  }

  // Check the token exists in DB (not revoked)
  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenValue },
  })

  if (!stored || stored.expiresAt < new Date()) {
    // Clean up expired token if it exists
    if (stored) {
      await prisma.refreshToken.delete({ where: { id: stored.id } })
    }
    throw new ApiError('TOKEN_EXPIRED', 'Refresh token expired', 401)
  }

  // Delete old token (rotation)
  await prisma.refreshToken.delete({ where: { id: stored.id } })

  // Get fresh user data
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, username: true },
  })

  if (!user) {
    throw new ApiError('USER_NOT_FOUND', 'User no longer exists', 401)
  }

  return generateTokens(user)
}

export async function logout(refreshTokenValue: string, userId: number): Promise<void> {
  // Only delete the token if it belongs to the authenticated user
  await prisma.refreshToken.deleteMany({
    where: { token: refreshTokenValue, userId },
  })
}

async function generateTokens(user: { id: number; email: string; username: string }) {
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    username: user.username,
  }

  const accessToken = signAccessToken(tokenPayload)
  const refreshTokenValue = signRefreshToken(tokenPayload)

  // Store refresh token in DB for revocation support
  await prisma.refreshToken.create({
    data: {
      token: refreshTokenValue,
      userId: user.id,
      expiresAt: new Date(Date.now() + parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN)),
    },
  })

  return { accessToken, refreshToken: refreshTokenValue }
}

// Cleanup expired refresh tokens (call periodically)
export async function cleanupExpiredTokens(): Promise<number> {
  const { count } = await prisma.refreshToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  })
  return count
}
