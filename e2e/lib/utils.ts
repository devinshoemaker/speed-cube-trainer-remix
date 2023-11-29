import { expect, Page } from "@playwright/test";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { prisma } from "~/db.server";

export async function visitAndCheck(url: string, page: Page) {
  await page.goto(url);
  await expect(page).toHaveURL(url);
}

export async function cleanupUser(email: string, page: Page) {
  if (!email) {
    throw new Error("email required for login");
  }
  if (!email.endsWith("@example.com")) {
    throw new Error("All test emails must end in @example.com");
  }

  try {
    await prisma.user.delete({ where: { email } });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      console.log("User not found, so no need to delete");
    } else {
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }

  await page.context().clearCookies();
}
