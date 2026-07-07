import { test, expect } from "@playwright/test";

test.describe("JSON <-> YAML", () => {
  test("converts JSON to YAML", async ({ page }) => {
    await page.goto("/tools/json-yaml");
    await page.fill("textarea", '{"name": "benflux"}');
    await expect(page.locator('[data-testid="output"]')).toContainText("name: benflux");
  });

  test("swap button flips the conversion direction", async ({ page }) => {
    await page.goto("/tools/json-yaml");
    await page.fill("textarea", '{"name": "benflux"}');
    await expect(page.locator('[data-testid="output"]')).toContainText("name: benflux");

    await page.click('[data-testid="swap-direction"]');
    // The YAML output became the new input; converting it back should read as JSON again.
    await expect(page.locator('[data-testid="output"]')).toContainText('"name": "benflux"');
  });
});

test.describe("JSON <-> TOML", () => {
  test("converts JSON to TOML", async ({ page }) => {
    await page.goto("/tools/json-toml");
    await page.fill("textarea", '{"name": "benflux"}');
    await expect(page.locator('[data-testid="output"]')).toContainText('name = "benflux"');
  });
});

test.describe("XML to JSON", () => {
  test("converts XML to JSON", async ({ page }) => {
    await page.goto("/tools/xml-to-json");
    await page.fill("textarea", "<root><name>benflux</name></root>");
    await expect(page.locator('[data-testid="output"]')).toContainText('"name": "benflux"');
  });
});
