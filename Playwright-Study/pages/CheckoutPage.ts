import { expect, Page } from "@playwright/test";

export class CheckoutPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/checkout");
  }

  async placeAnOrder(address: string, phone: string) {
    await this.page
      .getByPlaceholder("Город, улица, дом, квартира")
      .fill(address);
    await this.page.getByPlaceholder("+7 (999) 123-45-67").fill(phone);

    await this.page.getByRole("button", { name: "Подтвердить заказ" }).click();
  }

  async expectNotPlace() {
    await expect(this.page).toHaveURL("/checkout");
  }

  async expectOrderSuccess(nameItem: string, address: string) {
    await expect(this.page).toHaveURL("/orders");

    await expect(
      this.page.locator(".card.p-5", { hasText: nameItem }).first(),
    ).toContainText(nameItem);
    await expect(
      this.page.locator(".card.p-5", { hasText: address }).first(),
    ).toContainText(address);
  }
}
