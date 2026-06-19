import { test, expect } from '@playwright/test'

test.describe('Login page', () => {
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login')

    // Page title
    await expect(page).toHaveTitle(/Login|Benflux DevTools/)

    // Key elements visible
    await expect(page.locator('[data-testid="login-page"]')).toBeVisible()
    await expect(page.locator('[data-testid="login-heading"]')).toBeVisible()
    await expect(page.locator('[data-testid="login-heading"]')).toContainText('Benflux DevTools')

    // GitHub login button present and has correct href
    const githubBtn = page.locator('[data-testid="github-login-btn"]')
    await expect(githubBtn).toBeVisible()
    await expect(githubBtn).toContainText('Continue with GitHub')
    await expect(githubBtn).toHaveAttribute('href', '/api/auth/github')
  })
})
