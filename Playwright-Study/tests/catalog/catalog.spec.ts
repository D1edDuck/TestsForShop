import { test, expect } from "../../fixtures/base";
import { CatalogPage } from "../../pages/CatalogPage";
import { PRODUCTS } from "../test-data";

test.describe("Catalog Page", () => {
  let catalogPage: CatalogPage;

  test.beforeEach(async ({ page }) => {
    catalogPage = new CatalogPage(page);
    await catalogPage.goto();
  });

  test("Каталог: отображаются товары", async () => {
    await catalogPage.expectCatalog(10);
  });

  test('Поиск: "iPhone"', async () => {
    const iphone = PRODUCTS.iphone;
    await catalogPage.expectSearch("Iphone", iphone.name, String(iphone.price));
  });

  test("Поиск: несуществующий товар", async () => {
    await catalogPage.expectSearchNotFound("xyznotfound");
  });

  test('Фильтр по категории "Phones"', async () => {
    await catalogPage.expectCategory("Phones", "Все категории");
    await catalogPage.expectCatalogCategory("Phones");
  });

  test("Сортировка: цена", async () => {
    await catalogPage.expectCategory("price_asc", "Сортировка");
    await catalogPage.checkPrice();
  });

  test("Сортировка: рейтинг", async () => {
    await catalogPage.expectCategory("rating", "Сортировка");
    await catalogPage.checkRate();
  });

  test("Сброс фильтров", async () => {
    await catalogPage.expectCategory("rating", "Сортировка");
    await catalogPage.expectCategory("", "Все категории");
    await catalogPage.expectCatalog(10);
  });
});
