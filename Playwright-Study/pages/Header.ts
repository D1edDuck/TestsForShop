import { expect, Page } from "@playwright/test";

export class Header {
  constructor(private page: Page) {}

  async expectLoggedIn(name: string) {
    await expect(this.page.getByText(name)).toBeVisible();
  }

  async expectLoggedOut() {
    await expect(this.page.getByRole("link", { name: "Войти" })).toBeVisible();
  }

  async logout() {
    await this.page.locator("header button").click();
  }

  async expectProductCart(number: number) {
    await expect(this.page.locator('[data-testid="cart-badge"]')).toContainText(
      String(number),
    );
  }
}
