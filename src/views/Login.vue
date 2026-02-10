<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import BrutalInput from '../components/brutal/BrutalInput.vue'
import BrutalButton from '../components/brutal/BrutalButton.vue'
import BrutalCard from '../components/brutal/BrutalCard.vue'

const router = useRouter()
const { login, error: authError, isLoading } = useAuth()

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
  formError.value = 'Social login is coming soon.'
}
</script>

<template>
  <div class="auth-page mesh-bg">
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
                {{ showPassword ? '🙈' : '👁' }}
              </button>
            </template>
          </BrutalInput>

          <p v-if="formError" class="auth-error">{{ formError }}</p>

          <BrutalButton type="submit" variant="primary" size="lg" :loading="isLoading" block>
            {{ isLoading ? 'Logging in...' : 'Log in' }}
          </BrutalButton>

          <div class="social-row">
            <BrutalButton type="button" variant="ghost" size="sm" @click="socialUnavailable">
              GitHub
            </BrutalButton>
            <BrutalButton type="button" variant="ghost" size="sm" @click="socialUnavailable">
              Google
            </BrutalButton>
          </div>
        </form>

        <p class="auth-switch">
          New here?
          <button type="button" class="auth-link" @click="goToRegister">Create account</button>
        </p>
      </BrutalCard>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.2rem;
}

.auth-layout {
  width: min(70rem, 100%);
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 1rem;
}

.auth-illustration {
  border: 4px solid var(--color-ink);
  box-shadow: 8px 8px 0 0 var(--color-ink);
  background: var(--color-cream);
  padding: 1.2rem;
}

.auth-brand {
  font-family: var(--font-display);
  font-size: clamp(2.1rem, 5vw, 3.3rem);
  line-height: 1;
}

.auth-kicker {
  margin-top: 0.7rem;
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: var(--color-coral);
}

.auth-copy {
  margin-top: 0.35rem;
  max-width: 32ch;
  color: var(--color-text-secondary);
}

.auth-visual {
  margin-top: 1rem;
  display: grid;
  gap: 0.6rem;
}

.chip {
  width: fit-content;
  border: 3px solid var(--color-ink);
  box-shadow: 4px 4px 0 0 var(--color-ink);
  padding: 0.45rem 0.6rem;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  background: var(--color-white);
}

.chip--one {
  background: var(--color-yellow);
  transform: rotate(-1.5deg);
}

.chip--two {
  background: var(--color-turquoise);
  transform: rotate(1deg);
}

.chip--three {
  background: var(--color-coral);
  color: var(--color-white);
  transform: rotate(-0.5deg);
}

.auth-form-card {
  background: var(--color-white);
}

.auth-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  line-height: 1;
}

.auth-subtitle {
  margin-top: 0.35rem;
  color: var(--color-text-secondary);
}

.auth-form {
  margin-top: 1rem;
  display: grid;
  gap: 0.75rem;
}

.auth-eye {
  pointer-events: auto;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.auth-error {
  border: 3px solid var(--color-coral);
  background: #fff2f2;
  color: #b53131;
  padding: 0.5rem 0.6rem;
  font-size: var(--text-sm);
}

.social-row {
  display: flex;
  gap: 0.5rem;
}

.auth-switch {
  margin-top: 0.9rem;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.auth-link {
  margin-left: 0.3rem;
  border: 0;
  background: transparent;
  color: var(--color-coral);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
}

@media (max-width: 880px) {
  .auth-layout {
    grid-template-columns: 1fr;
  }

  .auth-illustration {
    order: 2;
  }

  .auth-form-card {
    order: 1;
  }
}
</style>
