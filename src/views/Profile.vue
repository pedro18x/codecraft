<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { problems } from '../data/problems'
import { useAuth } from '../composables/useAuth'
import { useProblemProgress } from '../composables/useProblemProgress'
import { useModal } from '../composables/useModal'
import BrutalButton from '../components/brutal/BrutalButton.vue'
import BrutalCard from '../components/brutal/BrutalCard.vue'
import BrutalTabs from '../components/brutal/BrutalTabs.vue'
import BrutalProgress from '../components/brutal/BrutalProgress.vue'
import BrutalBadge from '../components/brutal/BrutalBadge.vue'
import BrutalModal from '../components/brutal/BrutalModal.vue'

interface BadgeItem {
  id: string
  name: string
  description: string
  earned: boolean
  tone: 'success' | 'warning' | 'error' | 'info' | 'neutral'
}

const router = useRouter()
const { user } = useAuth()
const { attempts, completedCount, isCompleted } = useProblemProgress()

const activeTab = ref('overview')
const tabItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'activity', label: 'Activity' },
  { id: 'badges', label: 'Badges' },
]

const solvedProblems = computed(() => problems.filter(problem => isCompleted(problem.id)))

const completionRate = computed(() => {
  if (!problems.length) return 0
  return Math.round((completedCount.value / problems.length) * 100)
})

const attemptEntries = computed(() => Object.values(attempts.value))

const streakDays = computed(() => {
  const uniqueDays = new Set(
    attemptEntries.value.map(entry => new Date(entry.lastAttempted).toISOString().slice(0, 10))
  )

  let streak = 0
  const cursor = new Date()

  while (true) {
    const key = cursor.toISOString().slice(0, 10)
    if (uniqueDays.has(key)) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }

  return streak
})

const rankScore = computed(() => Math.max(1, 750 - completedCount.value * 12))

const recentActivity = computed(() => {
  return [...attemptEntries.value]
    .sort((a, b) => b.lastAttempted - a.lastAttempted)
    .slice(0, 8)
    .map(entry => {
      const problem = problems.find(item => item.id === entry.problemId)
      return {
        id: entry.problemId,
        title: problem?.title ?? `Problem #${entry.problemId}`,
        date: new Date(entry.lastAttempted),
        completed: entry.completed,
        attempts: entry.attempts,
      }
    })
})

const heatmapDays = computed(() => {
  const days = [] as Array<{ date: string; count: number }>
  const counts = new Map<string, number>()

  for (const entry of attemptEntries.value) {
    const key = new Date(entry.lastAttempted).toISOString().slice(0, 10)
    counts.set(key, (counts.get(key) ?? 0) + entry.attempts)
  }

  for (let i = 69; i >= 0; i -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const key = date.toISOString().slice(0, 10)
    days.push({ date: key, count: counts.get(key) ?? 0 })
  }

  return days
})

const heatLevelClass = (count: number) => {
  if (count === 0) return 'heat--0'
  if (count <= 2) return 'heat--1'
  if (count <= 5) return 'heat--2'
  return 'heat--3'
}

const badges = computed<BadgeItem[]>(() => [
  {
    id: 'first-solve',
    name: 'First Solve',
    description: 'Solve your first coding problem.',
    earned: completedCount.value >= 1,
    tone: 'success',
  },
  {
    id: 'streak-3',
    name: '3-Day Streak',
    description: 'Practice for 3 consecutive days.',
    earned: streakDays.value >= 3,
    tone: 'info',
  },
  {
    id: 'medium-master',
    name: 'Medium Master',
    description: 'Solve 5 medium problems.',
    earned: solvedProblems.value.filter(problem => problem.difficulty === 'Medium').length >= 5,
    tone: 'warning',
  },
  {
    id: 'hardcore',
    name: 'Hardcore',
    description: 'Solve at least one hard problem.',
    earned: solvedProblems.value.some(problem => problem.difficulty === 'Hard'),
    tone: 'error',
  },
])

