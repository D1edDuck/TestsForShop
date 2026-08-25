import { test, expect } from "../../fixtures/base";
import { RegisterPage } from "../../pages/RegisterPage";
import { Header } from "../../pages/Header";
import { LoginPage } from "../../pages/LoginPage";

test.describe("RegisterPage", () => {
  let registerPage: RegisterPage;
  let header: Header;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    header = new Header(page);
    loginPage = new LoginPage(page);
    await registerPage.goto();
  });

  test("Регистрация: happy path", async ({ page }) => {
    await registerPage.register(
      "Test User",
      `test_${Date.now()}@test.com`,
      "pass123",
    );
    await registerPage.expectURL("/");
    await header.expectLoggedIn("Test User");
  });

  test("Регистрация: дублирующийся email", async ({ page }) => {
    await registerPage.register("Test User", `admin@techshop.com`, "pass");
    await registerPage.expectURL("/register");
  });

  test("Регистрация → вход → выход", async ({ page }) => {
    const testUser = {
      name: "Test User",
      email: `test_${Date.now()}@test.com`,
      pass: "pass123",
    };
    await registerPage.register(testUser.name, testUser.email, testUser.pass);
    await header.logout();
    await header.expectLoggedOut();
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.pass);
    await header.expectLoggedIn(testUser.name);
  });
});
