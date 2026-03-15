export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  problems: {
    list: ['problems', 'list'] as const,
    detail: (slug: string) => ['problems', 'detail', slug] as const,
  },
  progress: {
    map: (scope: 'guest' | 'user') => ['progress', scope] as const,
    stats: (scope: 'guest' | 'user') => ['progress', 'stats', scope] as const,
    entries: (scope: 'guest' | 'user') => ['progress', 'entries', scope] as const,
  },
  leaderboard: (type: string) => ['leaderboard', type] as const,
  profile: {
    detail: () => ['profile', 'detail'] as const,
  },
  activity: {
    heatmap: (year: number) => ['activity', 'heatmap', year] as const,
    streak: () => ['activity', 'streak'] as const,
  },
  analytics: {
    submissions: () => ['analytics', 'submissions'] as const,
  },
} as const
