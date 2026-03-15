'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import {
  ProfileSchema,
  ActivityHeatmapSchema,
  StreakSchema,
  SubmissionAnalyticsSchema,
  type Profile,
  type ActivityHeatmap,
  type Streak,
  type SubmissionAnalytics,
} from '@/types/api'

export function useProfile() {
  return useQuery<Profile>({
    queryKey: queryKeys.profile.detail(),
    queryFn: async () => {
      const data = await api.get<unknown>('/profile')
      return ProfileSchema.parse(data)
    },
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: Partial<Pick<Profile, 'bio' | 'avatarColor' | 'githubUrl' | 'linkedinUrl' | 'websiteUrl'>>) => {
      const data = await api.patch<unknown>('/profile', input)
      return ProfileSchema.parse(data)
    },
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.profile.detail(), updated)
    },
  })
}

export function useActivityHeatmap(year: number) {
  return useQuery<ActivityHeatmap>({
    queryKey: queryKeys.activity.heatmap(year),
    queryFn: async () => {
      const data = await api.get<unknown>(`/activity/heatmap?year=${year}`)
      return ActivityHeatmapSchema.parse(data)
    },
  })
}

export function useStreak() {
  return useQuery<Streak>({
    queryKey: queryKeys.activity.streak(),
    queryFn: async () => {
      const data = await api.get<unknown>('/activity/streak')
      return StreakSchema.parse(data)
    },
  })
}

export function useSubmissionAnalytics() {
  return useQuery<SubmissionAnalytics>({
    queryKey: queryKeys.analytics.submissions(),
    queryFn: async () => {
      const data = await api.get<unknown>('/analytics/submissions')
      return SubmissionAnalyticsSchema.parse(data)
    },
  })
}
