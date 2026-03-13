import { test, expect } from '@playwright/test'

const SECRET = process.env.ADMIN_LOGIN_SECRET ?? 'codecraft-admin-secret-2026'

test.describe('Admin login', () => {
  test('admin login blocked without key', async ({ page }) => {
    await page.goto('/admin/login')
    // Middleware redirects to /404 — we should NOT end up at /admin/login
    await expect(page).not.toHaveURL(/\/admin\/login/)
  })

  test('admin login accessible with valid key', async ({ page }) => {
    await page.goto(`/admin/login?key=${SECRET}`)
    // After key validation the middleware strips the key param and sets a cookie
    await expect(page.getByRole('heading', { name: 'Admin portal' })).toBeVisible()
  })

  test('admin login shows error for non-admin user', async ({ page }) => {
    // First visit with key to get the portal cookie
    await page.goto(`/admin/login?key=${SECRET}`)
    await expect(page.getByRole('heading', { name: 'Admin portal' })).toBeVisible()

    // Attempt login with a regular (non-admin) account
    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByRole('alert')).toContainText('admin accounts only')
  })

  test('accessing /admin while logged out redirects to /admin/login', async ({ page }) => {
    // Ensure we have the portal cookie so /admin/login itself is accessible
    await page.goto(`/admin/login?key=${SECRET}`)

    // Navigate directly to /admin without being authenticated
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/login/)
  })
})
