import { test, expect } from '@playwright/test'

test.describe('Auth pages', () => {
  test('login page renders form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Create one' })).toBeVisible()
  })

  test('register page renders form', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
  })

  test('login shows validation error when empty', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByRole('alert')).toContainText('Please fill in all fields')
  })

  test('register shows validation error when short password', async ({ page }) => {
    await page.goto('/register')
    await page.getByPlaceholder('you@example.com').fill('test@example.com')
    await page.getByPlaceholder('your_handle').fill('testuser')
    await page.getByPlaceholder('Min. 8 characters').fill('short')
    await page.getByRole('button', { name: 'Create account' }).click()
    await expect(page.getByRole('alert')).toContainText('8 characters')
  })

  test('login link on register page navigates to login', async ({ page }) => {
    await page.goto('/register')
    await page.getByRole('link', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/login/)
  })
})
