<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api/client'
import { useAuth } from '../composables/useAuth'
import BrutalCard from '../components/brutal/BrutalCard.vue'
import BrutalTabs from '../components/brutal/BrutalTabs.vue'
import BrutalBadge from '../components/brutal/BrutalBadge.vue'
import BrutalButton from '../components/brutal/BrutalButton.vue'
import BrutalCheckbox from '../components/brutal/BrutalCheckbox.vue'
import BrutalInput from '../components/brutal/BrutalInput.vue'
import BrutalEmptyState from '../components/brutal/BrutalEmptyState.vue'
import BrutalSkeleton from '../components/brutal/BrutalSkeleton.vue'

interface LeaderboardApiItem {
  rank: number
  userId: number
  username: string
  problemsSolved: number
  easy: number
  medium: number
  hard: number
}

interface LeaderboardRow extends LeaderboardApiItem {
  score: number
  computedRank: number
}

const router = useRouter()
const { user } = useAuth()

const activeTab = ref<'global' | 'weighted' | 'hard'>('global')
const tabs = [
  { id: 'global', label: 'Global' },
  { id: 'weighted', label: 'Weighted' },
  { id: 'hard', label: 'Hard Focus' },
]

const showOnlyMe = ref(false)
const searchQuery = ref('')
const loading = ref(true)
const error = ref('')
const rows = ref<LeaderboardApiItem[]>([])

const fetchLeaderboard = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get<{ leaderboard: LeaderboardApiItem[] }>('/leaderboard')
    rows.value = response.leaderboard
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load leaderboard.'
    rows.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchLeaderboard)

const scoreFor = (item: LeaderboardApiItem) => {
  if (activeTab.value === 'global') return item.problemsSolved
  if (activeTab.value === 'hard') return item.hard
  return item.hard * 5 + item.medium * 3 + item.easy
}

const rankedEntries = computed<LeaderboardRow[]>(() => {
  let list = rows.value
    .map(item => ({
      ...item,
      score: scoreFor(item),
    }))
    .filter(item => item.score > 0)

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase()
    list = list.filter(item => item.username.toLowerCase().includes(query))
  }

  if (showOnlyMe.value && user.value) {
    list = list.filter(item => item.userId === user.value?.id)
  }

  return list
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (b.hard !== a.hard) return b.hard - a.hard
      if (b.medium !== a.medium) return b.medium - a.medium
      return b.easy - a.easy
    })
    .map((item, index) => ({
      ...item,
      computedRank: index + 1,
    }))
})

const topThree = computed(() => rankedEntries.value.slice(0, 3))
const tableEntries = computed(() => rankedEntries.value.slice(3))

const currentUserId = computed(() => user.value?.id ?? null)

const goToDashboard = () => {
  router.push('/dashboard')
}

const scoreLabel = computed(() => {
  if (activeTab.value === 'global') return 'Solved'
  if (activeTab.value === 'hard') return 'Hard Solves'
  return 'Weighted Score'
})
</script>

