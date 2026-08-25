import { expect, Page } from "@playwright/test";

export class ProductPage {
  constructor(private page: Page) {}

  async goto(id: number) {
    await this.page.goto(`/product/${String(id)}`);
    await this.page.locator("h1").waitFor();
    const addBtn = this.page.locator('[data-testid="cart-add"]');
    if (await addBtn.count()) {
      await addBtn.first().waitFor({ state: "visible" });
    }
  }

  async expectProduct(
    nameItem: string,
    price: string,
    category: string,
    description: string,
    rating: string,
  ) {
    await expect(this.page.locator("h1", { hasText: nameItem })).toBeVisible();
    await expect(this.page.getByText(price)).toBeVisible();
    await expect(this.page.getByText(category)).toBeVisible();
    await expect(this.page.getByText(description)).toBeVisible();
    await expect(this.page.getByText(rating)).toBeVisible();
  }

  async expectAuthorized() {
    await expect(this.page.locator('[data-testid="cart-add"]')).toBeVisible();
  }

  async expectNotAuthorized() {
    await expect(
      this.page.getByRole("button", { name: "Войдите, чтобы купить" }),
    ).toBeVisible();
  }

  async expectReview() {
    const reviews = this.page.locator(".card.p-4");
    await reviews.first().waitFor();
    const count = await reviews.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const review = reviews.nth(i);
      await expect(review.locator("span").first()).not.toBeEmpty();
      await expect(review.locator("span").nth(1)).not.toBeEmpty();
      await expect(review.locator("p")).not.toBeEmpty();
    }
  }

  async gotoBack() {
    await this.page.getByRole("button", { name: /Назад/ }).click();
  }

  async expectURl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async addToCart() {
    await this.page.locator('[data-testid="cart-add"]').click();
  }
}
