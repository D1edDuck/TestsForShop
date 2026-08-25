import { expect, Page } from "@playwright/test";

export class ProductsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/admin/products");
    await this.page
      .getByRole("heading", { name: "Управление товарами" })
      .waitFor();
  }

  private rowByName(name: string) {
    return this.page.locator("tbody tr", { hasText: name });
  }

  async expectRowCount() {
    const rows = this.page.locator("tbody tr");
    expect(await rows.count()).toBeGreaterThanOrEqual(10);

    const head = this.page.locator("thead tr");
    const headers = ["ID", "Товар", "Категория", "Цена", "Остаток", "Действия"];
    for (let i = 0; i < headers.length; i++) {
      await expect(head.locator("th").nth(i)).toContainText(headers[i]);
    }
  }

  private async openCreate() {
    await this.page.getByRole("button", { name: "Добавить" }).click();
  }

  async createProduct(data: {
    name: string;
    description: string;
    price: string;
    stock: string;
    category: string;
  }) {
    await this.openCreate();

    await this.page.getByPlaceholder("Название товара").fill(data.name);
    await this.page.getByPlaceholder("Описание товара").fill(data.description);
    await this.page.getByPlaceholder("0.00", { exact: true }).fill(data.price);
    await this.page.getByPlaceholder("0", { exact: true }).fill(data.stock);
    await this.page.locator("select.input-field").selectOption(data.category);

    await this.page.getByRole("button", { name: "Сохранить" }).click();
  }

  async expectProductVisible(name: string, price: string) {
    const row = this.rowByName(name);
    await expect(row).toBeVisible();
    await expect(row).toContainText(price);
  }

  async editProductPrice(name: string, price: string) {
    await this.rowByName(name).locator("button").first().click();
    await this.page.getByPlaceholder("0.00", { exact: true }).fill(price);
    await this.page.getByRole("button", { name: "Сохранить" }).click();
  }

  async expectProductContains(name: string, text: string) {
    await expect(this.rowByName(name)).toContainText(text);
  }

  async deleteProduct(name: string) {
    this.page.once("dialog", (d) => d.accept());
    await this.rowByName(name).locator("button").nth(1).click();
  }

  async expectProductHidden(name: string) {
    await expect(this.rowByName(name)).toHaveCount(0);
  }

  async cancelCreation(name: string) {
    await this.openCreate();
    await this.page.getByPlaceholder("Название товара").fill(name);
    await this.page.getByRole("button", { name: "Отмена" }).click();
  }

  async expectModalHidden() {
    await expect(
      this.page.locator("form", { hasText: "Новый товар" }),
    ).toHaveCount(0);
  }
}
