import { z } from 'zod'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const BoolLike = z
  .union([z.boolean(), z.string()])
  .transform((value) => {
    if (typeof value === 'boolean') return value
    return value.toLowerCase() === 'true'
  })

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  AUTH_COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SECURE: BoolLike.optional(),
  CSRF_COOKIE_NAME: z.string().default('csrf_token'),
  ALLOW_BEARER_AUTH_FALLBACK: BoolLike.default(false),
  CSP_REPORT_ONLY: BoolLike.default(true),
  EXECUTOR_URL: z.string().url().optional(),
  EXECUTOR_SERVICE_TOKEN: z.string().min(16).default('dev-executor-service-token'),
  EXECUTOR_ALLOWED_IPS: z.string().optional(),
  EXECUTOR_MAX_CONCURRENCY: z.coerce.number().int().min(1).max(32).default(2),
  EXECUTOR_MAX_QUEUE: z.coerce.number().int().min(1).max(200).default(40),
  EXECUTOR_TIMEOUT_MS: z.coerce.number().default(5000),
  EXECUTOR_MEMORY_LIMIT_MB: z.coerce.number().default(128),
  OPENROUTER_API_KEY: z.string().min(1),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
})

const parsed = EnvSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment variables:')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

const base = parsed.data

export const env = {
  ...base,
  COOKIE_SECURE: base.COOKIE_SECURE ?? base.NODE_ENV === 'production',
}
