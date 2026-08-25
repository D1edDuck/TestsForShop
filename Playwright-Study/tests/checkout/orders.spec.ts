import { expect, test } from "../../fixtures/base";
import { OrdersPage } from "../../pages/OrdersPage";
import { RegisterPage } from "../../pages/RegisterPage";

let orderPage: OrdersPage;

test.describe("Заказы John's", () => {
  test.beforeEach(async ({ userPage }) => {
    orderPage = new OrdersPage(userPage);

    await orderPage.goto();
  });

  test("Список заказов", async () => {
    await orderPage.expectOrdersData();
  });

  test("Статус badge", async () => {
    await orderPage.expectStatusPending();
  });
});

test("Новый пользователь", async ({ page }) => {
  const registerPage = new RegisterPage(page);
  orderPage = new OrdersPage(page);

  await registerPage.goto();
  await registerPage.register(
    "New User",
    `test-${Date.now()}@gmail.com`,
    "Tester10",
  );

  await registerPage.expectURL("/");

  await orderPage.goto();
  await orderPage.expectEmptyOrders();
});

test("Без авторизации", async ({ page }) => {
  orderPage = new OrdersPage(page);
  await orderPage.goto();
  await expect(page).toHaveURL("/login");
});
