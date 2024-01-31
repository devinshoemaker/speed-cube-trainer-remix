import { faker } from '@faker-js/faker';
import test, { expect } from '@playwright/test';

import { createUser } from './lib/create-user';
import { cleanupUser } from './lib/utils';

test.describe('Timer', () => {
  let email = '';
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

  test('should redirect if user is unauthenticated', async ({ page }) => {
    shouldDeleteUser = false;
    await page.goto('/timer');
    await expect(page).toHaveURL('/login?redirectTo=%2Ftimer');
  });

  test('side menu should navigate to timer', async ({ page }) => {
    await createUser(email, page);
    await page.getByText(/Timer/i).click();
    await expect(page).toHaveURL('/timer');
  });

  test('should start the timer with the spacebar', async ({ page }) => {
    await createUser(email, page);
    await page.goto('/timer');
    await expect(page.getByText('00:00:00')).toBeVisible();
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);
    await page.keyboard.press('Space');
    await expect(page.getByTestId('timer')).not.toContainText('00:00:00');
  });

  test('should start the timer by clicking the screen', async ({ page }) => {
    await createUser(email, page);
    await page.goto('/timer');
    await page.getByText('00:00:00').click();
    await page.waitForTimeout(100);
    await page.getByTestId('timer').click();
    await expect(page.getByTestId('timer')).not.toContainText('00:00:00');
  });
});
