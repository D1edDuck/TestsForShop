import { expect, Page } from "@playwright/test";

export class DashboardPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/admin");
    await this.page.getByRole("heading", { name: "Дашборд" }).waitFor();
  }

  private cardNumber(label: string) {
    return this.page
      .locator(".card.p-5", { hasText: label })
      .locator("p.text-2xl.font-bold");
  }

  async expectCards() {
    const users = this.cardNumber("Пользователей");
    const products = this.cardNumber("Товаров");
    const orders = this.cardNumber("Заказов");
    const revenue = this.cardNumber("Выручка");

    await expect(users).toBeVisible();
    await expect(products).toBeVisible();
    await expect(orders).toBeVisible();
    await expect(revenue).toBeVisible();

    expect(Number(await users.textContent())).toBeGreaterThanOrEqual(3);
    expect(Number(await products.textContent())).toBeGreaterThanOrEqual(10);
    expect(Number(await orders.textContent())).toBeGreaterThanOrEqual(0);
  }

  async expectStatusCount() {
    const statusesSection = this.page.locator(".card.p-5", {
      hasText: "По статусу",
    });
    await expect(
      statusesSection.locator(".badge.text-warning", { hasText: "PENDING" }),
    ).toBeVisible();
  }

  async expectLastOrders() {
    const head = this.page.locator("thead tr");
    const headers = ["ID", "Пользователь", "Сумма", "Статус", "Дата"];

    for (let i = 0; i < headers.length; i++) {
      await expect(head.locator("th").nth(i)).toContainText(headers[i]);
    }

    const rows = this.page.locator("tbody tr");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < 5; j++) {
        await expect(rows.nth(i).locator("td").nth(j)).not.toBeEmpty();
      }
    }
  }
}
