import { test, expect, type Locator } from '@playwright/test'

const parseRgb = (value: string) => {
  const match = value.match(/rgba?\(([^)]+)\)/)
  if (!match) return [0, 0, 0]
  const [r, g, b] = match[1].split(',').slice(0, 3).map(v => Number(v.trim()))
  return [r, g, b]
}

const relativeLuminance = ([r, g, b]: number[]) => {
  const toLinear = (channel: number) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

const contrastRatio = (a: number[], b: number[]) => {
  const l1 = relativeLuminance(a)
  const l2 = relativeLuminance(b)
  const [light, dark] = l1 >= l2 ? [l1, l2] : [l2, l1]
  return (light + 0.05) / (dark + 0.05)
}

const colorDistance = (a: number[], b: number[]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])

const getButtonContrast = async (locator: Locator) => {
  return locator.evaluate((el) => {
    const style = window.getComputedStyle(el)
    return {
      color: style.color,
      background: style.backgroundColor,
      border: style.borderColor,
      text: el.textContent?.trim() ?? '',
      clippedX: el.scrollWidth > el.clientWidth + 1,
      clippedY: el.scrollHeight > el.clientHeight + 1,
    }
  })
}

test.describe('CodeCraft MVP UX', () => {
  test('landing to dashboard flow works', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Practice coding interviews')).toBeVisible()
    await page.getByText('or continue as guest').click()
    await expect(page).toHaveURL('/dashboard')
  })

  test('dashboard dark mode keeps action buttons visible and unclipped', async ({ page }) => {
    await page.goto('/dashboard')

    await expect(page.getByRole('button', { name: 'Profile' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Leaderboard' })).toBeVisible()

    const themeButton = page.getByRole('button', { name: /Theme:/ })
    await expect(themeButton).toBeVisible()
    await themeButton.click()

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await page.waitForTimeout(700)

    const profileButton = page.getByRole('button', { name: 'Profile' })
    const leaderboardButton = page.getByRole('button', { name: 'Leaderboard' })
    const lightModeSecondary = [78, 205, 196]

    for (const button of [profileButton, leaderboardButton, themeButton]) {
      const data = await getButtonContrast(button)
      expect(data.clippedX, `${data.text} is clipped horizontally`).toBe(false)
      expect(data.clippedY, `${data.text} is clipped vertically`).toBe(false)

      const ratio = contrastRatio(parseRgb(data.color), parseRgb(data.background))
      expect(ratio, `${data.text} contrast is too low`).toBeGreaterThan(3)

      const bgDistance = colorDistance(parseRgb(data.background), lightModeSecondary)
      expect(bgDistance, `${data.text} still uses light-mode accent color`).toBeGreaterThan(20)
    }
  })

  test('problem status is readable without hover', async ({ page }) => {
    await page.goto('/dashboard')

    const firstRow = page.locator('.problem-row').first()
    await expect(firstRow).toBeVisible()

    const statusChip = firstRow.locator('.brutal-badge').last()
    await expect(statusChip).toBeVisible()

    const statusText = await statusChip.textContent()
    expect(statusText?.trim().toLowerCase()).toMatch(/todo|attempted|solved/)

    const opacity = await statusChip.evaluate(el => Number(window.getComputedStyle(el).opacity))
    expect(opacity).toBeGreaterThan(0.9)
  })

  test('practice editor loads and test run shows results', async ({ page }) => {
    await page.goto('/practice/two-sum')

    await expect(page.getByText('#1 Two Sum')).toBeVisible()

    const runButton = page.getByRole('button', { name: /Run/i }).first()
    await expect(runButton).toBeVisible()

    await runButton.click()
    await expect(
      page.locator('.results-header__status').getByText(/All tests passed|\d+\/\d+ passed/i)
    ).toBeVisible({ timeout: 10000 })
  })

  test('profile and leaderboard fail gracefully when unauthenticated', async ({ page }) => {
    await page.goto('/profile')
    await expect(page.getByText('Sign in to view profile analytics')).toBeVisible()

    await page.goto('/leaderboard')
    await expect(
      page
        .getByText('Could not load leaderboard')
        .or(page.getByText('No leaderboard entries'))
        .or(page.getByRole('table'))
    ).toBeVisible({ timeout: 10000 })
  })
})
