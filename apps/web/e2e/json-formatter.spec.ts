import { test, expect } from "@playwright/test";

test.describe("JSON Formatter", () => {
  test("formats valid JSON and shows formatted output", async ({ page }) => {
    await page.goto("/tools/json-formatter");

    await page.fill("textarea", '{"name":"benflux"}');

    const output = page.locator('[data-testid="output"]');
    await expect(output).toBeVisible();
    await expect(output).toContainText('"name": "benflux"');
  });

  test("shows error banner for invalid JSON", async ({ page }) => {
    await page.goto("/tools/json-formatter");

    await page.fill("textarea", "{invalid}");

    const errorBanner = page.locator('[data-testid="error"]');
    await expect(errorBanner).toBeVisible();
  });

  test("does not execute injected HTML in string values (XSS regression)", async ({ page }) => {
    await page.goto("/tools/json-formatter");

    let dialogFired = false;
    page.on("dialog", async (dialog) => {
      dialogFired = true;
      await dialog.dismiss();
    });

    await page.fill("textarea", '{"a": "<img src=x onerror=alert(1)>"}');

    const output = page.locator('[data-testid="output"]');
    await expect(output).toBeVisible();
    await expect(output).toContainText("<img src=x onerror=alert(1)>");
    expect(await output.locator("img").count()).toBe(0);
    expect(dialogFired).toBe(false);
  });
});
