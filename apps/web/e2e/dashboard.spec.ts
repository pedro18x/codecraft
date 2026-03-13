import { test, expect } from '@playwright/test'

test.describe('Dashboard page', () => {
  test('loads and shows problem list header', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: 'Problems' })).toBeVisible()
  })

  test('shows filter controls', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByPlaceholder('Search problems…')).toBeVisible()
  })

  test('navigation bar is visible on dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByTestId('app-nav')).toBeVisible()
  })
})
