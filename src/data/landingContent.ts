export type LandingSectionId = 'hero' | 'how-it-works' | 'problem-types' | 'faq' | 'final-cta'

export type ProofTabId = 'execution' | 'feedback' | 'progress'

export interface LandingSectionLink {
  id: Exclude<LandingSectionId, 'hero' | 'final-cta'>
  label: string
}

export interface HeroContent {
  badge: string
  title: string
  titleAccent: string
  description: string
  pills: string[]
  previewTitle: string
  previewCode: string
}

export interface ProofTabContent {
  id: ProofTabId
  label: string
  title: string
  description: string
  bullets: string[]
  snippet: string
}

export interface HowItWorksStep {
  title: string
  description: string
  proof: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export const landingSectionLinks: LandingSectionLink[] = [
  { id: 'how-it-works', label: 'How it works' },
  { id: 'problem-types', label: 'Problem types' },
  { id: 'faq', label: 'FAQ' },
]

export const heroContent: HeroContent = {
  badge: 'INTERVIEW PREP PLATFORM',
  title: 'Practice interview',
  titleAccent: 'problems with intent',
  description:
    'Train on real coding interview patterns, run code instantly, and build consistency before your next interview loop.',
  pills: ['Real code execution', 'JS & TypeScript', 'Instant feedback'],
  previewTitle: 'two-sum.ts',
  previewCode: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>()
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]
    if (seen.has(need)) return [seen.get(need)!, i]
    seen.set(nums[i], i)
  }
  return []
}`,
}

export const proofTabs: ProofTabContent[] = [
  {
    id: 'execution',
    label: 'Real execution',
    title: 'Run interview code in a real execution flow',
    description:
      'Write your solution, run tests, and inspect outputs immediately without leaving the practice surface.',
    bullets: [
      'Submit JavaScript or TypeScript code from the editor.',
      'Review pass/fail results per test case.',
      'Re-run quickly while iterating on edge cases.',
    ],
    snippet: `Run tests
Status: 3/3 passed
Case 1: [2,7,11,15], 9 -> [0,1]`,
  },
  {
    id: 'feedback',
    label: 'Instant feedback',
    title: 'Get fast feedback while your context is fresh',
    description:
      'Feedback appears right after each run so you can debug, refine, and retry before momentum drops.',
    bullets: [
      'See expected vs actual output side by side.',
      'Catch logic issues as soon as they appear.',
      'Use the result stream to guide your next revision.',
    ],
    snippet: `Expected: true
Actual: false
Hint: Check bracket matching order in stack operations.`,
  },
  {
    id: 'progress',
    label: 'Progress tracking',
    title: 'Track progress problem by problem',
    description:
      'Keep your practice intentional with status tracking across the full interview problem set.',
    bullets: [
      'Status states: Todo, Attempted, Solved.',
      'Resume from your dashboard with one click.',
      'Use the leaderboard flow once you sign in.',
    ],
    snippet: `Dashboard
Progress: solved / attempted / todo
Next recommended: Binary Search`,
  },
]

export const howItWorksSteps: HowItWorksStep[] = [
  {
    title: 'Pick a pressure-tested problem',
    description: 'Choose a challenge by difficulty and topic based on your interview target.',
    proof: 'Problem list includes common interview categories and filters.',
  },
  {
    title: 'Write and run your solution',
    description: 'Code in the editor, execute tests, and validate correctness quickly.',
    proof: 'Execution results return with per-case status feedback.',
  },
  {
    title: 'Improve with structured repetition',
    description: 'Review attempts, solve gaps, and keep a steady preparation rhythm.',
    proof: 'Dashboard progress states and leaderboard path support consistency.',
  },
]

export const faqItems: FaqItem[] = [
  {
    id: 'faq-languages',
    question: 'Which languages can I use?',
    answer:
      'You can practice with JavaScript and TypeScript in the landing flow today, with problem content structured for common interview patterns.',
  },
  {
    id: 'faq-levels',
    question: 'Are there different difficulty levels?',
    answer:
      'Yes. The problem set includes Easy, Medium, and Hard levels so you can adapt practice intensity to your interview timeline.',
  },
  {
    id: 'faq-progress',
    question: 'Can I track what I have solved?',
    answer:
      'Yes. Signed-in users can track progress and revisit unfinished problems from the dashboard and profile views.',
  },
  {
    id: 'faq-guest',
    question: 'Can I try it before creating an account?',
    answer:
      'Yes. You can continue as a guest and start practicing immediately, then register when you want to keep persistent progress.',
  },
  {
    id: 'faq-feedback',
    question: 'How fast is the feedback loop?',
    answer:
      'Runs return immediate pass/fail style output so you can iterate while your reasoning stays active.',
  },
  {
    id: 'faq-account',
    question: 'Why should I create an account?',
    answer:
      'An account unlocks persistent progress tracking, profile analytics, and leaderboard participation across sessions.',
  },
]
