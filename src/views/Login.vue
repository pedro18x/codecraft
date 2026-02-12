<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useTheme } from '../composables/useTheme'
import BrutalInput from '../components/brutal/BrutalInput.vue'
import BrutalButton from '../components/brutal/BrutalButton.vue'
import BrutalCard from '../components/brutal/BrutalCard.vue'

const router = useRouter()
const { login, error: authError, isLoading } = useAuth()
const { theme, toggleTheme } = useTheme()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const formError = ref<string>('')

const handleSubmit = async () => {
  formError.value = ''

  if (!email.value || !password.value) {
    formError.value = 'Please fill in all fields.'
    return
  }

  try {
    await login(email.value, password.value)
    router.push('/dashboard')
  } catch {
    formError.value = authError.value ?? 'Login failed.'
  }
}

const goToRegister = () => {
  router.push('/register')
}

const socialUnavailable = () => {
  // No-op — social login not yet implemented
}

const themeLabel = computed(() => `Theme: ${theme.value === 'dark' ? 'Dark' : 'Light'}`)
</script>

<template>
  <div class="auth-page mesh-bg">
    <header class="neo-nav neo-nav--shell auth-nav" data-testid="auth-nav">
      <div class="neo-nav__inner">
        <router-link class="neo-nav__brand" to="/">
          <span class="neo-nav__brand-dot" />
          CodeCraft
        </router-link>

        <nav class="neo-nav__links" aria-label="Auth navigation">
          <router-link class="neo-nav__link" to="/">Home</router-link>
        </nav>

        <div class="neo-nav__actions">
          <button class="neo-nav__theme-toggle" type="button" :aria-label="themeLabel" @click="toggleTheme">
            <span class="neo-nav__theme-label">{{ themeLabel }}</span>
            <svg
              v-if="theme === 'dark'"
              class="neo-nav__theme-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg
              v-else
              class="neo-nav__theme-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          <router-link class="neo-nav__auth-link" to="/register">Create account</router-link>
        </div>
      </div>
    </header>

    <div class="auth-page__content">
      <div class="auth-layout">
        <section class="auth-illustration animate-rise-in">
          <h1 class="auth-brand">CodeCraft</h1>
          <p class="auth-kicker">Welcome back</p>
          <p class="auth-copy">Jump into your workspace and keep your streak alive.</p>

          <div class="auth-visual" aria-hidden="true">
            <div class="chip chip--one">function solve()</div>
            <div class="chip chip--two">while (practice)</div>
            <div class="chip chip--three">return growth</div>
          </div>
        </section>

        <BrutalCard variant="elevated" padding="lg" class="auth-form-card animate-rise-in">
          <h2 class="auth-title">Sign in</h2>
          <p class="auth-subtitle">Track your progress and compete on leaderboard.</p>

          <form class="auth-form" @submit.prevent="handleSubmit">
            <BrutalInput
              v-model="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              :error="!email && formError ? 'Email is required.' : ''"
            />

            <BrutalInput
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              placeholder="Your password"
              :error="!password && formError ? 'Password is required.' : ''"
            >
              <template #icon>
                <button
                  type="button"
                  class="auth-eye"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="showPassword = !showPassword"
                >
                  <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </template>
            </BrutalInput>

            <p v-if="formError" class="auth-error">{{ formError }}</p>

            <BrutalButton type="submit" variant="primary" size="lg" :loading="isLoading" block>
              {{ isLoading ? 'Logging in...' : 'Log in' }}
            </BrutalButton>

            <div class="social-row">
              <BrutalButton type="button" variant="secondary" size="sm" @click="socialUnavailable">
                <template #left-icon>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </template>
                GitHub
              </BrutalButton>
              <BrutalButton type="button" variant="secondary" size="sm" @click="socialUnavailable">
                <template #left-icon>
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </template>
                Google
              </BrutalButton>
            </div>
            <p class="social-hint">Social login coming soon</p>
          </form>

          <p class="auth-switch">
            New here?
            <button type="button" class="auth-link" @click="goToRegister">Create account</button>
          </p>

          <p class="auth-home-return">
            <router-link to="/" class="auth-home-link">Back to home</router-link>
          </p>
        </BrutalCard>
      </div>
    </div>
  </div>
</template>

<style src="../assets/styles/auth.css" />
