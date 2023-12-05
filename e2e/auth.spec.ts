import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { cleanupUser, visitAndCheck } from "./lib/utils";

test.describe("Authentication", () => {
  let email = "";
  let shouldDeleteUser = true;

  test.beforeEach(() => {
    email = `${faker.internet.userName()}@example.com`;
  });

  test.afterEach(async ({ page }) => {
    if (shouldDeleteUser) {
      await cleanupUser(email, page);
    }

    shouldDeleteUser = true;
  });

  test("should allow you to register and login", async ({ page }) => {
    const password = faker.internet.password();

    await visitAndCheck("/", page);
    await page.getByRole("link", { name: /sign up/i }).click();

    await page.getByRole("textbox", { name: /email/i }).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /Sign Up/i }).click();

    await page.getByRole("link", { name: /notes/i }).click();
    await page.getByRole("button", { name: /logout/i }).click();
    await page.getByRole("link", { name: /log in/i }).click();

    await page.getByRole("textbox", { name: /email/i }).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /Sign In/i }).click();

    await expect(page.getByRole("link", { name: "Notes" })).toBeVisible();
  });

  test("should display error if the password is empty", async ({ page }) => {
    shouldDeleteUser = false;
    await visitAndCheck("/", page);

    await page.getByRole("link", { name: /Log In/i }).click();
    await page.getByLabel(/Email/i).fill(email);
    await page.getByRole("button", { name: /Sign In/i }).click();
    await expect(page.getByText(/Password is required/i)).toBeVisible();
  });

  test("should display error if the username or password is too short", async ({
    page,
  }) => {
    shouldDeleteUser = false;
    await visitAndCheck("/", page);

    await page.getByRole("link", { name: /Log In/i }).click();
    await page.getByLabel(/Email/i).fill(email);
    await page
      .getByLabel(/Password/i)
      .fill(faker.internet.password({ length: 4 }));
    await page.getByRole("button", { name: /Sign In/i }).click();
    await expect(page.getByText(/Password is too short/i)).toBeVisible();
  });

  test("should display error if the username or password is incorrect", async ({
    page,
  }) => {
    shouldDeleteUser = false;
    await visitAndCheck("/", page);

    await page.getByRole("link", { name: /Log In/i }).click();
    await page.getByLabel(/Email/i).fill(email);
    await page.getByLabel(/Password/i).fill(faker.internet.password());
    await page.getByRole("button", { name: /Sign In/i }).click();
    await expect(page.getByText(/Invalid email or password/i)).toBeVisible();
  });

  test("should display error if the username is already taken", async ({
    page,
  }) => {
    shouldDeleteUser = false;
    const password = faker.internet.password();

    await visitAndCheck("/", page);
    await page.getByRole("link", { name: /sign up/i }).click();

    await page.getByRole("textbox", { name: /email/i }).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /Sign Up/i }).click();

    await page.getByRole("link", { name: /notes/i }).click();
    await page.getByRole("button", { name: /logout/i }).click();

    await page.getByRole("link", { name: /sign up/i }).click();

    await page.getByRole("textbox", { name: /email/i }).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /Sign Up/i }).click();

    await expect(
      page.getByText(/A user already exists with this email/i),
    ).toBeVisible();
  });
});
