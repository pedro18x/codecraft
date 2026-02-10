<script setup lang="ts">
import BrutalButton from '../brutal/BrutalButton.vue'
import BrutalInput from '../brutal/BrutalInput.vue'
import BrutalDropdown from '../brutal/BrutalDropdown.vue'

interface Props {
  searchQuery: string
  selectedDifficulty: 'All' | 'Easy' | 'Medium' | 'Hard'
  sortBy: string
  mobileFiltersOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:searchQuery', value: string): void
  (event: 'update:selectedDifficulty', value: 'All' | 'Easy' | 'Medium' | 'Hard'): void
  (event: 'update:sortBy', value: string): void
  (event: 'toggleFilters'): void
  (event: 'open-profile'): void
  (event: 'open-leaderboard'): void
}>()

const sortOptions = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Difficulty', value: 'difficulty' },
  { label: 'Acceptance', value: 'acceptance' },
  { label: 'Title', value: 'title' },
]
</script>

<template>
  <header class="dashboard-topbar">
    <div class="dashboard-topbar__left">
      <h1 class="dashboard-topbar__title">CodeCraft Control Center</h1>
      <p class="dashboard-topbar__subtitle">Choose your next pressure test.</p>
    </div>

    <div class="dashboard-topbar__actions">
      <BrutalButton variant="secondary" size="sm" @click="emit('open-profile')">Profile</BrutalButton>
      <BrutalButton variant="secondary" size="sm" @click="emit('open-leaderboard')">Leaderboard</BrutalButton>
    </div>

    <div class="dashboard-topbar__filters">
      <BrutalInput
        :model-value="searchQuery"
        label="Search Problems"
        placeholder="two sum, graph, dp"
        @update:model-value="(value) => emit('update:searchQuery', String(value))"
      />

      <div class="difficulty-row" role="radiogroup" aria-label="Filter by difficulty">
        <button
          v-for="diff in (['All', 'Easy', 'Medium', 'Hard'] as const)"
          :key="diff"
          class="difficulty-pill"
          :class="{ 'difficulty-pill--active': selectedDifficulty === diff }"
          role="radio"
          :aria-checked="selectedDifficulty === diff"
          @click="emit('update:selectedDifficulty', diff)"
        >
          {{ diff }}
        </button>
      </div>

      <BrutalDropdown
        :model-value="sortBy"
        :options="sortOptions"
        placeholder="Sort"
        @update:model-value="(value) => emit('update:sortBy', value)"
      />

      <BrutalButton
        class="filters-toggle"
        variant="secondary"
        size="sm"
        :aria-expanded="mobileFiltersOpen"
        aria-controls="dashboard-filter-rail"
        @click="emit('toggleFilters')"
      >
        {{ mobileFiltersOpen ? 'Hide Filters' : 'Filters' }}
      </BrutalButton>
    </div>
  </header>
</template>

<style scoped>
.dashboard-topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: grid;
  gap: 0.8rem;
  padding: 0.8rem;
  border: 3px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  box-shadow: 4px 4px 0 0 var(--color-shadow-strong);
  background: var(--color-surface);
}

.dashboard-topbar__left {
  display: grid;
  gap: 0.2rem;
}

.dashboard-topbar__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2.2rem);
}

.dashboard-topbar__subtitle {
  margin: 0;
  color: var(--color-text-secondary);
}

.dashboard-topbar__actions,
.dashboard-topbar__filters {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  align-items: end;
}

.dashboard-topbar__actions {
  justify-content: flex-end;
}

.dashboard-topbar__filters > * {
  flex: 1;
  min-width: 12rem;
}

.difficulty-row {
  display: flex;
  gap: 0.4rem;
}

.difficulty-pill {
  border: 3px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--color-surface-raised);
  box-shadow: 2px 2px 0 0 var(--color-shadow-strong);
  min-height: 2.55rem;
  padding: 0.4rem 0.65rem;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
}

.difficulty-pill--active {
  background: var(--color-warning);
  color: var(--color-accent-ink);
}

.difficulty-pill:focus-visible {
  outline: 4px solid var(--color-focus-ring);
  outline-offset: 2px;
}

@media (max-width: 980px) {
  .dashboard-topbar__actions {
    justify-content: flex-start;
  }

  .dashboard-topbar__filters > * {
    min-width: 100%;
  }
}

@media (min-width: 981px) {
  .filters-toggle {
    display: none;
  }
}
</style>
