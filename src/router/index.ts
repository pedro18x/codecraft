import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: () => import('../views/Landing.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: () => import('../views/Leaderboard.vue'),
  },
  {
    path: '/practice/:slug',
    name: 'practice',
    component: () => import('../views/Practice.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
