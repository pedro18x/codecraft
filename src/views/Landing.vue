<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import Button from '../design-system/components/Button.vue'
import Text from '../design-system/components/Text.vue'

const router = useRouter()
const { isAuthenticated } = useAuth()

const startPracticing = () => {
  router.push('/dashboard')
}

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="landing">
    <!-- Decorative elements -->
    <div class="landing__deco landing__deco--1" />
    <div class="landing__deco landing__deco--2" />
    <div class="landing__deco landing__deco--3" />

    <div class="landing__container">
      <div class="landing__content">
        <!-- Badge -->
        <div class="landing__badge">
          <span class="landing__badge-dot" />
          <Text variant="caption" weight="bold">NEO-BRUTALIST CODING PLATFORM</Text>
        </div>

        <!-- Hero -->
        <div class="landing__hero">
          <Text as="h1" variant="hero" weight="extrabold" class="landing__title">
            Practice coding
            <span class="landing__title-accent">interviews</span>
          </Text>
          <Text as="p" variant="body" class="landing__description">
            Solve problems, write code, get instant feedback.
            Sign up to track progress and compete on the leaderboard.
          </Text>
        </div>

        <!-- CTA -->
        <div class="landing__actions">
          <template v-if="isAuthenticated">
            <Button variant="primary" size="lg" @click="startPracticing">
              Go to Dashboard
            </Button>
          </template>
          <template v-else>
            <Button variant="primary" size="lg" @click="goToRegister">
              Get started free
            </Button>
            <Button variant="ghost" size="lg" @click="goToLogin">
              Sign in
            </Button>
          </template>
        </div>

        <!-- Guest link -->
        <div v-if="!isAuthenticated" class="landing__guest">
          <router-link to="/dashboard" class="landing__guest-link">
            or continue as guest
          </router-link>
        </div>

        <!-- Feature pills -->
        <div class="landing__features">
          <div class="landing__pill landing__pill--turquoise">Real code execution</div>
          <div class="landing__pill landing__pill--yellow">JS & TypeScript</div>
          <div class="landing__pill landing__pill--coral">Instant feedback</div>
        </div>
      </div>

      <!-- Code preview card -->
      <div class="landing__preview">
        <div class="landing__preview-header">
          <div class="landing__preview-dots">
            <span class="dot dot--coral" />
            <span class="dot dot--yellow" />
            <span class="dot dot--turquoise" />
          </div>
          <Text variant="caption" weight="medium" class="landing__preview-title">
            two-sum.ts
          </Text>
        </div>
        <div class="landing__preview-code">
          <pre><code><span class="code-kw">function</span> <span class="code-fn">twoSum</span>(<span class="code-param">nums</span>: <span class="code-type">number[]</span>, <span class="code-param">target</span>: <span class="code-type">number</span>): <span class="code-type">number[]</span> {
  <span class="code-kw">const</span> <span class="code-var">map</span> = <span class="code-kw">new</span> <span class="code-type">Map</span>()
  <span class="code-kw">for</span> (<span class="code-kw">let</span> <span class="code-var">i</span> = <span class="code-num">0</span>; <span class="code-var">i</span> &lt; <span class="code-param">nums</span>.length; <span class="code-var">i</span>++) {
    <span class="code-kw">const</span> <span class="code-var">complement</span> = <span class="code-param">target</span> - <span class="code-param">nums</span>[<span class="code-var">i</span>]
    <span class="code-kw">if</span> (<span class="code-var">map</span>.has(<span class="code-var">complement</span>))
      <span class="code-kw">return</span> [<span class="code-var">map</span>.get(<span class="code-var">complement</span>), <span class="code-var">i</span>]
    <span class="code-var">map</span>.set(<span class="code-param">nums</span>[<span class="code-var">i</span>], <span class="code-var">i</span>)
  }
}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  position: relative;
  overflow: hidden;
}

/* ── Decorative blocks ── */
.landing__deco {
  position: absolute;
  border: var(--border-width) solid var(--color-ink);
  z-index: 0;
}

.landing__deco--1 {
  width: 180px;
  height: 180px;
  background-color: var(--color-turquoise);
  top: 8%;
  left: 5%;
  transform: rotate(12deg);
  opacity: 0.3;
}

.landing__deco--2 {
  width: 120px;
  height: 120px;
  background-color: var(--color-yellow);
  bottom: 12%;
  right: 8%;
  transform: rotate(-8deg);
  opacity: 0.25;
}

