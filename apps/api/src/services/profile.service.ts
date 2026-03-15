import { prisma } from '../config/database.js'
import { ApiError } from '../utils/apiResponse.js'

const PROFILE_SELECT = {
  id: true,
  email: true,
  username: true,
  bio: true,
  avatarColor: true,
  githubUrl: true,
  linkedinUrl: true,
  websiteUrl: true,
  createdAt: true,
} as const

export async function getProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: PROFILE_SELECT,
  })

  if (!user) {
    throw new ApiError('NOT_FOUND', 'User not found', 404)
  }

  return user
}

interface UpdateProfileInput {
  bio?: string | null
  avatarColor?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  websiteUrl?: string | null
}

export async function updateProfile(userId: number, data: UpdateProfileInput) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: PROFILE_SELECT,
  })

  return user
}
