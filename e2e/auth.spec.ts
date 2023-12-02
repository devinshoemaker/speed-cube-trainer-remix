import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { cleanupUser, visitAndCheck } from "./lib/utils";

test.describe("Authentication", () => {
  let email = "";

  test.afterEach(async ({ page }) => {
    await cleanupUser(email, page);
  });

  test("should allow you to register and login", async ({ page }) => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };
    email = loginForm.email;

    await visitAndCheck("/", page);
    await page.getByRole("link", { name: /sign up/i }).click();

    await page.getByRole("textbox", { name: /email/i }).fill(loginForm.email);
    await page.getByLabel(/password/i).fill(loginForm.password);
    await page.getByRole("button", { name: /create account/i }).click();

    await page.getByRole("link", { name: /notes/i }).click();
    await page.getByRole("button", { name: /logout/i }).click();
    await expect(page.getByRole("link", { name: /log in/i })).toBeVisible();
  });
});
