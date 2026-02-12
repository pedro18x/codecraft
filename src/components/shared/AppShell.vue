<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useTheme } from '../../composables/useTheme'
import BrutalButton from '../brutal/BrutalButton.vue'

interface Props {
  title?: string
  subtitle?: string
  showTopbar?: boolean
  scrollMain?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  showTopbar: true,
  scrollMain: true,
})

const route = useRoute()
const slots = useSlots()
const { isAuthenticated, logout } = useAuth()
const { theme, toggleTheme } = useTheme()

const hasSidebar = computed(() => Boolean(slots.sidebar))
const hasPanel = computed(() => Boolean(slots.panel))
const themeLabel = computed(() => `Theme: ${theme.value === 'dark' ? 'Dark' : 'Light'}`)
const screenContext = computed(() => {
  const routeName = String(route.name ?? '')
  if (routeName === 'dashboard') return 'dashboard'
  if (routeName === 'profile') return 'profile'
  if (routeName === 'leaderboard') return 'leaderboard'
  return 'default'
})

const navItems = [
  { label: 'Home', to: '/', routeNames: ['landing'] },
  { label: 'Dashboard', to: '/dashboard', routeNames: ['dashboard'] },
  { label: 'Profile', to: '/profile', routeNames: ['profile'] },
  { label: 'Leaderboard', to: '/leaderboard', routeNames: ['leaderboard'] },
]

const isNavActive = (routeNames: string[]) => routeNames.includes(String(route.name ?? ''))

const handleLogout = async () => {
  await logout()
}
</script>

<template>
  <div class="app-shell">
    <header
      v-if="showTopbar"
      class="neo-nav neo-nav--shell app-shell__topbar"
      :data-screen-context="screenContext"
      data-testid="app-nav"
    >
      <div class="neo-nav__inner app-shell__topbar-inner">
        <div class="app-shell__brand">
          <RouterLink class="neo-nav__brand app-shell__brand-link" to="/">
            <span class="neo-nav__brand-dot" />
            CodeCraft
          </RouterLink>
          <div v-if="title || subtitle" class="app-shell__headline">
            <p v-if="title" class="app-shell__title">{{ title }}</p>
            <p v-if="subtitle" class="app-shell__subtitle">{{ subtitle }}</p>
          </div>
        </div>

        <nav class="neo-nav__links app-shell__nav" aria-label="App sections">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="neo-nav__link"
            :class="{ 'is-active': isNavActive(item.routeNames) }"
            :aria-current="isNavActive(item.routeNames) ? 'page' : undefined"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <div class="neo-nav__actions app-shell__actions">
          <slot name="topbar-actions" />

          <button
            class="neo-nav__theme-toggle"
            :aria-label="themeLabel"
            @click="toggleTheme"
          >
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

          <BrutalButton
            v-if="isAuthenticated"
            variant="ghost"
            size="sm"
            @click="handleLogout"
          >
            Sign out
          </BrutalButton>
          <RouterLink v-else class="neo-nav__auth-link" to="/login">Sign in</RouterLink>
        </div>
      </div>
    </header>

    <div
      class="app-shell__body"
      :class="{
        'app-shell__body--sidebar': hasSidebar,
        'app-shell__body--panel': hasPanel,
      }"
    >
      <aside v-if="hasSidebar" class="app-shell__region app-shell__region--sidebar">
        <slot name="sidebar" />
      </aside>

      <main class="app-shell__main" :class="{ 'app-shell__main--scroll': props.scrollMain }">
        <slot />
      </main>

      <aside v-if="hasPanel" class="app-shell__region app-shell__region--panel">
        <slot name="panel" />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
}

.app-shell__topbar {
  z-index: 60;
}

.app-shell__topbar-inner {
  min-height: 4.2rem;
  gap: var(--space-4);
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    'brand actions'
    'links links';
  row-gap: var(--space-2);
}

.app-shell__brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
  grid-area: brand;
}

.app-shell__brand-link {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-weight-extrabold);
  line-height: 1;
}

.app-shell__headline {
  min-width: 0;
}

.app-shell__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-weight-bold);
}

.app-shell__subtitle {
  margin: 0.15rem 0 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.app-shell__nav {
  justify-content: flex-start;
  flex-wrap: wrap;
  row-gap: 0.35rem;
  grid-area: links;
}

.app-shell__actions {
  gap: var(--space-2);
  grid-area: actions;
  pointer-events: none;
}

.app-shell__actions > * {
  pointer-events: auto;
}

.app-shell__body {
  flex: 1;
  min-height: 0;
  display: grid;
  gap: var(--app-layout-gap);
  grid-template-columns: minmax(0, 1fr);
  padding: var(--app-shell-pad-y) var(--app-shell-gutter) calc(var(--app-shell-pad-y) * 1.35);
}

.app-shell__body--sidebar {
  grid-template-columns: minmax(14rem, var(--app-sidebar-width)) minmax(0, 1fr);
}

.app-shell__body--panel {
  grid-template-columns: minmax(0, 1fr) minmax(15rem, var(--app-panel-width));
}

.app-shell__body--sidebar.app-shell__body--panel {
  grid-template-columns:
    minmax(14rem, var(--app-sidebar-width))
    minmax(0, 1fr)
    minmax(15rem, var(--app-panel-width));
}

.app-shell__region {
  min-width: 0;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: var(--app-layout-gap);
}

.app-shell__main {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: var(--app-layout-gap);
}

.app-shell__main--scroll {
  overflow: auto;
}

@media (max-width: 1200px) {
  .app-shell__body--sidebar.app-shell__body--panel {
    grid-template-columns: minmax(13.5rem, var(--app-sidebar-width)) minmax(0, 1fr);
  }

  .app-shell__body--sidebar.app-shell__body--panel .app-shell__region--panel {
    grid-column: 1 / -1;
  }
}

@media (max-width: 1024px) {
  .app-shell__topbar-inner {
    gap: var(--space-3);
  }

  .app-shell__nav {
    justify-content: flex-start;
  }

  .app-shell__actions {
    justify-content: flex-start;
  }

  .app-shell__body,
  .app-shell__body--sidebar,
  .app-shell__body--panel,
  .app-shell__body--sidebar.app-shell__body--panel {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
