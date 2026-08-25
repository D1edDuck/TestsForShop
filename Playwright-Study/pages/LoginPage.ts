import { expect, Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.page.getByPlaceholder("admin@techshop.com").fill(email);
    await this.page.getByPlaceholder("••••••••").fill(password);
    await this.page.getByRole("button", { name: "Войти" }).click();
  }

  async expectURL(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async expectFailedLogin() {
    await expect(
      this.page.getByText("Неверный email или пароль"),
    ).toBeVisible();
  }
}
