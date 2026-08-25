import { test, expect } from "../../fixtures/base";
import { ProductsPage } from "../../pages/admin/ProductsPage";

test.describe("Управление товарами (Admin)", () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ adminPage }) => {
    productsPage = new ProductsPage(adminPage);
    await productsPage.goto();
  });

  test("Товары: список", async () => {
    await productsPage.expectRowCount();
  });

  test("Товары: создание", async () => {
    const name = `TEST-A-${Date.now()}`;
    await productsPage.createProduct({
      name,
      description: "Тестовый товар",
      price: "123.45",
      stock: "5",
      category: "Accessories",
    });
    await productsPage.expectProductVisible(name, "$123.45");

    await productsPage.deleteProduct(name);
    await productsPage.expectProductHidden(name);
  });

  test("Товары: редактирование цены", async () => {
    const name = `TEST-B-${Date.now()}`;
    await productsPage.createProduct({
      name,
      description: "Для редактирования",
      price: "10.00",
      stock: "2",
      category: "Phones",
    });
    await productsPage.expectProductVisible(name, "$10.00");

    await productsPage.editProductPrice(name, "99.99");
    await productsPage.expectProductContains(name, "$99.99");

    await productsPage.deleteProduct(name);
    await productsPage.expectProductHidden(name);
  });

  test("Товары: удаление", async () => {
    const name = `TEST-C-${Date.now()}`;
    await productsPage.createProduct({
      name,
      description: "Для удаления",
      price: "5.00",
      stock: "1",
      category: "Audio",
    });
    await productsPage.expectProductVisible(name, "$5.00");

    await productsPage.deleteProduct(name);
    await productsPage.expectProductHidden(name);
  });

  test("Товары: модалка — отмена", async () => {
    const name = `TEST-D-${Date.now()}`;
    await productsPage.cancelCreation(name);
    await productsPage.expectModalHidden();
    await productsPage.expectProductHidden(name);
  });
});

test("/admin/products без авторизации редиректит на главную", async ({
  page,
}) => {
  await page.goto("/admin/products");
  await expect(page).toHaveURL("/");
});
