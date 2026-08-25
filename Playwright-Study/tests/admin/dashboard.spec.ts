import { test, expect } from "../../fixtures/base";
import { DashboardPage } from "../../pages/admin/DashboardPage";
import { Page } from "@playwright/test";

let dashboard: DashboardPage;

async function createOrder(page: Page) {
  await page.request.post("/api/cart", {
    data: { productId: 1, quantity: 1 },
  });
  await page.request.post("/api/orders", {
    data: { address: "Moscow", phone: "+7 999 000 00 00" },
  });
}

test.describe("Дашборд", () => {
  test.beforeEach(async ({ adminPage }) => {
    dashboard = new DashboardPage(adminPage);
    await dashboard.goto();
  });

  test("Дашборд: статистика", async () => {
    await dashboard.expectCards();
  });

  test("Дашборд: заказы по статусу", async ({ adminPage }) => {
    await createOrder(adminPage);
    await dashboard.goto();
    await dashboard.expectStatusCount();
  });

  test("Дашборд: таблица последних заказов", async ({ adminPage }) => {
    await createOrder(adminPage);
    await dashboard.goto();
    await dashboard.expectLastOrders();
  });
});

test("/admin без ADMIN роли редиректит на главную", async ({ userPage }) => {
  await userPage.goto("/admin");
  await expect(userPage).toHaveURL("/");
});