<template>
  <div class="leaderboard">
    <div class="leaderboard__container">
      <header class="leaderboard__header">
        <div>
          <h1 class="leaderboard__title">Leaderboard</h1>
          <p class="leaderboard__subtitle">Live rankings from real solved progress. No seed data.</p>
        </div>

        <div class="leaderboard__header-actions">
          <BrutalButton variant="secondary" size="sm" @click="fetchLeaderboard">Refresh</BrutalButton>
          <BrutalButton variant="secondary" size="sm" @click="goToDashboard">Back to Dashboard</BrutalButton>
        </div>
      </header>

      <BrutalCard variant="flat" padding="lg">
        <div class="leaderboard__toolbar">
          <BrutalTabs v-model="activeTab" :items="tabs" />

          <div class="leaderboard__filters">
            <BrutalInput
              v-model="searchQuery"
              label="Find user"
              placeholder="username"
            />

            <BrutalCheckbox
              v-model="showOnlyMe"
              label="Show only me"
              :disabled="!user"
            />
          </div>
        </div>
      </BrutalCard>

      <template v-if="loading">
        <section class="podium">
          <BrutalCard v-for="idx in 3" :key="idx" variant="elevated" padding="lg">
            <div class="podium-skeleton">
              <BrutalSkeleton width="40%" height="1.8rem" />
              <BrutalSkeleton width="70%" height="1rem" />
              <BrutalSkeleton width="50%" height="1rem" />
            </div>
          </BrutalCard>
        </section>
      </template>

      <BrutalCard v-else-if="error" variant="flat" padding="lg">
        <BrutalEmptyState
          title="Could not load leaderboard"
          :description="error"
          action-label="Retry"
          @action="fetchLeaderboard"
        />
      </BrutalCard>

      <BrutalCard v-else-if="rankedEntries.length === 0" variant="flat" padding="lg">
        <BrutalEmptyState
          title="No leaderboard entries"
          description="No one has completed problems yet for this filter."
          action-label="Reset filters"
          @action="() => { searchQuery = ''; showOnlyMe = false }"
        />
      </BrutalCard>

      <template v-else>
        <section class="podium">
          <BrutalCard
            v-for="entry in topThree"
            :key="entry.userId"
            variant="elevated"
            padding="lg"
            :accent="entry.computedRank === 1 ? 'yellow' : entry.computedRank === 2 ? 'turquoise' : 'coral'"
          >
            <div class="podium-card" :class="`podium-card--${entry.computedRank}`">
              <p class="podium-rank">#{{ entry.computedRank }}</p>
              <p class="podium-name">{{ entry.computedRank === 1 ? '👑 ' : '' }}{{ entry.username }}</p>
              <p class="podium-score">{{ entry.score }} {{ scoreLabel.toLowerCase() }}</p>
              <p class="podium-meta">Hard {{ entry.hard }} · Medium {{ entry.medium }} · Easy {{ entry.easy }}</p>
            </div>
          </BrutalCard>
        </section>

        <BrutalCard variant="flat" padding="none">
          <table class="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Coder</th>
                <th>{{ scoreLabel }}</th>
                <th>Breakdown</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="entry in tableEntries"
                :key="entry.userId"
                :class="{ 'leaderboard-row--me': entry.userId === currentUserId }"
              >
                <td>#{{ entry.computedRank }}</td>
                <td>{{ entry.username }}</td>
                <td>{{ entry.score }}</td>
                <td>H{{ entry.hard }} · M{{ entry.medium }} · E{{ entry.easy }}</td>
                <td>
                  <BrutalBadge
                    variant="status"
                    :tone="entry.computedRank <= 10 ? 'success' : 'neutral'"
                  >
                    {{ entry.computedRank <= 10 ? 'Top 10' : 'Climbing' }}
                  </BrutalBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </BrutalCard>
      </template>
    </div>
  </div>
</template>

<style scoped>
.leaderboard {
  min-height: 100vh;
  padding: 2rem 1rem 3rem;
}

.leaderboard__container {
  width: min(72rem, 100%);
  margin: 0 auto;
  display: grid;
  gap: 1rem;
}

.leaderboard__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.9rem;
  flex-wrap: wrap;
}

.leaderboard__header-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.leaderboard__title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  line-height: 1;
  margin: 0;
}

.leaderboard__subtitle {
  margin-top: 0.35rem;
  color: var(--color-text-secondary);
}

.leaderboard__toolbar {
  display: grid;
  gap: 0.9rem;
}

.leaderboard__filters {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: end;
}

.podium {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.podium-skeleton {
  display: grid;
  gap: 0.55rem;
}

.podium-card {
  text-align: center;
}

.podium-rank {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-weight-extrabold);
  line-height: 1;
  margin: 0;
}

.podium-name {
  margin-top: 0.35rem;
  font-weight: var(--font-weight-bold);
}

.podium-score {
  margin-top: 0.2rem;
  font-size: var(--text-xl);
  font-family: var(--font-display);
}

.podium-meta {
  margin-top: 0.2rem;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.podium-card--1 {
  transform: translateY(-6px);
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-table th,
.leaderboard-table td {
  padding: 0.65rem 0.85rem;
  text-align: left;
  border-bottom: 3px solid var(--color-border-subtle);
}

.leaderboard-table th {
  background: var(--color-background);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.leaderboard-table tbody tr:nth-child(odd) {
  background: rgba(255, 255, 255, 0.35);
}

.leaderboard-table tbody tr:hover {
  background: rgba(255, 230, 109, 0.24);
}

.leaderboard-row--me {
  background: rgba(255, 230, 109, 0.55) !important;
  font-weight: var(--font-weight-bold);
}

@media (max-width: 940px) {
  .podium {
    grid-template-columns: 1fr;
  }

  .leaderboard__filters {
    grid-template-columns: 1fr;
  }
}
</style>
