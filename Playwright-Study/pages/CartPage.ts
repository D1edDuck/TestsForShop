import { Page, expect } from "@playwright/test";

export class CartPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/cart");
    await this.page.locator('[data-testid="cart-item"], [data-testid="cart-empty-catalog-link"]').first().waitFor();
  }

  async expectAddProduct() {
    const responsePromise = this.page.waitForResponse(
      (r) => r.url().includes("/api/cart") && r.request().method() === "POST"
    );
    await this.page.locator('[data-testid="cart-add"]').click();
    await responsePromise;
  }

  getCountLocator() {
    return this.page.locator('[data-testid="cart-quantity"]');
  }

  async upProductCart() {
    await this.page.locator('[data-testid="cart-increase"]').click();
  }

  async downProductCart() {
    await this.page.locator('[data-testid="cart-decrease"]').click();
  }

  async deleteProduct() {
    await this.page.locator('[data-testid="cart-remove"]').click();
  }

  async expectEmptyCart() {
    await expect(this.page.getByText("Корзина пуста")).toBeVisible();
    await expect(
      this.page.locator('[data-testid="cart-empty-catalog-link"]')
    ).toBeVisible();
  }

  async expectLinkOrder() {
    await this.page.locator('[data-testid="cart-checkout"]').click();
    await expect(this.page).toHaveURL("/checkout");
  }
}
