import { test, expect } from "@playwright/test";

test.describe("Converters hub", () => {
  test("lists every conversion in the registry, grouped by category", async ({ page }) => {
    await page.goto("/converters");
    await expect(page.locator('[data-testid="converters-count"]')).toContainText("64 conversions");
    await expect(page.getByRole("heading", { name: "JSON", exact: true })).toBeVisible();
  });

  test("search filters the visible conversions", async ({ page }) => {
    await page.goto("/converters");
    const before = await page.locator('[data-testid^="converter-"]').count();

    await page.fill('[data-testid="converters-search"]', "yaml");
    await expect(page.locator('[data-testid^="converter-"]')).toHaveCount(4);

    const after = await page.locator('[data-testid^="converter-"]').count();
    expect(after).toBeLessThan(before);
  });

  test("an available conversion links to its tool page", async ({ page }) => {
    await page.goto("/converters");
    await page.fill('[data-testid="converters-search"]', "xml");
    const link = page.locator('[data-testid="converter-other-xml-json"]');
    await expect(link).toBeVisible();
    await Promise.all([page.waitForURL(/xml-to-json/), link.click()]);
  });
});
