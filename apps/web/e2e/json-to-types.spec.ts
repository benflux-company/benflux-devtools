import { test, expect } from "@playwright/test";

test.describe("JSON to Types", () => {
  test("generates a TypeScript interface from JSON", async ({ page }) => {
    await page.goto("/tools/json-to-types");
    await page.fill("textarea", '{"name": "benflux", "stars": 42}');

    const output = page.locator('[data-testid="output"]');
    await expect(output).toBeVisible();
    await expect(output).toContainText("interface Root");
    await expect(output).toContainText("name: string");
  });

  test("switches to the Zod tab and shows a z.object schema", async ({ page }) => {
    await page.goto("/tools/json-to-types");
    await page.fill("textarea", '{"name": "benflux"}');
    await page.getByRole("tab", { name: "Zod" }).click();

    const output = page.locator('[data-testid="output"]');
    await expect(output).toContainText("z.object");
  });

  test("switches to the JSON Schema tab and shows a draft-07 schema", async ({ page }) => {
    await page.goto("/tools/json-to-types");
    await page.fill("textarea", '{"name": "benflux"}');
    await page.getByRole("tab", { name: "JSON Schema" }).click();

    const output = page.locator('[data-testid="output"]');
    await expect(output).toContainText("draft-07");
  });

  test("shows an error banner for invalid JSON", async ({ page }) => {
    await page.goto("/tools/json-to-types");
    await page.fill("textarea", "{not valid}");

    await expect(page.locator('[data-testid="error"]')).toBeVisible();
  });

  test("renaming the root updates the generated type name", async ({ page }) => {
    await page.goto("/tools/json-to-types");
    await page.fill("textarea", '{"name": "benflux"}');
    await page.fill('[data-testid="root-name-input"]', "Repo");

    await expect(page.locator('[data-testid="output"]')).toContainText("interface Repo");
  });
});
