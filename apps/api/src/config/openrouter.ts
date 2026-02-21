import OpenAI from 'openai'
import { env } from './env.js'

export const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://codecraft.dev',
    'X-Title': 'CodeCraft',
  },
})

// Free models tried in order — if first is unavailable, fallback to second
export const AI_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
]
