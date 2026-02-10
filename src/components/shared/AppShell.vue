<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
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

const hasSidebar = computed(() => Boolean(slots.sidebar))
const hasPanel = computed(() => Boolean(slots.panel))

const navItems = [
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
    <header v-if="showTopbar" class="app-shell__topbar">
      <div class="app-shell__topbar-inner">
        <div class="app-shell__brand">
          <RouterLink class="app-shell__brand-link" to="/dashboard">CodeCraft</RouterLink>
          <div v-if="title || subtitle" class="app-shell__headline">
            <p v-if="title" class="app-shell__title">{{ title }}</p>
            <p v-if="subtitle" class="app-shell__subtitle">{{ subtitle }}</p>
          </div>
        </div>

        <nav class="app-shell__nav" aria-label="App sections">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="app-shell__nav-link"
            :class="{ 'app-shell__nav-link--active': isNavActive(item.routeNames) }"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <div class="app-shell__actions">
          <slot name="topbar-actions" />

          <BrutalButton
            v-if="isAuthenticated"
            variant="ghost"
            size="sm"
            @click="handleLogout"
          >
            Sign out
          </BrutalButton>
          <RouterLink v-else class="app-shell__auth-link" to="/login">Sign in</RouterLink>
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
  position: sticky;
  top: 0;
  z-index: 60;
  border-bottom: 3px solid var(--color-border-strong);
  background: color-mix(in srgb, var(--color-surface) 92%, transparent);
  backdrop-filter: blur(10px);
}

.app-shell__topbar-inner {
  min-height: 4.35rem;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--app-layout-gap);
  padding: var(--app-shell-pad-y) var(--app-shell-gutter);
}

.app-shell__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.app-shell__brand-link {
  text-decoration: none;
  color: var(--color-text-primary);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
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
  justify-self: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  min-width: 0;
}

.app-shell__nav-link {
  text-decoration: none;
  color: var(--color-text-secondary);
  border: 2px solid var(--color-border-strong);
  background: var(--color-surface-raised);
  box-shadow: 2px 2px 0 0 var(--color-shadow-strong);
  padding: 0.35rem 0.55rem;
  font-size: var(--text-sm);
  font-family: var(--font-mono);
}

.app-shell__nav-link:hover {
  color: var(--color-text-primary);
  background: var(--color-surface-hover);
}

.app-shell__nav-link--active {
  background: var(--color-yellow);
  color: var(--color-accent-ink);
}

.app-shell__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-width: 0;
}

.app-shell__auth-link {
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  border: 2px solid var(--color-border-strong);
  background: var(--color-surface);
  padding: 0.35rem 0.55rem;
}

[data-theme='dark'] .app-shell__nav-link {
  color: var(--color-text-primary);
  background: var(--color-surface);
}

[data-theme='dark'] .app-shell__nav-link--active {
  background: var(--color-primary);
  color: var(--color-accent-ink);
}

[data-theme='dark'] .app-shell__auth-link {
  background: var(--color-surface-raised);
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
    grid-template-columns: minmax(0, 1fr);
  }

  .app-shell__nav {
    justify-self: start;
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
