import { test, expect } from '@playwright/test'

test.describe('JSON Formatter', () => {
  test('formats valid JSON and shows formatted output', async ({ page }) => {
    await page.goto('/tools/json-formatter')

    // Fill textarea with valid JSON
    await page.fill('textarea', '{"name":"benflux"}')

    // Wait for debounce (300ms) + a bit more
    await page.waitForTimeout(500)

    // Output panel should contain the formatted JSON
    const output = page.locator('[data-testid="output"]')
    await expect(output).toBeVisible()
    await expect(output).toContainText('"name": "benflux"')
  })

  test('shows error banner for invalid JSON', async ({ page }) => {
    await page.goto('/tools/json-formatter')

    // Fill textarea with invalid JSON
    await page.fill('textarea', '{invalid}')

    // Wait for debounce
    await page.waitForTimeout(500)

    // Error banner should be visible
    const errorBanner = page.locator('[data-testid="error"]')
    await expect(errorBanner).toBeVisible()
  })
})
