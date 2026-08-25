import { test as base, Page } from "@playwright/test";

type Fixtures = {
  adminPage: Page;
  userPage: Page;
};

export const test = base.extend<Fixtures>({
  adminPage: async ({ page }, use) => {
    await page.goto("/login");
    await page.getByPlaceholder("admin@techshop.com").fill("admin@techshop.com");
    await page.getByPlaceholder("••••••••").fill("admin123");
    await page.getByRole("button", { name: "Войти" }).click();
    await page.waitForURL("/");
    await use(page);
  },
  userPage: async ({ page }, use) => {
    await page.goto("/login");
    await page.getByPlaceholder("admin@techshop.com").fill("john@test.com");
    await page.getByPlaceholder("••••••••").fill("user123");
    await page.getByRole("button", { name: "Войти" }).click();
    await page.waitForURL("/");
    await use(page);
  },
});

export { expect } from "@playwright/test";