.landing__deco--3 {
  width: 80px;
  height: 80px;
  background-color: var(--color-coral);
  top: 20%;
  right: 15%;
  transform: rotate(20deg);
  opacity: 0.2;
}

.landing__container {
  max-width: 1100px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
  z-index: 1;
  position: relative;
}

@media (max-width: 768px) {
  .landing__container {
    grid-template-columns: 1fr;
    gap: var(--space-10);
  }
}

.landing__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

/* ── Badge ── */
.landing__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background-color: var(--color-surface);
  border: var(--border-thin) solid var(--color-ink);
  box-shadow: var(--shadow-brutal-sm);
  width: fit-content;
  animation: slideUp 0.4s ease-out both;
}

.landing__badge-dot {
  width: 8px;
  height: 8px;
  background-color: var(--color-turquoise);
  border: 1px solid var(--color-ink);
}

/* ── Hero Text ── */
.landing__hero {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  animation: slideUp 0.4s ease-out 0.1s both;
}

.landing__title {
  color: var(--color-text-primary);
}

.landing__title-accent {
  color: var(--color-coral);
  position: relative;
}

.landing__title-accent::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0;
  right: 0;
  height: 6px;
  background-color: var(--color-yellow);
  z-index: -1;
  transform: rotate(-1deg);
}

.landing__description {
  color: var(--color-text-secondary);
  max-width: 440px;
  font-size: var(--text-lg);
}

/* ── Actions ── */
.landing__actions {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  animation: slideUp 0.4s ease-out 0.2s both;
}

/* ── Guest link ── */
.landing__guest {
  animation: slideUp 0.4s ease-out 0.25s both;
}

.landing__guest-link {
  color: var(--color-text-tertiary);
  text-decoration: none;
  font-size: var(--text-sm);
  border-bottom: 1px dashed var(--color-text-tertiary);
  transition: color var(--duration-fast) var(--ease);
}

.landing__guest-link:hover {
  color: var(--color-text-primary);
  border-color: var(--color-text-primary);
}

/* ── Feature pills ── */
.landing__features {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  animation: slideUp 0.4s ease-out 0.3s both;
}

.landing__pill {
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-bold);
  border: var(--border-thin) solid var(--color-ink);
  box-shadow: var(--shadow-brutal-sm);
  transition: transform var(--duration-fast) var(--ease);
}

.landing__pill:hover {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 0 var(--color-ink);
}

.landing__pill--turquoise {
  background-color: var(--color-turquoise);
  transform: rotate(-1deg);
}

.landing__pill--yellow {
  background-color: var(--color-yellow);
  transform: rotate(1deg);
}

.landing__pill--coral {
  background-color: var(--color-coral);
  color: var(--color-white);
  transform: rotate(-0.5deg);
}

.landing__pill--turquoise:hover { transform: rotate(0deg) translate(1px, 1px); }
.landing__pill--yellow:hover { transform: rotate(0deg) translate(1px, 1px); }
.landing__pill--coral:hover { transform: rotate(0deg) translate(1px, 1px); }

/* ── Code Preview ── */
.landing__preview {
  border: var(--border-thick) solid var(--color-ink);
  box-shadow: var(--shadow-brutal-lg);
  overflow: hidden;
  animation: slideUp 0.5s ease-out 0.15s both;
}

.landing__preview-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-ink);
  border-bottom: var(--border-width) solid var(--color-ink);
}

.landing__preview-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.dot--coral { background-color: var(--color-coral); }
.dot--yellow { background-color: var(--color-yellow); }
.dot--turquoise { background-color: var(--color-turquoise); }

.landing__preview-title {
  color: rgba(255, 255, 255, 0.6);
}

.landing__preview-code {
  padding: var(--space-6);
  background-color: #0D0D0D;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.7;
  color: #E0E0E0;
  overflow-x: auto;
}

.landing__preview-code pre {
  margin: 0;
}

/* ── Syntax colors ── */
.code-kw { color: var(--color-coral); }
.code-fn { color: var(--color-turquoise); }
.code-param { color: var(--color-yellow); }
.code-type { color: #78DCE8; }
.code-var { color: #ABB2BF; }
.code-num { color: var(--color-yellow); }

@media (max-width: 768px) {
  .landing__preview {
    display: none;
  }

  .landing__content {
    align-items: center;
    text-align: center;
  }

  .landing__description {
    max-width: 100%;
  }

  .landing__features {
    justify-content: center;
  }

  .landing__hero .text--hero {
    font-size: var(--text-4xl);
  }
}
</style>
