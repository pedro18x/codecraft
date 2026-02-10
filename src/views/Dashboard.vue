<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { problems } from '../data/problems'
import { useProblemProgress } from '../composables/useProblemProgress'
import { useTheme } from '../composables/useTheme'
import { getProblemSlug } from '../utils/problemUtils'
import PageShell from '../components/shared/PageShell.vue'
import DashboardTopBar from '../components/dashboard/DashboardTopBar.vue'
import DailyChallengeCard from '../components/dashboard/DailyChallengeCard.vue'
import VirtualProblemList, { type VirtualProblemItem } from '../components/dashboard/VirtualProblemList.vue'
import BrutalCard from '../components/brutal/BrutalCard.vue'
import BrutalCheckbox from '../components/brutal/BrutalCheckbox.vue'
import BrutalEmptyState from '../components/brutal/BrutalEmptyState.vue'
import BrutalButton from '../components/brutal/BrutalButton.vue'
import BrutalProgress from '../components/brutal/BrutalProgress.vue'

const router = useRouter()
const { attempts, isCompleted, completedCount } = useProblemProgress()
const { theme, toggleTheme } = useTheme()

const searchInput = ref('')
const searchQuery = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchInput, (value) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchQuery.value = value.trim()
  }, 220)
})

const selectedDifficulty = ref<'All' | 'Easy' | 'Medium' | 'Hard'>('All')
const sortBy = ref('recommended')
const statusFilter = ref<'all' | 'todo' | 'attempted' | 'solved'>('all')
const selectedCategories = ref<string[]>([])
const filterRailOpen = ref(false)

const categories = computed(() => {
  return [...new Set(problems.flatMap(problem => problem.categories))].sort((a, b) => a.localeCompare(b))
})

const totalProblems = computed(() => problems.length)
const progressPercent = computed(() => Math.round((completedCount.value / totalProblems.value) * 100))

const problemStatus = (problemId: number): 'todo' | 'attempted' | 'solved' => {
  if (isCompleted(problemId)) return 'solved'
  if (attempts.value[problemId]) return 'attempted'
  return 'todo'
}

const acceptanceFor = (problemId: number) => {
  return Math.min(94, 46 + ((problemId * 7) % 42))
}

const enrichedProblems = computed<VirtualProblemItem[]>(() => {
  return problems.map(problem => ({
    id: problem.id,
    title: problem.title,
    difficulty: problem.difficulty,
    categories: problem.categories,
    acceptance: acceptanceFor(problem.id),
    status: problemStatus(problem.id),
  }))
})

const filteredProblems = computed(() => {
  let list = enrichedProblems.value.filter(problem => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      problem.categories.some(category => category.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesDifficulty =
      selectedDifficulty.value === 'All' || problem.difficulty === selectedDifficulty.value

    const matchesStatus = statusFilter.value === 'all' || problem.status === statusFilter.value

    const matchesCategory =
      selectedCategories.value.length === 0 ||
      selectedCategories.value.every(category => problem.categories.includes(category))

    return matchesSearch && matchesDifficulty && matchesStatus && matchesCategory
  })

  if (sortBy.value === 'difficulty') {
    const order = { Easy: 1, Medium: 2, Hard: 3 }
    list = [...list].sort((a, b) => order[a.difficulty] - order[b.difficulty])
  }

  if (sortBy.value === 'acceptance') {
    list = [...list].sort((a, b) => b.acceptance - a.acceptance)
  }

  if (sortBy.value === 'title') {
    list = [...list].sort((a, b) => a.title.localeCompare(b.title))
  }

  if (sortBy.value === 'recommended') {
    const statusRank = { solved: 2, attempted: 1, todo: 0 }
    list = [...list].sort((a, b) => statusRank[a.status] - statusRank[b.status] || a.id - b.id)
  }

  return list
})

const dailyChallenge = computed(() => {
  const next = enrichedProblems.value.find(problem => problem.status !== 'solved')
  if (!next) return null
  return problems.find(problem => problem.id === next.id) ?? null
})

const startProblem = (problemId: number) => {
  const problem = problems.find(item => item.id === problemId)
  if (!problem) return
  router.push(`/practice/${getProblemSlug(problem)}`)
}

const toggleCategory = (category: string) => {
  if (selectedCategories.value.includes(category)) {
    selectedCategories.value = selectedCategories.value.filter(value => value !== category)
  } else {
    selectedCategories.value = [...selectedCategories.value, category]
  }
}

const clearFilters = () => {
  searchInput.value = ''
  searchQuery.value = ''
  selectedDifficulty.value = 'All'
  statusFilter.value = 'all'
  selectedCategories.value = []
}

const goProfile = () => router.push('/profile')
const goLeaderboard = () => router.push('/leaderboard')

