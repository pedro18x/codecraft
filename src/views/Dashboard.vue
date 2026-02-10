<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { problems } from '../data/problems'
import { useProblemProgress } from '../composables/useProblemProgress'
import { useTheme } from '../composables/useTheme'
import { getProblemSlug } from '../utils/problemUtils'
import Container from '../design-system/components/Container.vue'
import Card from '../design-system/components/Card.vue'
import Text from '../design-system/components/Text.vue'
import Button from '../design-system/components/Button.vue'
import type { Difficulty } from '../types'

const router = useRouter()
const { isCompleted, lastAttemptedProblemId, completedCount } = useProblemProgress()
const { theme, toggleTheme } = useTheme()

// Search and filters
const searchQuery = ref('')
const selectedDifficulty = ref<Difficulty | 'All'>('All')

// Find problems
const lastAttemptedProblem = computed(() =>
  lastAttemptedProblemId.value
    ? problems.find(p => p.id === lastAttemptedProblemId.value)
    : null
)

const suggestedProblem = computed(() => {
  return problems.find(p => !isCompleted(p.id))
})

// Filtered problems
const filteredProblems = computed(() => {
  return problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      problem.categories.some(cat => cat.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesDifficulty = selectedDifficulty.value === 'All' ||
      problem.difficulty === selectedDifficulty.value

    return matchesSearch && matchesDifficulty
  })
})

// Stats
const totalProblems = computed(() => problems.length)
const easyCount = computed(() => problems.filter(p => p.difficulty === 'Easy').length)
const mediumCount = computed(() => problems.filter(p => p.difficulty === 'Medium').length)
const hardCount = computed(() => problems.filter(p => p.difficulty === 'Hard').length)
const progressPercent = computed(() => Math.round((completedCount.value / totalProblems.value) * 100))