const selectedBadge = ref<BadgeItem | null>(null)
const badgeModal = useModal('badge-details')

const openBadge = (badge: BadgeItem) => {
  selectedBadge.value = badge
  badgeModal.open()
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const formatDate = (date: Date) =>
  date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
</script>

<template>
  <div class="profile">
    <div class="profile__container">
      <header class="profile__header">
        <div class="profile__identity">
          <div class="profile__avatar" aria-hidden="true">{{ (user?.username ?? 'G').slice(0, 1).toUpperCase() }}</div>
          <div>
            <h1 class="profile__name">{{ user?.username ?? 'Guest Coder' }}</h1>
            <p class="profile__bio">Building interview muscle one problem at a time.</p>
          </div>
        </div>

        <BrutalButton variant="ghost" size="sm" @click="goToDashboard">Back to Dashboard</BrutalButton>
      </header>

      <section class="profile__stats">
        <BrutalCard variant="interactive" accent="turquoise" padding="lg">
          <p class="stat__value">{{ completedCount }}</p>
          <p class="stat__label">Solved</p>
        </BrutalCard>

        <BrutalCard variant="interactive" accent="yellow" padding="lg">
          <p class="stat__value">{{ streakDays }}</p>
          <p class="stat__label">Day Streak</p>
        </BrutalCard>

        <BrutalCard variant="interactive" accent="coral" padding="lg">
          <p class="stat__value">#{{ rankScore }}</p>
          <p class="stat__label">Rank</p>
        </BrutalCard>
      </section>

      <section class="profile__tabs">
        <BrutalTabs v-model="activeTab" :items="tabItems" />
      </section>

      <section v-if="activeTab === 'overview'" class="profile__panel profile__panel--overview">
        <BrutalCard variant="elevated" padding="lg">
          <h2 class="section-title">Progress Snapshot</h2>
          <BrutalProgress variant="bar" :value="completedCount" :max="problems.length" />
          <p class="section-muted">{{ completionRate }}% complete across {{ problems.length }} problems</p>
        </BrutalCard>

        <BrutalCard variant="flat" padding="lg">
          <h2 class="section-title">Consistency Heatmap</h2>
          <div class="heatmap-grid">
            <span
              v-for="day in heatmapDays"
              :key="day.date"
              class="heat-cell"
              :class="heatLevelClass(day.count)"
              :title="`${day.date}: ${day.count} attempt${day.count === 1 ? '' : 's'}`"
            />
          </div>
        </BrutalCard>
      </section>

      <section v-else-if="activeTab === 'solutions'" class="profile__panel">
        <BrutalCard v-if="solvedProblems.length" variant="flat" padding="none">
          <ul class="solutions-list">
            <li v-for="problem in solvedProblems" :key="problem.id" class="solutions-item">
              <div>
                <p class="solutions-title">#{{ problem.id }} {{ problem.title }}</p>
                <p class="solutions-meta">{{ problem.categories.join(' · ') }}</p>
              </div>
              <BrutalBadge
                variant="difficulty"
                :tone="problem.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'"
              >
                {{ problem.difficulty }}
              </BrutalBadge>
            </li>
          </ul>
        </BrutalCard>

        <BrutalCard v-else variant="flat" padding="lg">
          <p class="section-muted">No solved problems yet. Start from the dashboard and ship one.</p>
        </BrutalCard>
      </section>

      <section v-else-if="activeTab === 'activity'" class="profile__panel">
        <BrutalCard variant="flat" padding="none">
          <ul class="activity-list">
            <li v-for="activity in recentActivity" :key="`${activity.id}-${activity.date.toISOString()}`" class="activity-item">
              <span class="activity-dot" :class="{ 'activity-dot--done': activity.completed }" />
              <div>
                <p class="activity-title">{{ activity.title }}</p>
                <p class="activity-meta">{{ formatDate(activity.date) }} · {{ activity.attempts }} attempt{{ activity.attempts === 1 ? '' : 's' }}</p>
              </div>
            </li>
          </ul>
        </BrutalCard>
      </section>

      <section v-else class="profile__panel">
        <div class="badges-grid">
          <BrutalCard
            v-for="badge in badges"
            :key="badge.id"
            variant="interactive"
            padding="md"
            :accent="badge.earned ? 'turquoise' : null"
            @click="openBadge(badge)"
          >
            <div class="badge-card" :class="{ 'badge-card--locked': !badge.earned }">
              <BrutalBadge variant="status" :tone="badge.tone">{{ badge.earned ? 'Earned' : 'Locked' }}</BrutalBadge>
              <p class="badge-card__title">{{ badge.name }}</p>
              <p class="badge-card__desc">{{ badge.description }}</p>
            </div>
          </BrutalCard>
        </div>
      </section>
    </div>

    <BrutalModal
      :model-value="badgeModal.isOpen.value"
      title="Badge Details"
      @update:model-value="(open) => (open ? badgeModal.open() : badgeModal.close())"
    >
      <template v-if="selectedBadge">
        <p class="modal-title">{{ selectedBadge.name }}</p>
        <p class="modal-desc">{{ selectedBadge.description }}</p>
      </template>

      <template #footer>
        <BrutalButton variant="ghost" size="sm" @click="badgeModal.close">Close</BrutalButton>
      </template>
    </BrutalModal>
  </div>
</template>

<style scoped>
.profile {
  min-height: 100vh;
  padding: 2rem 1rem 3rem;
}

.profile__container {
  width: min(70rem, 100%);
  margin: 0 auto;
  display: grid;
  gap: 1.2rem;
}

.profile__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.profile__identity {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.profile__avatar {
  width: 3.4rem;
  height: 3.4rem;
  border: 4px solid var(--color-ink);
  box-shadow: 4px 4px 0 0 var(--color-ink);
  background: var(--color-yellow);
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-extrabold);
}

.profile__name {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  line-height: 1;
}

.profile__bio {
  margin-top: 0.25rem;
  color: var(--color-text-secondary);
}

.profile__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
}

