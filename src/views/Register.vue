<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import BrutalInput from '../components/brutal/BrutalInput.vue'
import BrutalButton from '../components/brutal/BrutalButton.vue'
import BrutalCard from '../components/brutal/BrutalCard.vue'

const router = useRouter()
const { register, error: authError, isLoading } = useAuth()

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
</script>

<template>
  <div class="auth-page mesh-bg">
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
                {{ showPassword ? '🙈' : '👁' }}
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
  width: min(74rem, 100%);
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 1rem;
}

.auth-illustration {
  border: 4px solid var(--color-border-strong);
  box-shadow: 8px 8px 0 0 var(--color-shadow-strong);
  background: var(--surface-auth-illustration);
  padding: 1.2rem;
}

.auth-brand {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.1rem, 5vw, 3.2rem);
  line-height: 1;
}

.auth-kicker {
  margin: 0.7rem 0 0;
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: var(--color-primary);
}

.auth-copy {
  margin: 0.35rem 0 0;
  color: var(--color-text-secondary);
  max-width: 36ch;
}

.auth-visual {
  margin-top: 1rem;
  display: grid;
  gap: 0.6rem;
}

.chip {
  width: fit-content;
  border: 3px solid var(--color-border-strong);
  box-shadow: 4px 4px 0 0 var(--color-shadow-strong);
  padding: 0.45rem 0.6rem;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  background: var(--color-surface-raised);
}

.chip--one {
  background: var(--color-yellow);
  transform: rotate(-1.5deg);
}

.chip--two {
  background: var(--color-secondary);
  transform: rotate(1deg);
}

.chip--three {
  background: var(--color-danger);
  color: var(--color-on-danger);
  transform: rotate(-0.5deg);
}

.auth-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  line-height: 1;
}

.auth-subtitle {
  margin: 0.35rem 0 0;
  color: var(--color-text-secondary);
}

.auth-form {
  margin-top: 1rem;
  display: grid;
  gap: 0.75rem;
}

.auth-eye {
  border: 0;
  background: transparent;
  cursor: pointer;
}

.auth-error {
  border: 3px solid var(--color-error);
  background: var(--color-error-bg);
  color: var(--color-error);
  padding: 0.5rem 0.6rem;
  font-size: var(--text-sm);
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
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
}

.auth-link:focus-visible,
.auth-eye:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
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