const startProblem = (problemId: number) => {
  const problem = problems.find(p => p.id === problemId)
  if (problem) {
    router.push(`/practice/${getProblemSlug(problem)}`)
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedDifficulty.value = 'All'
}

</script>

<template>
  <div class="dashboard">
    <Container max-width="content">
      <div class="dashboard__content stagger-enter">
        <!-- Header -->
        <div class="dashboard__header">
          <div class="dashboard__header-left">
            <Text as="h1" variant="h2" weight="bold">Dashboard</Text>
            <Text variant="muted">{{ completedCount }} of {{ totalProblems }} completed</Text>
          </div>
          <button
            class="theme-toggle"
            @click="toggleTheme"
            :title="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`"
          >
            <svg v-if="theme === 'light'" width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 3V1M10 19V17M17 10H19M1 10H3M15.657 15.657L17.07 17.07M2.929 2.929L4.343 4.343M15.657 4.343L17.07 2.929M2.929 17.07L4.343 15.657M14 10C14 12.209 12.209 14 10 14C7.791 14 6 12.209 6 10C6 7.791 7.791 6 10 6C12.209 6 14 7.791 14 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M17 10.836C15.9 11.286 14.686 11.536 13.414 11.536C8.387 11.536 4.314 7.464 4.314 2.436C4.314 1.914 4.364 1.414 4.464 0.936C2.236 2.186 0.764 4.636 0.764 7.436C0.764 11.586 4.114 14.936 8.264 14.936C11.464 14.936 14.236 13.036 15.314 10.286L17 10.836Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-bar__fill" :style="{ width: `${progressPercent}%` }">
              <span v-if="progressPercent > 10" class="progress-bar__label">{{ progressPercent }}%</span>
            </div>
          </div>
          <div class="progress-stats">
            <div class="progress-stat">
              <span class="progress-stat__count progress-stat__count--easy">{{ easyCount }}</span>
              <Text variant="caption">Easy</Text>
            </div>
            <div class="progress-stat">
              <span class="progress-stat__count progress-stat__count--medium">{{ mediumCount }}</span>
              <Text variant="caption">Medium</Text>
            </div>
            <div class="progress-stat">
              <span class="progress-stat__count progress-stat__count--hard">{{ hardCount }}</span>
              <Text variant="caption">Hard</Text>
            </div>
          </div>
        </div>

        <!-- Resume Cards -->
        <div v-if="lastAttemptedProblem || suggestedProblem" class="resume-grid">
          <Card
            v-if="lastAttemptedProblem"
            interactive
            padding="lg"
            accent="coral"
            @click="startProblem(lastAttemptedProblem.id)"
          >
            <Text variant="caption" weight="bold" class="resume-label">LAST ATTEMPTED</Text>
            <div class="resume-card">
              <div class="resume-card__header">
                <Text as="span" variant="body-sm" weight="medium" mono class="resume-card__number">
                  #{{ lastAttemptedProblem.id }}
                </Text>
                <span :class="['badge-brutal', `badge-brutal--${lastAttemptedProblem.difficulty.toLowerCase()}`]">
                  {{ lastAttemptedProblem.difficulty }}
                </span>
              </div>
              <Text as="h3" variant="h4" weight="bold">
                {{ lastAttemptedProblem.title }}
              </Text>
            </div>
          </Card>

          <Card
            v-if="suggestedProblem && suggestedProblem.id !== lastAttemptedProblem?.id"
            interactive
            padding="lg"
            accent="turquoise"
            @click="startProblem(suggestedProblem.id)"
          >
            <Text variant="caption" weight="bold" class="resume-label">SUGGESTED NEXT</Text>
            <div class="resume-card">
              <div class="resume-card__header">
                <Text as="span" variant="body-sm" weight="medium" mono class="resume-card__number">
                  #{{ suggestedProblem.id }}
                </Text>
                <span :class="['badge-brutal', `badge-brutal--${suggestedProblem.difficulty.toLowerCase()}`]">
                  {{ suggestedProblem.difficulty }}
                </span>
              </div>
              <Text as="h3" variant="h4" weight="bold">
                {{ suggestedProblem.title }}
              </Text>
            </div>
          </Card>
        </div>

        <!-- Search & Filters -->
        <div class="filters-section">
          <div class="filters-row">
            <div class="search-wrapper">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search problems..."
                class="search-input"
              />
            </div>

            <div class="difficulty-tabs">
              <button
                v-for="d in (['All', 'Easy', 'Medium', 'Hard'] as const)"
                :key="d"
                :class="['diff-tab', { 'diff-tab--active': selectedDifficulty === d }]"
                @click="selectedDifficulty = d as Difficulty | 'All'"
              >
                {{ d }}
              </button>
            </div>

            <Button
              v-if="searchQuery || selectedDifficulty !== 'All'"
              variant="ghost"
              size="sm"
              @click="clearFilters"
            >
              Clear
            </Button>
          </div>

          <Text variant="muted" class="filter-count">
            {{ filteredProblems.length }} of {{ totalProblems }} problems
          </Text>
        </div>

        <!-- Problem List -->
        <div class="problems-list">
          <div
            v-for="problem in filteredProblems"
            :key="problem.id"
            class="problem-row"
            @click="startProblem(problem.id)"
          >
            <div class="problem-row__left">
              <span class="problem-row__status">
                <svg v-if="isCompleted(problem.id)" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect width="18" height="18" :fill="'var(--color-turquoise)'" stroke="var(--color-ink)" stroke-width="2"/>
                  <path d="M4 9L7.5 12.5L14 5.5" stroke="var(--color-ink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span v-else class="problem-row__checkbox" />
              </span>
              <Text as="span" variant="body-sm" weight="medium" mono class="problem-row__number">
                {{ String(problem.id).padStart(2, '0') }}
              </Text>
              <Text as="span" variant="body" weight="medium">
                {{ problem.title }}
              </Text>
            </div>

            <div class="problem-row__right">
              <div class="problem-row__categories">
                <Text
                  v-for="cat in problem.categories.slice(0, 2)"
                  :key="cat"
                  variant="caption"
                  class="problem-row__category"
                >
                  {{ cat }}
                </Text>
              </div>
              <span :class="['badge-brutal', 'badge-brutal--sm', `badge-brutal--${problem.difficulty.toLowerCase()}`]">
                {{ problem.difficulty }}
              </span>
            </div>
          </div>

          <div v-if="filteredProblems.length === 0" class="no-results">
            <Text variant="h4" weight="bold">No problems found</Text>
            <Text variant="muted">Try a different search or filter</Text>
            <Button variant="ghost" size="sm" @click="clearFilters">
              Clear filters
            </Button>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  padding: var(--space-8) 0;
}

.dashboard__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

/* ── Header ── */
.dashboard__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.dashboard__header-left {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-ink);
  box-shadow: var(--shadow-brutal-sm);
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease),
              box-shadow var(--duration-fast) var(--ease);
}

