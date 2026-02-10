import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should display hero and CTAs', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Practice coding interviews')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Get started free' }).or(page.getByRole('button', { name: 'Get started free' }))).toBeVisible()
    await expect(page.getByText('or continue as guest')).toBeVisible()
  })

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Sign in' }).or(page.getByRole('button', { name: 'Sign in' })).click()

    await expect(page).toHaveURL('/login')
    await expect(page.getByText('Welcome back')).toBeVisible()
  })

  test('should navigate to dashboard as guest', async ({ page }) => {
    await page.goto('/')

    await page.getByText('or continue as guest').click()

    await expect(page).toHaveURL('/dashboard')
  })
})

test.describe('Auth Pages', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByText('Welcome back')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
    await expect(page.getByText("Don't have an account?")).toBeVisible()
  })

  test('should display register form', async ({ page }) => {
    await page.goto('/register')

    await expect(page.getByText('Create your account')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Confirm password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible()
  })

  test('should show error for empty login form', async ({ page }) => {
    await page.goto('/login')

    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByText('Please fill in all fields')).toBeVisible()
  })

  test('should show error for mismatched passwords', async ({ page }) => {
    await page.goto('/register')

    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Username').fill('testuser')
    await page.getByLabel('Password', { exact: true }).fill('password123')
    await page.getByLabel('Confirm password').fill('differentpassword')

    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page.getByText('Passwords do not match')).toBeVisible()
  })

  test('should navigate between login and register', async ({ page }) => {
    await page.goto('/login')

    // Go to register
    await page.getByRole('link', { name: 'Sign up' }).click()
    await expect(page).toHaveURL('/register')

    // Go back to login
    await page.getByRole('link', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/login')
  })

  test('should allow continuing without account from auth pages', async ({ page }) => {
    await page.goto('/login')

    await page.getByText('Continue without an account').click()

    await expect(page).toHaveURL('/dashboard')
  })
})

test.describe('Dashboard (Guest Mode)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
  })

  test('should display dashboard with problem list', async ({ page }) => {
    await expect(page.getByText('Dashboard')).toBeVisible()
    await expect(page.getByText('All Problems')).toBeVisible()
  })

  test('should display difficulty filters', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Easy', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Medium', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Hard', exact: true })).toBeVisible()
  })

  test('should show progress stats', async ({ page }) => {
    await expect(page.getByText('Progress')).toBeVisible()
    await expect(page.getByText('Completed')).toBeVisible()
  })

  test('should filter problems by difficulty', async ({ page }) => {
    // Click Easy filter
    await page.getByRole('button', { name: 'Easy', exact: true }).click()

    // The filtered count should change
    const problemCards = page.locator('[class*="problem-item"]')
    const count = await problemCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should search problems', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search problems...')
    await searchInput.fill('Two Sum')

    // Should find the problem
    await expect(page.getByText('Two Sum').first()).toBeVisible()
  })

  test('should handle empty search results', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search problems...')
    await searchInput.fill('NonexistentProblemXYZ')

    await expect(page.getByText('No problems found')).toBeVisible()
  })

  test('should navigate to a problem', async ({ page }) => {
    // Click on a problem card
    await page.getByText('Two Sum').first().click()

    // Should navigate to the practice page
    await expect(page).toHaveURL(/\/practice\/two-sum/)
  })
})

test.describe('Practice View (Guest Mode)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/practice/two-sum')
  })

  test('should display problem details', async ({ page }) => {
    await expect(page.getByText('#1 Two Sum')).toBeVisible()
  })

  test('should show code editor with language tabs', async ({ page }) => {
    // Language tabs should be visible (rendered as full names with CSS capitalize)
    await expect(page.getByRole('button', { name: 'javascript' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'typescript' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'python' })).toBeVisible()

    // Code editor (textarea) should exist
    const editor = page.locator('textarea')
    await expect(editor).toBeVisible()
  })

  test('should switch languages', async ({ page }) => {
    const editor = page.locator('textarea')

    // Get initial code (TypeScript by default)
    const tsCode = await editor.inputValue()
    expect(tsCode).toContain('number[]')

    // Switch to JavaScript
    await page.getByRole('button', { name: 'javascript' }).click()
    const jsCode = await editor.inputValue()
    expect(jsCode).not.toContain('number[]')

    // Switch to Python
    await page.getByRole('button', { name: 'python' }).click()
    const pyCode = await editor.inputValue()
    expect(pyCode).toContain('def ')
  })

  test('should run tests (mock mode for guest)', async ({ page }) => {
    // Click Run Tests
    await page.getByRole('button', { name: /Run/i }).click()

    // Should show running state, then results (results display "Test 1", "Test 2", etc.)
    await expect(page.getByText(/Test \d/).first()).toBeVisible({ timeout: 5000 })
  })

  test('should edit and persist code in localStorage', async ({ page }) => {
    const editor = page.locator('textarea')

    // Default language is TypeScript - modify the code
    await editor.fill('function twoSum(nums: number[], target: number): number[] { return [0, 1]; }')

    // Navigate away and come back
    await page.goto('/dashboard')
    await page.goto('/practice/two-sum')

    // Code should be persisted for the same language (TypeScript is default)
    const savedCode = await page.locator('textarea').inputValue()
    expect(savedCode).toContain('return [0, 1]')
  })

  test('should reset code to starter template', async ({ page }) => {
    const editor = page.locator('textarea')
    const originalCode = await editor.inputValue()

    // Modify code
    await editor.fill('// modified')

    // Accept the confirm dialog
    page.on('dialog', (dialog) => dialog.accept())

    // Click Reset
    await page.getByText('Reset').click()

    // Code should be restored
    await expect(editor).toHaveValue(originalCode)
  })

  test('should navigate back to dashboard', async ({ page }) => {
    // Click the back button (arrow icon)
    await page.locator('[aria-label="Back to dashboard"]').click()

    await expect(page).toHaveURL('/dashboard')
  })

  test('should handle non-existent problem', async ({ page }) => {
    await page.goto('/practice/nonexistent-problem')

    await expect(page.getByText('Problem not found')).toBeVisible()
    await expect(page.getByText('Back to dashboard')).toBeVisible()
  })
})
