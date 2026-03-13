import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test('loads and shows hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/CodeCraft/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Master coding interviews')
  })

  test('shows navigation', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('app-nav')).toBeVisible()
    await expect(page.getByRole('link', { name: 'CodeCraft' }).first()).toBeVisible()
  })

  test('CTA navigates to register', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Get started free' }).click()
    await expect(page).toHaveURL(/register/)
  })

  test('Browse problems navigates to dashboard', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Browse problems' }).click()
    await expect(page).toHaveURL(/dashboard/)
  })

  test('How it works section is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'How it works' })).toBeVisible()
  })
})
