import { expect, Page } from "@playwright/test";

export class RegisterPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/register");
  }

  async register(name: string, email: string, password: string) {
    await this.page.getByPlaceholder("Ваше Имя").fill(name);
    await this.page.getByPlaceholder("you@example.com").fill(email);
    await this.page.getByPlaceholder("Минимум 6 символов").fill(password);
    await this.page.getByRole("button", { name: "Зарегистрироваться" }).click();
  }

  async expectURL(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async expectFailedEmail() {
    await expect(
      this.page.getByText("Email уже зарегистрирован"),
    ).toBeVisible();
  }
}