.stat__value {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-weight-extrabold);
  line-height: 1;
}

.stat__label {
  margin-top: 0.3rem;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.profile__panel {
  display: grid;
  gap: 0.8rem;
}

.profile__panel--overview {
  grid-template-columns: 1fr 1fr;
}

.section-title {
  margin: 0 0 0.7rem;
  font-family: var(--font-display);
  font-size: var(--text-xl);
}

.section-muted {
  margin-top: 0.6rem;
  color: var(--color-text-secondary);
}

.heatmap-grid {
  margin-top: 0.45rem;
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  gap: 0.28rem;
}

.heat-cell {
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid var(--color-ink);
}

.heat--0 {
  background: var(--color-background);
}

.heat--1 {
  background: #b8f0eb;
}

.heat--2 {
  background: #66d8ce;
}

.heat--3 {
  background: #1ca79b;
}

.solutions-list,
.activity-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.solutions-item,
.activity-item {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  align-items: center;
  border-bottom: 3px solid var(--color-border-subtle);
  padding: 0.75rem 1rem;
}

.solutions-title,
.activity-title {
  font-weight: var(--font-weight-semibold);
}

.solutions-meta,
.activity-meta {
  margin-top: 0.25rem;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.activity-item {
  justify-content: flex-start;
}

.activity-dot {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 999px;
  background: var(--color-yellow);
  border: 2px solid var(--color-ink);
}

.activity-dot--done {
  background: var(--color-turquoise);
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: 0.8rem;
}

.badge-card {
  display: grid;
  gap: 0.55rem;
}

.badge-card--locked {
  filter: grayscale(1);
  opacity: 0.7;
}

.badge-card__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-weight-bold);
}

.badge-card__desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.modal-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  margin: 0 0 0.5rem;
}

.modal-desc {
  color: var(--color-text-secondary);
}

@media (max-width: 920px) {
  .profile__stats,
  .profile__panel--overview {
    grid-template-columns: 1fr;
  }
}
</style>
