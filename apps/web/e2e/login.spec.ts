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

    const loginBtn = page.locator('[data-testid="auth-login-btn"]');
    await expect(loginBtn).toBeVisible();
    await expect(loginBtn).toContainText("Sign in with Benflux");
    await expect(loginBtn).toHaveAttribute("href", /\/login$/);
  });
});
