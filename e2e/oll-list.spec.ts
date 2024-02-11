import { faker } from '@faker-js/faker';
import test, { expect } from '@playwright/test';

import { createUser } from './lib/create-user';
import { cleanupUser } from './lib/utils';

test.describe('OLL List', () => {
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
    await page.goto('/oll');
    await expect(page).toHaveURL('/login?redirectTo=%2Foll');
  });

  test('side menu should navigate to timer', async ({ page }) => {
    await createUser(email, page);
    await page.getByText(/OLL List/i).click();
    await expect(page).toHaveURL('/oll');
  });

  test('should render OLLs', async ({ page }) => {
    await createUser(email, page);
    await page.goto('/oll');
    await expect(page.getByTestId('algorithm-card')).toHaveCount(4);
  });
});
