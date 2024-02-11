import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import { cleanupUser, visitAndCheck } from './lib/utils';

test.describe('Authentication', () => {
  const seededUser = 'admin@test.com';
  const seededPassword = 'p4ssw0rd';

  let email = '';
  let password = '';
  let shouldDeleteUser = true;

  test.beforeEach(() => {
    email = `${faker.internet.userName()}@example.com`;
    password = faker.internet.password();
  });

  test.afterEach(async ({ page }) => {
    if (shouldDeleteUser) {
      await cleanupUser(email, page);
    }

    shouldDeleteUser = true;
  });

  test('should redirect from timer to login if the user is unauthenticated', async ({
    page
  }) => {
    await page.goto('/timer');
    await expect(page.getByRole('heading', { name: 'Log In' })).toBeVisible();
    await expect(page).toHaveURL(/.*login/);
  });

  test('should allow you to register and login', async ({ page }) => {
    await visitAndCheck('/register', page);

    await page.getByRole('textbox', { name: /email/i }).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole('button', { name: /Sign Up/i }).click();

    await page.getByRole('button', { name: /logout/i }).click();

    await page.getByRole('textbox', { name: /email/i }).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole('button', { name: /Sign In/i }).click();

    await expect(
      page.locator('#side-menu').getByText('Cube Trainer')
    ).toBeVisible();
  });

  test('should redirect to timer after logging in', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('name@example.com').fill(seededUser);
    await page.getByPlaceholder('password').fill(seededPassword);
    await page.getByRole('button', { name: 'Sign In with Email' }).click();
    await expect(page).toHaveURL(/.*timer/);
  });

  test('should redirect to timer after signing up', async ({ page }) => {
    shouldDeleteUser = true;
    await page.goto('/register');
    await page.getByPlaceholder('name@example.com').fill(email);
    await page.getByPlaceholder('password').fill(password);
    await page.getByRole('button', { name: 'Sign Up with Email' }).click();
    await expect(page).toHaveURL(/.*timer/);
  });

  test('should display error if the password is empty', async ({ page }) => {
    shouldDeleteUser = false;
    await visitAndCheck('/login', page);

    await page.getByLabel(/Email/i).fill(email);
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page.getByText(/Password is required/i)).toBeVisible();
  });

  test('should display error if the username or password is too short', async ({
    page
  }) => {
    shouldDeleteUser = false;
    await visitAndCheck('/login', page);

    await page.getByLabel(/Email/i).fill(email);
    await page
      .getByLabel(/Password/i)
      .fill(faker.internet.password({ length: 4 }));
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page.getByText(/Password is too short/i)).toBeVisible();
  });

  test('should display error if the username or password is incorrect', async ({
    page
  }) => {
    shouldDeleteUser = false;
    await visitAndCheck('/login', page);

    await page.getByLabel(/Email/i).fill(email);
    await page.getByLabel(/Password/i).fill(password);
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page.getByText(/Invalid email or password/i)).toBeVisible();
  });

  test('should display error if the username is already taken', async ({
    page
  }) => {
    shouldDeleteUser = false;

    await visitAndCheck('/register', page);

    await page.getByRole('textbox', { name: /email/i }).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole('button', { name: /Sign Up/i }).click();

    await page.getByRole('button', { name: /logout/i }).click();

    await page.getByRole('link', { name: /sign up/i }).click();

    await page.getByRole('textbox', { name: /email/i }).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole('button', { name: /Sign Up/i }).click();

    await expect(
      page.getByText(/A user already exists with this email/i)
    ).toBeVisible();
  });

  test('should redirect to login after logging out', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('name@example.com').fill(seededUser);
    await page.getByPlaceholder('password').fill(seededPassword);
    await page.getByRole('button', { name: 'Sign In with Email' }).click();
    await expect(page).toHaveURL(/.*timer/);
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page.getByRole('heading', { name: 'Log In' })).toBeVisible();
  });

  test('should redirect to timer if user attempts to navigate to login', async ({
    page
  }) => {
    await page.goto('/login');
    await page.getByPlaceholder('name@example.com').fill(seededUser);
    await page.getByPlaceholder('password').fill(seededPassword);
    await page.getByRole('button', { name: 'Sign In with Email' }).click();
    await expect(page).toHaveURL(/.*timer/);
    await page.goto('/login');
    await expect(page).toHaveURL(/.*timer/);
  });

  test('should redirect to timer if user attempts to navigate to register', async ({
    page
  }) => {
    await page.goto('/login');
    await page.getByPlaceholder('name@example.com').fill(seededUser);
    await page.getByPlaceholder('password').fill(seededPassword);
    await page.getByRole('button', { name: 'Sign In with Email' }).click();
    await expect(page).toHaveURL(/.*timer/);
    await page.goto('/register');
    await expect(page).toHaveURL(/.*timer/);
  });
});
