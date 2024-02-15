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
    await page.goto('/oll/1');
    await expect(page).toHaveURL('/login?redirectTo=%2Foll%2F1');
  });

  test('side menu should navigate to OLL page from OLL list', async ({
    page
  }) => {
    await createUser(email, page);
    await page.goto('/oll');
    await page.getByTestId('algorithm-card').nth(0).click();
    await expect(page).toHaveURL('/oll/1');
  });

  test('navigating to a bad OLL redirects user to OLL list', async ({
    page
  }) => {
    await createUser(email, page);
    await page.goto('/oll/notAnOll');
    await expect(page).toHaveURL('/oll');
  });
});
