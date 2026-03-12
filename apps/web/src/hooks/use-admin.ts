'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

// Dashboard
export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => api.get<{
      totalUsers: number
      totalProblems: number
      totalSubmissions: number
      successRate: number
      problemsByDifficulty: Record<string, number>
      recentUsers: { id: number; username: string; email: string; role: string; createdAt: string }[]
      recentSubmissions: {
        id: number; language: string; success: boolean; executionTimeMs: number | null; createdAt: string
        user: { username: string }; problem: { title: string }
      }[]
    }>('/admin/dashboard'),
  })
}

// Users
interface AdminUsersParams { page?: number; limit?: number; search?: string; role?: string }

export function useAdminUsers(params: AdminUsersParams = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.search) query.set('search', params.search)
  if (params.role) query.set('role', params.role)
  const qs = query.toString()

  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => api.get<{
      users: {
        id: number; email: string; username: string; role: string
        createdAt: string; updatedAt: string
        _count: { submissions: number; progress: number }
      }[]
      total: number; page: number; totalPages: number
    }>(`/admin/users${qs ? `?${qs}` : ''}`),
  })
}

export function useAdminUser(id: number) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => api.get<{
      id: number; email: string; username: string; role: string
      createdAt: string; updatedAt: string
      _count: { submissions: number; progress: number }
    }>(`/admin/users/${id}`),
    enabled: id > 0,
  })
}

export function useUpdateUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) =>
      api.patch(`/admin/users/${id}/role`, { role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

// Problems
interface AdminProblemsParams { page?: number; limit?: number; search?: string; difficulty?: string }

export function useAdminProblems(params: AdminProblemsParams = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.search) query.set('search', params.search)
  if (params.difficulty) query.set('difficulty', params.difficulty)
  const qs = query.toString()

  return useQuery({
    queryKey: ['admin', 'problems', params],
    queryFn: () => api.get<{
      problems: {
        id: number; title: string; slug: string; difficulty: string
        categories: string[]; createdAt: string
        _count: { submissions: number }
      }[]
      total: number; page: number; totalPages: number
    }>(`/admin/problems${qs ? `?${qs}` : ''}`),
  })
}

export function useCreateProblem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/admin/problems', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'problems'] })
      qc.invalidateQueries({ queryKey: ['problems'] })
    },
  })
}

export function useUpdateProblem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      api.put(`/admin/problems/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'problems'] })
      qc.invalidateQueries({ queryKey: ['problems'] })
    },
  })
}

export function useDeleteProblem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/admin/problems/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'problems'] })
      qc.invalidateQueries({ queryKey: ['problems'] })
    },
  })
}

// Submissions
interface AdminSubmissionsParams {
  page?: number; limit?: number; userId?: number; problemId?: number
  success?: boolean; language?: string
}

export function useAdminSubmissions(params: AdminSubmissionsParams = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.userId) query.set('userId', String(params.userId))
  if (params.problemId) query.set('problemId', String(params.problemId))
  if (params.success !== undefined) query.set('success', String(params.success))
  if (params.language) query.set('language', params.language)
  const qs = query.toString()

  return useQuery({
    queryKey: ['admin', 'submissions', params],
    queryFn: () => api.get<{
      submissions: {
        id: number; language: string; success: boolean; executionTimeMs: number | null; createdAt: string
        user: { id: number; username: string }; problem: { id: number; title: string }
      }[]
      total: number; page: number; totalPages: number
    }>(`/admin/submissions${qs ? `?${qs}` : ''}`),
  })
}

export function useAdminSubmission(id: number) {
  return useQuery({
    queryKey: ['admin', 'submissions', id],
    queryFn: () => api.get<{
      id: number; language: string; code: string; success: boolean
      testResults: unknown; executionTimeMs: number | null; createdAt: string
      user: { id: number; username: string }; problem: { id: number; title: string }
    }>(`/admin/submissions/${id}`),
    enabled: id > 0,
  })
}
