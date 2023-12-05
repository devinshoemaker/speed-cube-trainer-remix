import { faker } from "@faker-js/faker";
import { expect, Page } from "@playwright/test";

import { visitAndCheck } from "./utils";

export async function createUser(email: string, page: Page) {
  const password = faker.internet.password();

  await visitAndCheck("/", page);
  await page.getByRole("link", { name: /sign up/i }).click();

  await page.getByRole("textbox", { name: /email/i }).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /Sign Up/i }).click();
  await expect(page.getByText(/View Notes/i)).toBeVisible();
}
