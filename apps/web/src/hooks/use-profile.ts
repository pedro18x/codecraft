'use client'

import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query'
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

export function useActivityHeatmap() {
  // The rolling 52-week window may span two calendar years, so fetch both and merge
  const currentYear = new Date().getFullYear()
  const years = [currentYear - 1, currentYear]

  const results = useQueries({
    queries: years.map((year) => ({
      queryKey: queryKeys.activity.heatmap(year),
      queryFn: async () => {
        const data = await api.get<unknown>(`/activity/heatmap?year=${year}`)
        return ActivityHeatmapSchema.parse(data)
      },
    })),
  })

  const allLoaded = results.every((r) => r.data !== undefined)
  const isLoading = results.some((r) => r.isLoading)

  const data: ActivityHeatmap | undefined = allLoaded
    ? { days: results.flatMap((r) => r.data!.days) }
    : results[1]?.data

  return { data, isLoading }
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
