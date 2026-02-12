<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useTheme } from '../composables/useTheme'
import BrutalInput from '../components/brutal/BrutalInput.vue'
import BrutalButton from '../components/brutal/BrutalButton.vue'
import BrutalCard from '../components/brutal/BrutalCard.vue'

const router = useRouter()
const { register, error: authError, isLoading } = useAuth()
const { theme, toggleTheme } = useTheme()

const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const formError = ref('')

const handleSubmit = async () => {
  formError.value = ''

  if (!email.value || !username.value || !password.value || !confirmPassword.value) {
    formError.value = 'All fields are required.'
    return
  }

  if (password.value.length < 8) {
    formError.value = 'Password must be at least 8 characters.'
    return
  }

  if (password.value !== confirmPassword.value) {
    formError.value = 'Passwords do not match.'
    return
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username.value)) {
    formError.value = 'Username may contain letters, numbers, and underscores only.'
    return
  }

  try {
    await register(email.value, username.value, password.value)
    router.push('/dashboard')
  } catch {
    formError.value = authError.value ?? 'Registration failed.'
  }
}

const goToLogin = () => router.push('/login')
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

          <router-link class="neo-nav__auth-link" to="/login">Sign in</router-link>
        </div>
      </div>
    </header>

    <div class="auth-page__content">
      <div class="auth-layout">
        <section class="auth-illustration animate-rise-in">
          <h1 class="auth-brand">Join CodeCraft</h1>
          <p class="auth-kicker">Train with intent</p>
          <p class="auth-copy">Create an account to sync progress, keep streaks, and climb rankings.</p>

          <div class="auth-visual" aria-hidden="true">
            <div class="chip chip--one">rank++</div>
            <div class="chip chip--two">streak.lock()</div>
            <div class="chip chip--three">submit(solution)</div>
          </div>
        </section>

        <BrutalCard variant="elevated" padding="lg" class="auth-form-card animate-rise-in">
          <h2 class="auth-title">Create Account</h2>
          <p class="auth-subtitle">Your tactical coding workspace starts here.</p>

          <form class="auth-form" @submit.prevent="handleSubmit">
            <BrutalInput
              v-model="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
            />

            <BrutalInput
              v-model="username"
              label="Username"
              placeholder="craftcoder"
            />

            <BrutalInput
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              placeholder="At least 8 characters"
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

            <BrutalInput
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              label="Confirm Password"
              placeholder="Repeat password"
            />

            <p v-if="formError" class="auth-error">{{ formError }}</p>

            <BrutalButton type="submit" variant="primary" size="lg" :loading="isLoading" block>
              {{ isLoading ? 'Creating account...' : 'Create account' }}
            </BrutalButton>
          </form>

          <p class="auth-switch">
            Already have an account?
            <button type="button" class="auth-link" @click="goToLogin">Sign in</button>
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
