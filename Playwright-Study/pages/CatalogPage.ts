import { expect, Page } from "@playwright/test";

export class CatalogPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/");
    await this.page.locator('a[href^="/product/"]').first().waitFor();
  }

  async expectCatalog(minCount: number) {
    const cards = this.page.locator('a[href^="/product/"]');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    await expect(count).toBeGreaterThanOrEqual(minCount);

    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator("h3")).not.toBeEmpty();
    }
  }

  async expectCatalogCategory(cat: string) {
    const cards = this.page.locator('a[href^="/product/"]');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toContainText(cat);
    }
  }

  async expectSearch(name: string, nameItem: string, price: string) {
    await this.page.getByPlaceholder("Найти товар...").fill(name);
    await expect(this.page.getByText(nameItem)).toBeVisible();
    await expect(this.page.getByText(price)).toBeVisible();
  }

  async expectSearchNotFound(name: string) {
    await this.page.getByPlaceholder("Найти товар...").fill(name);
    await expect(this.page.getByText("Товары не найдены")).toBeVisible();
  }

  async expectCategory(opt: string, filter: "Все категории" | "Сортировка") {
    await this.page
      .locator("select")
      .filter({ hasText: filter })
      .selectOption(opt);
    await this.page.locator('a[href^="/product/"]').first().waitFor();
  }

  async goProduct(id: string, nameItem: string, price: string) {
    await this.page.goto(`product/${id}`);
    await expect(this.page.getByText(nameItem)).toBeVisible();
    await expect(this.page.getByText(price)).toBeVisible();
  }

  async checkPrice() {
    const cards = this.page.locator('a[href^="/product/"]');
    await expect(cards.first()).toBeVisible();

    const firstPrice = await cards
      .first()
      .locator("span")
      .filter({ hasText: "$" })
      .textContent();
    const lastPrice = await cards
      .last()
      .locator("span")
      .filter({ hasText: "$" })
      .textContent();

    const first = Number(firstPrice?.replace("$", ""));
    const last = Number(lastPrice?.replace("$", ""));

    expect(first).toBeLessThanOrEqual(last);
  }

  async checkRate() {
    const cards = this.page.locator('a[href^="/product/"]');
    await expect(cards.first()).toBeVisible();

    const firstRating = await cards
      .first()
      .locator("span.text-zinc-400")
      .textContent();
    const lastRating = await cards
      .last()
      .locator("span.text-zinc-400")
      .textContent();

    const first = Number(firstRating);
    const last = Number(lastRating);

    expect(first).toBeGreaterThanOrEqual(last);
  }
}
