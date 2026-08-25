import { test, expect } from "../../fixtures/base";
import { LoginPage } from "../../pages/LoginPage";
import { Header } from "../../pages/Header";
import { USERS } from "../test-data";

test.describe("Login Page", () => {
  let loginPage: LoginPage;
  let header: Header;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    header = new Header(page);
    await loginPage.goto();
  });

  test("Логин: happy path (admin)", async ({ page }) => {
    const admin = USERS.admin;
    await loginPage.login(admin.email, admin.password);
    await loginPage.expectURL("/");
    await header.expectLoggedIn(admin.name);
  });

  test("Логин: happy path (user)", async ({ page }) => {
    const user = USERS.user;
    await loginPage.login(user.email, user.password);
    await loginPage.expectURL("/");
    await header.expectLoggedIn("John Doe");
  });

  test("Логин: неверный пароль", async ({ page }) => {
    await loginPage.login("admin@techshop.com", "wrongpass");
    await loginPage.expectURL("/login");
    await loginPage.expectFailedLogin();
  });

  test("Логин: несуществующий email", async ({ page }) => {
    await loginPage.login("nobody@test.com", "user123");
    await loginPage.expectURL("/login");
    await loginPage.expectFailedLogin();
  });

  test("Логин: пустые поля", async ({ page }) => {
    await loginPage.login("", "");
    await loginPage.expectURL("/login");
  });

  test("Логин → /profile без токена", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL("/login");
  });
});
