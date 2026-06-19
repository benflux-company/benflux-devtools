import { test, expect } from '@playwright/test'

test.describe('JSON Formatter', () => {
  test('formats valid JSON and shows formatted output', async ({ page }) => {
    await page.goto('/tools/json-formatter')

    await page.fill('textarea', '{"name":"benflux"}')

    const output = page.locator('[data-testid="output"]')
    await expect(output).toBeVisible()
    await expect(output).toContainText('"name": "benflux"')
  })

  test('shows error banner for invalid JSON', async ({ page }) => {
    await page.goto('/tools/json-formatter')

    await page.fill('textarea', '{invalid}')

    const errorBanner = page.locator('[data-testid="error"]')
    await expect(errorBanner).toBeVisible()
  })
})
