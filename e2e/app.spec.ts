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

    await expect(page.getByRole('heading', { level: 1, name: /Practice interview/i })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Get started free' }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'or continue as guest' })).toBeVisible()
    await page.getByText('or continue as guest').click()
    await expect(page).toHaveURL('/dashboard')
  })

  test('landing theme toggle switches and restores theme', async ({ page }) => {
    await page.goto('/')

    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', /light|dark/)

    const initialTheme = await html.getAttribute('data-theme')
    const nextTheme = initialTheme === 'dark' ? 'light' : 'dark'

    const themeButton = page.getByRole('button', { name: /Theme:/ }).first()
    await expect(themeButton).toBeVisible()
    await themeButton.click()
    await expect(html).toHaveAttribute('data-theme', nextTheme)

    await themeButton.click()
    await expect(html).toHaveAttribute('data-theme', initialTheme ?? 'light')
  })

  test('register flow can return to landing via auth nav home', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Get started free' }).first().click({ force: true })
    await expect(page).toHaveURL('/register')

    await page.getByTestId('auth-nav').getByRole('link', { name: 'Home' }).click()
    await expect(page).toHaveURL('/')
  })

  test('dashboard top nav can return to landing home', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByTestId('app-nav').getByRole('link', { name: 'Home' }).click()
    await expect(page).toHaveURL('/')
  })

  test('landing renders key conversion sections', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('landing-nav')).toBeVisible()
    await expect(page.getByTestId('landing-hero')).toBeVisible()
    await expect(page.getByTestId('landing-proof-tabs')).toBeVisible()
    await expect(page.getByTestId('landing-how-it-works')).toBeVisible()
    await expect(page.getByTestId('landing-problem-types')).toBeVisible()
    await expect(page.getByTestId('landing-faq')).toBeVisible()
    await expect(page.getByTestId('landing-final-cta')).toBeVisible()
  })

  test('landing anchor navigation scrolls to sections', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'How it works' }).click()
    await expect(page).toHaveURL(/#how-it-works/)

    const howTop = await page.locator('#how-it-works').evaluate((el) => el.getBoundingClientRect().top)
    expect(Math.abs(howTop)).toBeLessThan(220)

    await page.getByRole('link', { name: 'FAQ' }).click()
    await expect(page).toHaveURL(/#faq/)
    const faqTop = await page.locator('#faq').evaluate((el) => el.getBoundingClientRect().top)
    expect(Math.abs(faqTop)).toBeLessThan(220)
  })

  test('proof tabs support click and keyboard interactions', async ({ page }) => {
    await page.goto('/')

    const executionTab = page.getByRole('tab', { name: 'Real execution' })
    const feedbackTab = page.getByRole('tab', { name: 'Instant feedback' })
    const progressTab = page.getByRole('tab', { name: 'Progress tracking' })

    await expect(executionTab).toHaveAttribute('aria-selected', 'true')
    await feedbackTab.click()
    await expect(feedbackTab).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel')).toContainText('Get fast feedback while your context is fresh')

    await feedbackTab.focus()
    await page.keyboard.press('ArrowRight')
    await expect(progressTab).toHaveAttribute('aria-selected', 'true')

    await page.keyboard.press('Home')
    await expect(executionTab).toHaveAttribute('aria-selected', 'true')
  })

  test('landing mobile hero CTA is visible without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    await expect(
      page.getByTestId('landing-hero').getByRole('button', { name: 'Get started free' })
    ).toBeVisible()

    const hasHorizontalOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > window.innerWidth + 1
    )
    expect(hasHorizontalOverflow).toBe(false)
  })

  test('landing primary CTA uses subtle pulse feedback and pauses on hover', async ({ page }) => {
    await page.goto('/')

    const primaryCta = page.getByRole('button', { name: 'Get started free' }).first()
    await expect(primaryCta).toBeVisible()

    const initialState = await primaryCta.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return {
        animationName: style.animationName,
        animationPlayState: style.animationPlayState,
      }
    })

    expect(initialState.animationName).toContain('brutal-pulse-soft')
    expect(initialState.animationPlayState).toBe('running')

    await primaryCta.hover({ force: true })
    const hoverPlayState = await primaryCta.evaluate((el) => window.getComputedStyle(el).animationPlayState)
    expect(hoverPlayState).toBe('paused')
  })

  test('landing disables ambient motion in reduced-motion mode', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const primaryCta = page.getByRole('button', { name: 'Get started free' }).first()
    const ctaAnimationName = await primaryCta.evaluate((el) => window.getComputedStyle(el).animationName)
    expect(ctaAnimationName).toBe('none')

    const floatingShape = page.locator('.landing-page__deco').first()
    const shapeAnimationName = await floatingShape.evaluate((el) => window.getComputedStyle(el).animationName)
    expect(shapeAnimationName).toBe('none')
  })

  test('dashboard dark mode keeps action buttons visible and unclipped', async ({ page }) => {
    await page.goto('/dashboard')

    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Leaderboard' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Start daily challenge' })).toBeVisible()

    const themeButton = page.getByRole('button', { name: /Theme:/ }).first()
    await expect(themeButton).toBeVisible()
    await themeButton.click()

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await page.waitForTimeout(700)

    const dailyChallengeButton = page.getByRole('button', { name: 'Start daily challenge' })
    const lightModeSecondary = [78, 205, 196]

    for (const button of [dailyChallengeButton, themeButton]) {
      const data = await getButtonContrast(button)
      expect(data.clippedX, `${data.text} is clipped horizontally`).toBe(false)
      expect(data.clippedY, `${data.text} is clipped vertically`).toBe(false)

      const ratio = contrastRatio(parseRgb(data.color), parseRgb(data.background))
      expect(ratio, `${data.text} contrast is too low`).toBeGreaterThan(3)

      const bgDistance = colorDistance(parseRgb(data.background), lightModeSecondary)
      expect(bgDistance, `${data.text} still uses light-mode accent color`).toBeGreaterThan(20)
    }
  })

  test('app navbar shows contextual actions on dashboard profile and leaderboard', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByRole('button', { name: 'Start daily challenge' })).toBeVisible()

    await page.goto('/profile')
    await expect(page.getByRole('button', { name: 'Refresh profile' })).toBeVisible()

    await page.goto('/leaderboard')
    await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible()
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
