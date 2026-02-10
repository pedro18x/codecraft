<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useProblemProgress } from '../composables/useProblemProgress'
import BrutalCard from '../components/brutal/BrutalCard.vue'
import BrutalTabs from '../components/brutal/BrutalTabs.vue'
import BrutalDropdown from '../components/brutal/BrutalDropdown.vue'
import BrutalCheckbox from '../components/brutal/BrutalCheckbox.vue'
import BrutalBadge from '../components/brutal/BrutalBadge.vue'
import BrutalButton from '../components/brutal/BrutalButton.vue'

interface LeaderboardItem {
  rank: number
  name: string
  score: number
  streak: number
  friendsOnly: boolean
}

const router = useRouter()
const { user } = useAuth()
const { completedCount } = useProblemProgress()

const activeTab = ref('global')
const tabs = [
  { id: 'global', label: 'Global' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'streak', label: 'Streak' },
]

const timeframe = ref('7d')
const friendsOnly = ref(false)

const timeframeOptions = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'All time', value: 'all' },
]

const baseEntries = computed<LeaderboardItem[]>(() => {
  const seed = [
    { name: 'AlgoAva', score: 980, streak: 41, friendsOnly: false },
    { name: 'BinaryBen', score: 920, streak: 32, friendsOnly: false },
    { name: 'CacheCora', score: 890, streak: 29, friendsOnly: true },
    { name: 'DeltaDev', score: 850, streak: 23, friendsOnly: false },
    { name: 'EdgeEli', score: 810, streak: 18, friendsOnly: true },
    { name: 'FluxFaye', score: 760, streak: 17, friendsOnly: false },
    { name: 'GraphGia', score: 730, streak: 14, friendsOnly: false },
  ]

  const currentName = user.value?.username ?? 'Guest Coder'
  const currentScore = 520 + completedCount.value * 22
  const currentStreak = Math.max(1, Math.floor(completedCount.value / 2))

  const entries = [...seed, {
    name: currentName,
    score: currentScore,
    streak: currentStreak,
    friendsOnly: false,
  }]

  return entries.map((item, index) => ({
    rank: index + 1,
    ...item,
  }))
})

const rankedEntries = computed(() => {
  let multiplier = 1

  if (activeTab.value === 'weekly') multiplier = 0.6
  if (activeTab.value === 'streak') multiplier = 0.4

  const entries = baseEntries.value
    .filter(item => !friendsOnly.value || item.friendsOnly || item.name === (user.value?.username ?? 'Guest Coder'))
    .map(item => {
      const adjustedScore = activeTab.value === 'streak'
        ? item.streak * 100
        : Math.round(item.score * multiplier)

      return {
        ...item,
        score: adjustedScore,
      }
    })
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }))

  return entries
})

const topThree = computed(() => rankedEntries.value.slice(0, 3))
const restEntries = computed(() => rankedEntries.value.slice(3))

const currentUserName = computed(() => user.value?.username ?? 'Guest Coder')

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="leaderboard">
    <div class="leaderboard__container">
      <header class="leaderboard__header">
        <div>
          <h1 class="leaderboard__title">Leaderboard</h1>
          <p class="leaderboard__subtitle">Compete with coders and climb the brutal podium.</p>
        </div>

        <BrutalButton variant="ghost" size="sm" @click="goToDashboard">Back to Dashboard</BrutalButton>
      </header>

      <BrutalCard variant="flat" padding="lg">
        <div class="leaderboard__toolbar">
          <BrutalTabs v-model="activeTab" :items="tabs" />

          <div class="leaderboard__filters">
            <BrutalDropdown v-model="timeframe" :options="timeframeOptions" />
            <BrutalCheckbox v-model="friendsOnly" type="checkbox" label="Friends only" />
          </div>
        </div>
      </BrutalCard>

      <section class="podium">
        <BrutalCard
          v-for="entry in topThree"
          :key="entry.name"
          variant="elevated"
          padding="lg"
          :accent="entry.rank === 1 ? 'yellow' : entry.rank === 2 ? 'turquoise' : 'coral'"
        >
          <div class="podium-card" :class="`podium-card--${entry.rank}`">
            <p class="podium-rank">#{{ entry.rank }}</p>
            <p class="podium-name">
              {{ entry.rank === 1 ? '👑 ' : '' }}{{ entry.name }}
            </p>
            <p class="podium-score">{{ entry.score }} pts</p>
            <p class="podium-streak">{{ entry.streak }} day streak</p>
          </div>
        </BrutalCard>
      </section>

      <BrutalCard variant="flat" padding="none">
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Coder</th>
              <th>Score</th>
              <th>Streak</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="entry in restEntries"
              :key="entry.name"
              :class="{ 'leaderboard-row--me': entry.name === currentUserName }"
            >
              <td>#{{ entry.rank }}</td>
              <td>{{ entry.name }}</td>
              <td>{{ entry.score }}</td>
              <td>{{ entry.streak }}d</td>
              <td>
                <BrutalBadge
                  variant="status"
                  :tone="entry.rank <= 10 ? 'success' : 'neutral'"
                >
                  {{ entry.rank <= 10 ? 'Top 10' : 'Climbing' }}
                </BrutalBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </BrutalCard>
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
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
}

.leaderboard__title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  line-height: 1;
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
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.podium {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.podium-card {
  text-align: center;
}

.podium-rank {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-weight-extrabold);
  line-height: 1;
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

.podium-streak {
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
}
</style>
