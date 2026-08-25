import { Page } from "@playwright/test";
import { test, expect } from "../../fixtures/base";
import { CartPage } from "../../pages/CartPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { Header } from "../../pages/Header";
import { ProductPage } from "../../pages/ProductPage";
import { PRODUCTS } from "../test-data";

let cartPage: CartPage;
let checkoutPage: CheckoutPage;
let productPage: ProductPage;
let header: Header;

async function cleanCart(page: Page) {
  const res = await page.request.get("/api/cart");
  if (!res.ok()) return;
  const body = await res.json();
  const items = body.data ?? body;
  if (!Array.isArray(items)) return;
  for (const item of items) {
    await page.request.delete(`/api/cart/${item.id}`);
  }
}

test.describe.configure({ mode: "serial" });

test.describe("С добавленным товаром уже", () => {
  const product = PRODUCTS.iphone;

  test.beforeEach(async ({ userPage }) => {
    cartPage = new CartPage(userPage);
    checkoutPage = new CheckoutPage(userPage);
    productPage = new ProductPage(userPage);
    header = new Header(userPage);

    await cleanCart(userPage);

    await productPage.goto(product.id);
    await cartPage.expectAddProduct();
  });

  test("Добавление товара в корзину", async () => {
    await header.expectProductCart(1);
  });

  test("Добавление нескольких товаров", async () => {
    await productPage.goto(3);

    await productPage.addToCart();

    await header.expectProductCart(2);
  });

  test("Изменение количества (+)", async () => {
    await cartPage.goto();
    await expect(cartPage.getCountLocator()).toHaveText("1");
    await cartPage.upProductCart();
    await expect(cartPage.getCountLocator()).toHaveText("2");
  });

  test("Изменение количества (-)", async () => {
    await cartPage.goto();
    await cartPage.upProductCart();
    await expect(cartPage.getCountLocator()).toHaveText("2");
    await cartPage.downProductCart();
    await expect(cartPage.getCountLocator()).toHaveText("1");
  });

  test("Удаления товара", async () => {
    await cartPage.goto();
    await cartPage.deleteProduct();
    await cartPage.expectEmptyCart();
  });

  test('Кнопка "Оформить заказ"', async () => {
    await cartPage.goto();
    await cartPage.expectLinkOrder();
  });

  test("Корзина очищается после заказа", async () => {
    await checkoutPage.goto();
    await checkoutPage.placeAnOrder("Moscow", "89991234567");
    await checkoutPage.expectOrderSuccess(product.name, "Moscow");
    await cartPage.goto();
    await cartPage.expectEmptyCart();
  });
});

test("пустая корзина", async ({ userPage }) => {
  cartPage = new CartPage(userPage);
  productPage = new ProductPage(userPage);
  header = new Header(userPage);

  await cleanCart(userPage);

  await cartPage.goto();
  await cartPage.expectEmptyCart();
});
