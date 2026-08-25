import { test, expect } from "../../fixtures/base";
import { Page } from "@playwright/test";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { ProductPage } from "../../pages/ProductPage";
import { CartPage } from "../../pages/CartPage";
import { PRODUCTS } from "../test-data";

test.describe("Оформление заказов", () => {
  let checkoutPage: CheckoutPage;
  let productPage: ProductPage;
  let cartPage: CartPage;

  const product = PRODUCTS.iphone;
  const data = {
    address: "Moscow",
    phone: "+7 999 123 34 12",
  };

  test.beforeEach(async ({ userPage }) => {
    checkoutPage = new CheckoutPage(userPage);
    productPage = new ProductPage(userPage);
    cartPage = new CartPage(userPage);

    await productPage.goto(product.id);
    await cartPage.expectAddProduct();
    await checkoutPage.goto();
  });

  test("Checkout: happy path", async () => {
    await checkoutPage.placeAnOrder(data.address, data.phone);

    await checkoutPage.expectOrderSuccess(product.name, data.address);
  });

  test("Checkout: пустой адрес", async () => {
    await checkoutPage.placeAnOrder("", data.phone);

    await checkoutPage.expectNotPlace();
  });

  test("Checkout: пустой телефон", async () => {
    await checkoutPage.placeAnOrder(data.address, "");

    await checkoutPage.expectNotPlace();
  });
});
