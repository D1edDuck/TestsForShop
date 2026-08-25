import { test, expect } from "../../fixtures/base";
import { ProductPage } from "../../pages/ProductPage";
import { PRODUCTS } from "../test-data";

const productItem = PRODUCTS.iphone;

test.describe("Product Page - гость", () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    await productPage.goto(productItem.id);
  });

  test("Карточка: отображение данных", async () => {
    await productPage.expectProduct(
      productItem.name,
      String(productItem.price),
      productItem.category,
      "Смартфон Apple iPhone 15 Pro, 256 ГБ, титановый корпус, чип A17 Pro, камера 48 Мп.",
      "4.8",
    );
  });

  test('Карточка: кнопка "В корзину" без авторизации', async () => {
    await productPage.expectNotAuthorized();
  });

  test("Карточка: отзывы", async () => {
    await productPage.expectReview();
  });

  test('Карточка: кнопка "Назад"', async ({ page }) => {
    await page.goto("/");
    await productPage.goto(productItem.id);
    await productPage.gotoBack();
    await productPage.expectURl("/");
  });
});

test.describe("Product Page - пользователь", () => {
  test("кнопка для авторизованного", async ({ userPage }) => {
    const productPage = new ProductPage(userPage);
    await productPage.goto(productItem.id);
    await productPage.expectAuthorized();
  });
});
