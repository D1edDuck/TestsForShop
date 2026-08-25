import { expect, Page } from "@playwright/test";

export class OrdersPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/orders");
  }

  async expectStatusPending() {
    await expect(
      this.page.locator(".badge.text-warning").first(),
    ).toBeVisible();
  }

  async expectEmptyOrders() {
    await expect(this.page.getByText("Заказов пока нет")).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Перейти в каталог" }),
    ).toBeVisible();
  }

  async expectOrdersData() {
    await expect(this.page.locator(".card.p-5").first()).toBeVisible();

    const orders = this.page.locator(".card.p-5");

    const count = await orders.count();

    await expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(
        orders
          .nth(i)
          .locator(".text-sm.font-semibold.text-white", { hasText: "#" }),
      ).toBeVisible();
      await expect(
        orders.nth(i).locator(".text-xs.text-zinc-600"),
      ).toBeVisible();
      await expect(
        orders.nth(i).locator(".text-zinc-400", { hasText: "×" }),
      ).toBeVisible();
      await expect(
        orders.nth(i).locator(".font-bold.text-white", { hasText: "$" }),
      ).toBeVisible();
      await expect(orders.nth(i).locator(".badge.text-warning")).toBeVisible();
    }
  }
}