.theme-toggle:hover {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 0 var(--color-ink);
}

.theme-toggle:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.theme-toggle:focus-visible {
  outline: 3px solid var(--color-yellow);
  outline-offset: 2px;
}

/* ── Progress ── */
.progress-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.progress-bar {
  height: 2rem;
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-ink);
  box-shadow: var(--shadow-brutal-sm);
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background-color: var(--color-turquoise);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 var(--space-3);
  transition: width 0.5s var(--ease);
  min-width: 0;
}

.progress-bar__label {
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  font-size: var(--text-sm);
  color: var(--color-ink);
}

.progress-stats {
  display: flex;
  gap: var(--space-6);
}

.progress-stat {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.progress-stat__count {
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  font-size: var(--text-xl);
}

.progress-stat__count--easy { color: var(--color-turquoise); }
.progress-stat__count--medium { color: #D4A017; }
.progress-stat__count--hard { color: var(--color-coral); }

/* ── Resume Cards ── */
.resume-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-4);
}

.resume-label {
  color: var(--color-text-tertiary);
  letter-spacing: 0.08em;
  margin-bottom: var(--space-3);
}

.resume-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.resume-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.resume-card__number {
  color: var(--color-text-tertiary);
}

/* ── Filters ── */
.filters-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.filters-row {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  flex-wrap: wrap;
}

.search-wrapper {
  flex: 1;
  min-width: 200px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 2.75rem;
  padding: 0 var(--space-4) 0 calc(var(--space-4) + 24px);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-ink);
  transition: box-shadow var(--duration-fast) var(--ease);
}

.search-input:focus {
  outline: none;
  box-shadow: var(--shadow-brutal-sm);
}

.search-input::placeholder {
  color: var(--color-text-tertiary);
}

.difficulty-tabs {
  display: flex;
  border: var(--border-width) solid var(--color-ink);
  overflow: hidden;
}

.diff-tab {
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-secondary);
  background: var(--color-surface);
  border: none;
  border-right: var(--border-thin) solid var(--color-ink);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease),
              color var(--duration-fast) var(--ease);
}

.diff-tab:last-child {
  border-right: none;
}

.diff-tab:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
}

.diff-tab--active {
  background-color: var(--color-ink);
  color: var(--color-surface);
}

.diff-tab:focus-visible {
  outline: 3px solid var(--color-yellow);
  outline-offset: -3px;
}

.filter-count {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}

/* ── Problem List ── */
.problems-list {
  display: flex;
  flex-direction: column;
  border: var(--border-width) solid var(--color-ink);
  box-shadow: var(--shadow-brutal);
  background-color: var(--color-surface);
}

.problem-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease);
  border-bottom: var(--border-thin) solid var(--color-border-subtle);
}

.problem-row:last-child {
  border-bottom: none;
}

.problem-row:hover {
  background-color: var(--color-surface-hover);
}

.problem-row__left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex: 1;
  min-width: 0;
}

.problem-row__status {
  flex-shrink: 0;
  display: flex;
}

.problem-row__checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-border-subtle);
  background: none;
}

.problem-row__number {
  color: var(--color-text-tertiary);
  min-width: 2ch;
}

.problem-row__right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-shrink: 0;
}

.problem-row__categories {
  display: flex;
  gap: var(--space-2);
}

.problem-row__category {
  color: var(--color-text-tertiary);
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--color-border-subtle);
  font-size: var(--text-xs);
}

@media (max-width: 640px) {
  .problem-row__categories {
    display: none;
  }
}

/* ── Badge ── */
.badge-brutal {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  font-size: var(--text-xs);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: var(--space-1) var(--space-3);
  border: var(--border-thin) solid var(--color-ink);
  transform: rotate(-1deg);
  transition: transform var(--duration-fast) var(--ease);
}

.badge-brutal:hover {
  transform: rotate(0deg);
}

.badge-brutal--sm {
  font-size: 0.625rem;
  padding: 2px var(--space-2);
}

.badge-brutal--easy {
  background-color: var(--color-turquoise);
  color: var(--color-ink);
}

.badge-brutal--medium {
  background-color: var(--color-yellow);
  color: var(--color-ink);
}

.badge-brutal--hard {
  background-color: var(--color-coral);
  color: var(--color-white);
}

/* ── No Results ── */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-16) 0;
}
</style>
