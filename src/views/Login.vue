<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import Text from '../design-system/components/Text.vue'
import Button from '../design-system/components/Button.vue'

const router = useRouter()
const { login, error: authError, isLoading } = useAuth()

const email = ref('')
const password = ref('')
const formError = ref<string | null>(null)

const handleSubmit = async () => {
  formError.value = null

  if (!email.value || !password.value) {
    formError.value = 'Please fill in all fields'
    return
  }

  try {
    await login(email.value, password.value)
    router.push('/dashboard')
  } catch {
    formError.value = authError.value
  }
}
</script>

<template>
  <div class="auth-page">
    <!-- Decorative -->
    <div class="auth-deco auth-deco--1" />
    <div class="auth-deco auth-deco--2" />

    <div class="auth-container">
      <!-- Left: Branding -->
      <div class="auth-brand">
        <router-link to="/" class="auth-brand__logo">
          <Text as="div" variant="hero" weight="extrabold" class="auth-brand__name">
            Code<span class="auth-brand__accent">Craft</span>
          </Text>
        </router-link>
        <Text variant="body" class="auth-brand__tagline">
          Master technical interviews with bold, hands-on practice.
        </Text>
      </div>

      <!-- Right: Form -->
      <div class="auth-form-card">
        <div class="auth-form-header">
          <Text as="h1" variant="h2" weight="bold">Welcome back</Text>
          <Text variant="muted">Sign in to sync your progress</Text>
        </div>

        <form class="auth-form" @submit.prevent="handleSubmit">
          <div class="auth-field">
            <Text as="label" variant="body-sm" weight="semibold" class="auth-label" for="email">
              Email
            </Text>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="auth-input"
              autocomplete="email"
            />
          </div>

          <div class="auth-field">
            <Text as="label" variant="body-sm" weight="semibold" class="auth-label" for="password">
              Password
            </Text>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="At least 8 characters"
              class="auth-input"
              autocomplete="current-password"
            />
          </div>

          <div v-if="formError" class="auth-error">
            <Text variant="body-sm">{{ formError }}</Text>
          </div>

          <Button
            variant="primary"
            size="lg"
            :disabled="isLoading"
            :loading="isLoading"
            @click="handleSubmit"
          >
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </Button>

          <div class="auth-footer">
            <Text variant="body-sm" class="auth-footer__text">
              Don't have an account?
            </Text>
            <router-link to="/register" class="auth-link">
              <Text variant="body-sm" weight="bold">Sign up</Text>
            </router-link>
          </div>
        </form>

        <div class="auth-skip">
          <router-link to="/dashboard" class="auth-skip-link">
            Continue without an account
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  position: relative;
  overflow: hidden;
}

.auth-deco {
  position: absolute;
  border: var(--border-width) solid var(--color-ink);
  z-index: 0;
}

.auth-deco--1 {
  width: 200px;
  height: 200px;
  background-color: var(--color-yellow);
  opacity: 0.15;
  bottom: -60px;
  left: -60px;
  transform: rotate(15deg);
}

.auth-deco--2 {
  width: 140px;
  height: 140px;
  background-color: var(--color-turquoise);
  opacity: 0.15;
  top: -40px;
  right: -40px;
  transform: rotate(-10deg);
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  max-width: 900px;
  width: 100%;
  align-items: center;
  z-index: 1;
  position: relative;
}

@media (max-width: 768px) {
  .auth-container {
    grid-template-columns: 1fr;
    gap: var(--space-8);
    max-width: 440px;
  }

  .auth-brand {
    text-align: center;
  }
}

/* ── Brand side ── */
.auth-brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.auth-brand__logo {
  text-decoration: none;
}

.auth-brand__name {
  color: var(--color-text-primary);
}

.auth-brand__accent {
  color: var(--color-coral);
}

.auth-brand__tagline {
  color: var(--color-text-secondary);
  max-width: 320px;
}

/* ── Form Card ── */
.auth-form-card {
  background-color: var(--color-surface);
  border: var(--border-thick) solid var(--color-ink);
  box-shadow: var(--shadow-brutal-lg);
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  animation: slideUp 0.4s ease-out both;
}

.auth-form-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.auth-label {
  color: var(--color-text-primary);
}

.auth-input {
  height: 3rem;
  padding: 0 var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  background-color: var(--color-background);
  border: var(--border-width) solid var(--color-ink);
  transition: box-shadow var(--duration-fast) var(--ease);
}

.auth-input:focus {
  outline: none;
  box-shadow: var(--shadow-brutal-sm);
}

.auth-input::placeholder {
  color: var(--color-text-tertiary);
}

.auth-error {
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-error-bg);
  color: var(--color-coral);
  border: var(--border-thin) solid var(--color-coral);
  animation: shake 0.4s ease-in-out;
}

.auth-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.auth-footer__text {
  color: var(--color-text-secondary);
}

.auth-link {
  color: var(--color-coral);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: border-color var(--duration-fast) var(--ease);
}

.auth-link:hover {
  border-color: var(--color-coral);
}

.auth-skip {
  text-align: center;
  border-top: var(--border-thin) solid var(--color-border-subtle);
  padding-top: var(--space-6);
}

.auth-skip-link {
  color: var(--color-text-tertiary);
  text-decoration: none;
  font-size: var(--text-sm);
  border-bottom: 1px dashed var(--color-text-tertiary);
  transition: color var(--duration-fast) var(--ease);
}

.auth-skip-link:hover {
  color: var(--color-text-primary);
  border-color: var(--color-text-primary);
}
</style>