const updateSearchQuery = (value: string) => {
  searchInput.value = value
}

const updateDifficulty = (value: 'All' | 'Easy' | 'Medium' | 'Hard') => {
  selectedDifficulty.value = value
}

const updateSort = (value: string) => {
  sortBy.value = value
}
</script>

<template>
  <PageShell>
    <div class="dashboard-grid">
      <DashboardTopBar
        :search-query="searchInput"
        :selected-difficulty="selectedDifficulty"
        :sort-by="sortBy"
        :mobile-filters-open="filterRailOpen"
        @update:search-query="updateSearchQuery"
        @update:selected-difficulty="updateDifficulty"
        @update:sort-by="updateSort"
        @toggle-filters="filterRailOpen = !filterRailOpen"
        @open-profile="goProfile"
        @open-leaderboard="goLeaderboard"
      />

      <aside
        id="dashboard-filter-rail"
        class="filter-rail"
        :class="{ 'filter-rail--open': filterRailOpen }"
      >
        <BrutalCard variant="flat" padding="lg">
          <div class="rail-section">
            <h2 class="rail-title">Status</h2>
            <div class="rail-checks">
              <BrutalCheckbox
                :model-value="statusFilter === 'all'"
                label="All"
                @update:model-value="statusFilter = 'all'"
              />
              <BrutalCheckbox
                :model-value="statusFilter === 'todo'"
                label="Todo"
                @update:model-value="statusFilter = 'todo'"
              />
              <BrutalCheckbox
                :model-value="statusFilter === 'attempted'"
                label="Attempted"
                @update:model-value="statusFilter = 'attempted'"
              />
              <BrutalCheckbox
                :model-value="statusFilter === 'solved'"
                label="Solved"
                @update:model-value="statusFilter = 'solved'"
              />
            </div>
          </div>

          <div class="rail-section">
            <h2 class="rail-title">Categories</h2>
            <div class="category-grid">
              <button
                v-for="category in categories"
                :key="category"
                class="category-chip"
                :class="{ 'category-chip--active': selectedCategories.includes(category) }"
                @click="toggleCategory(category)"
              >
                {{ category }}
              </button>
            </div>
          </div>

          <BrutalButton variant="ghost" size="sm" @click="clearFilters">Reset Filters</BrutalButton>
        </BrutalCard>

        <DailyChallengeCard :problem="dailyChallenge" @start="startProblem" />
      </aside>

      <main class="dashboard-main">
        <BrutalCard variant="flat" padding="lg">
          <div class="progress-row">
            <div>
              <p class="progress-title">Progress</p>
              <p class="progress-copy">{{ completedCount }}/{{ totalProblems }} solved</p>
            </div>

            <BrutalButton variant="secondary" size="sm" @click="toggleTheme">
              Theme: {{ theme }}
            </BrutalButton>
          </div>

          <BrutalProgress variant="bar" :value="progressPercent" :max="100" />
        </BrutalCard>

        <VirtualProblemList
          v-if="filteredProblems.length"
          :items="filteredProblems"
          :viewport-height="620"
          @select="startProblem"
        />

        <BrutalEmptyState
          v-else
          title="No matching problems"
          description="Try a broader search or relax category filters."
          action-label="Clear filters"
          @action="clearFilters"
        />
      </main>
    </div>
  </PageShell>
</template>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(14rem, 18.5rem) minmax(0, 1fr);
  grid-template-areas:
    'topbar topbar'
    'rail main';
  gap: 0.8rem;
  padding-bottom: 2rem;
}

:deep(.dashboard-topbar) {
  grid-area: topbar;
}

.filter-rail {
  grid-area: rail;
  display: grid;
  gap: 0.75rem;
  align-self: start;
}

.dashboard-main {
  grid-area: main;
  display: grid;
  gap: 0.75rem;
}

.rail-section {
  display: grid;
  gap: 0.45rem;
}

.rail-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-lg);
}

.rail-checks {
  display: grid;
  gap: 0.35rem;
}

.category-grid {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.category-chip {
  border: 2px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-surface-raised);
  box-shadow: 1px 1px 0 0 var(--color-shadow-strong);
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  padding: 0.24rem 0.4rem;
  cursor: pointer;
}

.category-chip--active {
  background: var(--color-yellow);
  color: var(--color-accent-ink);
}

.progress-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.7rem;
}

.progress-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-xl);
}

.progress-copy {
  margin: 0.2rem 0 0;
  color: var(--color-text-secondary);
}

@media (max-width: 1000px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      'topbar'
      'rail'
      'main';
  }

  .filter-rail {
    display: none;
  }

  .filter-rail--open {
    display: grid;
  }
}
</style>
