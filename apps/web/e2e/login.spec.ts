import { test, expect } from "@playwright/test";

test.describe("Login page", () => {
  test("login page renders correctly", async ({ page }) => {
    await page.goto("/login");

    await expect(page).toHaveTitle(/Login|Benflux DevTools/);

    await expect(page.locator('[data-testid="login-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-heading"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-heading"]')).toContainText(
      "Benflux DevTools",
    );

    const githubBtn = page.locator('[data-testid="github-login-btn"]');
    await expect(githubBtn).toBeVisible();
    await expect(githubBtn).toContainText("Continue with GitHub");
    await expect(githubBtn).toHaveAttribute("href", "/api/auth/github");
  });
});
