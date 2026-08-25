# TechShop — Итоговый план E2E тестов

## Обзор проекта

**TechShop** — интернет-магазин электроники с полным стеком:

| Сервис | Технология | Порт | URL |
|---|---|---|---|
| Frontend | React + TypeScript + Vite + Tailwind | 5173 | http://localhost:5173 |
| Backend | Express + TypeScript + Prisma + PostgreSQL | 4000 | http://localhost:4000 |
| Database | PostgreSQL 16 | 5432 | localhost:5432 |

**Запуск:**
```bash
docker compose up -d db backend   # БД + API
cd frontend && npm run dev        # Фронтенд
```

---

## Учётные данные (Seed Data)

### Пользователи

| Роль | Email | Пароль | Имя |
|---|---|---|---|
| ADMIN | admin@techshop.com | admin123 | Admin User |
| USER | john@test.com | user123 | John Doe |
| USER | jane@test.com | user123 | Jane Smith |

### Товары (10 шт.)

| ID | Название | Цена | Категория | Остаток | Рейтинг |
|---|---|---|---|---|---|
| 1 | iPhone 15 Pro | 1299.99 | Phones | 25 | 4.8 |
| 2 | MacBook Air M3 | 1099.99 | Laptops | 15 | 4.9 |
| 3 | Sony WH-1000XM5 | 349.99 | Audio | 40 | 4.7 |
| 4 | iPad Air | 599.99 | Tablets | 20 | 4.6 |
| 5 | Samsung Galaxy S24 Ultra | 1199.99 | Phones | 30 | 4.7 |
| 6 | Dell XPS 15 | 1299.99 | Laptops | 10 | 4.5 |
| 7 | AirPods Pro 2 | 249.99 | Audio | 50 | 4.8 |
| 8 | Nintendo Switch OLED | 349.99 | Gaming | 20 | 4.6 |
| 9 | PS5 DualSense Controller | 69.99 | Gaming | 35 | 4.5 |
| 10 | Logitech MX Master 3S | 99.99 | Accessories | 45 | 4.7 |

### Отзывы (3 шт.)

| Пользователь | Товар | Рейтинг | Текст |
|---|---|---|---|
| John Doe | iPhone 15 Pro (ID 1) | 5 | "Отличный телефон! Камера просто бомба." |
| Jane Smith | iPad Air (ID 4) | 4 | "Лучший планшет для работы и учёбы." |
| John Doe | Sony WH-1000XM5 (ID 3) | 5 | "Лучшие наушники которые у меня были." |

---

## Структура тестового проекта

```
Playwright-Study/
├── playwright.config.ts          ← конфигурация (baseURL, projects, artifacts)
├── fixtures/
│   └── base.ts                   ← кастомные фикстуры (loginAs, apiRequest)
├── api/
│   ├── AuthApi.ts                ← API-клиент: auth endpoints
│   ├── ProductsApi.ts            ← API-клиент: products endpoints
│   ├── CartApi.ts                ← API-клиент: cart endpoints
│   ├── OrdersApi.ts              ← API-клиент: orders endpoints
│   └── AdminApi.ts               ← API-клиент: admin endpoints
├── pages/
│   ├── Header.ts                 ← PO: шапка (навбар, корзина, профиль)
│   ├── LoginPage.ts              ← PO: страница входа
│   ├── RegisterPage.ts           ← PO: страница регистрации
│   ├── CatalogPage.ts            ← PO: каталог (фильтры, поиск, карточки)
│   ├── ProductPage.ts            ← PO: страница товара (детали, отзывы, добавление в корзину)
│   ├── CartPage.ts               ← PO: корзина (список, +/- количество, итого)
│   ├── CheckoutPage.ts           ← PO: оформление заказа (адрес, телефон)
│   ├── OrdersPage.ts             ← PO: список заказов
│   ├── ProfilePage.ts            ← PO: профиль пользователя
│   └── admin/
│       ├── DashboardPage.ts      ← PO: админ-дашборд (статистика, таблицы)
│       └── ProductsPage.ts       ← PO: управление товарами (таблица, модалка CRUD)
├── tests/
│   ├── auth/
│   │   ├── login.spec.ts         ← 10 тестов
│   │   └── register.spec.ts      ← 6 тестов
│   ├── catalog/
│   │   ├── catalog.spec.ts       ← 8 тестов
│   │   └── product-detail.spec.ts ← 5 тестов
│   ├── cart/
│   │   └── cart.spec.ts          ← 8 тестов
│   ├── checkout/
│   │   ├── checkout.spec.ts      ← 6 тестов
│   │   └── orders.spec.ts        ← 5 тестов
│   ├── admin/
│   │   ├── dashboard.spec.ts     ← 4 теста
│   │   └── products-crud.spec.ts ← 6 тестов
│   ├── api/
│   │   ├── auth-api.spec.ts      ← 8 тестов
│   │   ├── products-api.spec.ts  ← 8 тестов
│   │   ├── cart-api.spec.ts      ← 6 тестов
│   │   ├── orders-api.spec.ts    ← 5 тестов
│   │   └── negative-api.spec.ts  ← 8 тестов
│   ├── mock/
│   │   └── mock-intercept.spec.ts ← 5 тестов
│   └── regression/
│       └── full-flow.spec.ts     ← 2 теста
├── Dockerfile
├── package.json
├── tsconfig.json
└── .env
```

---

## API Эндпоинты (справочник)

### Auth
| Метод | Эндпоинт | Тело запроса | Ответ (200/201) | Ошибки |
|---|---|---|---|---|
| POST | /api/auth/register | `{name, email, password}` | `{user, token}` | 400 (пустые), 409 (дубликат) |
| POST | /api/auth/login | `{email, password}` | `{user, token}` | 400, 401 |
| POST | /api/auth/logout | — | — | — |
| GET | /api/auth/me | — | `{user}` | 401 |

### Products
| Метод | Эндпоинт | Параметры | Ответ | Ошибки |
|---|---|---|---|---|
| GET | /api/products | `?category=&search=&sort=&page=&limit=` | `{data[], pagination}` | — |
| GET | /api/products/categories | — | `{data[]}` | — |
| GET | /api/products/:id | — | `{data (with reviews)}` | 404 |
| POST | /api/products | `{name, description, price, category, stock, image}` | `{data}` | 400, 403 |
| PUT | /api/products/:id | `{...fields}` | `{data}` | 400, 403, 404 |
| DELETE | /api/products/:id | — | — | 403, 404 |

### Cart
| Метод | Эндпоинт | Тело/Параметры | Ответ | Ошибки |
|---|---|---|---|---|
| GET | /api/cart | — | `{data[], total, count}` | 401 |
| POST | /api/cart | `{productId, quantity}` | `{data}` | 400, 401, 404 |
| PUT | /api/cart/:itemId | `{quantity}` | `{data}` | 400, 401, 404 |
| DELETE | /api/cart/:itemId | — | — | 401, 404 |

### Orders
| Метод | Эндпоинт | Тело/Параметры | Ответ | Ошибки |
|---|---|---|---|---|
| POST | /api/orders | `{address, phone}` | `{data}` | 400, 401 |
| GET | /api/orders | — | `{data[]}` | 401 |
| GET | /api/orders/:id | — | `{data (with items, user)}` | 401, 403, 404 |
| PATCH | /api/orders/:id/status | `{status}` | `{data}` | 400, 403, 404 |

### Admin
| Метод | Эндпоинт | Ответ | Ошибки |
|---|---|---|---|
| GET | /api/admin/stats | `{totalUsers, totalProducts, totalOrders, totalRevenue, ordersByStatus[], recentOrders[]}` | 403 |
| GET | /api/admin/users | `{data[]}` | 403 |
| GET | /api/admin/orders | `{data[]}` | 403 |

---

## UI Роуты (справочник)

| Роут | Страница | Доступ | Защита |
|---|---|---|---|
| `/` | Каталог (Home) | Все | — |
| `/product/:id` | Детали товара | Все | — |
| `/login` | Вход | Гости | Редирект если залогинен |
| `/register` | Регистрация | Гости | Редирект если залогинен |
| `/cart` | Корзина | Авторизованные | → /login |
| `/checkout` | Оформление заказа | Авторизованные | → /login |
| `/orders` | Мои заказы | Авторизованные | → /login |
| `/profile` | Профиль | Авторизованные | → /login |
| `/admin` | Админ-дашборд | ADMIN | → / |
| `/admin/products` | Управление товарами | ADMIN | → / |

---

---

# ЗАДАЧИ

---

## Задача 1: Авторизация — UI тесты

**Уроки:** 1 (локаторы, действия,断言), 2 (Page Object)

### login.spec.ts

| # | Название | Сценарий | Тип | AC |
|---|---|---|---|---|
| 1.1 | Логин: happy path (admin) | Ввести admin@techshop.com + admin123, нажать "Войти" | Positive | Редирект на `/`. В хедере отображается имя "Admin User". Кнопки "Войти"/"Регистрация" исчезают. |
| 1.2 | Логин: happy path (user) | Ввести john@test.com + user123, нажать "Войти" | Positive | Редирект на `/`. В хедере отображается "John Doe". |
| 1.3 | Логин: неверный пароль | Ввести admin@techshop.com + wrongpass | Negative | Остаёмся на `/login`. Появляется сообщение об ошибке. URL не меняется. |
| 1.4 | Логин: несуществующий email | Ввести nobody@test.com + user123 | Negative | Сообщение об ошибке. Не редиректит. |
| 1.5 | Логин: пустые поля | Оставить пустые поля, нажать "Войти" | Negative | Браузерная валидация (required). Запрос не отправляется. |
| 1.6 | Логин → /profile без токена | Зайти на /profile неавторизованным | Guard | Редирект на `/login`. |

### register.spec.ts

| # | Название | Сценарий | Тип | AC |
|---|---|---|---|---|
| 1.7 | Регистрация: happy path | Имя "Test User", email `test_${Date.now()}@test.com`, пароль "pass123" | Positive | Редирект на `/`. Пользователь залогинен. В хедере отображается имя. |
| 1.8 | Регистрация: дублирующийся email | email admin@techshop.com | Negative | Сообщение об ошибке (409). Не редиректит. |
| 1.9 | Регистрация: короткий пароль | Пароль "12345" (5 символов) | Negative | Ошибка валидации "минимум 6 символов". |
| 1.10 | Регистрация → вход → выход | Зарегистрироваться → выйти → войти новым аккаунтом | Flow | Все три шага работают. После выхода кнопки "Войти"/"Регистрация" видны. |

**Page Object:** `LoginPage.ts`, `RegisterPage.ts`, `Header.ts`

---

## Задача 2: Каталог — UI тесты

**Уроки:** 1 (действия с input/select), 4.5 (навигация, архитектура)

### catalog.spec.ts

| # | Название | Сценарий | Тип | AC |
|---|---|---|---|---|
| 2.1 | Каталог: отображаются товары | Зайти на `/` | Positive | На странице минимум 10 карточек товаров. Каждая карточка содержит название, цену, категорию, рейтинг. |
| 2.2 | Поиск: "iPhone" | Ввести "iPhone" в поле поиска | Positive | Отображается 1 товар (iPhone 15 Pro). Проверить название и цену. |
| 2.3 | Поиск: несуществующий товар | Ввести "xyznotfound" | Negative | Отображается сообщение "Товары не найдены". |
| 2.4 | Фильтр по категории "Phones" | Выбрать "Phones" в select | Positive | Все отображённые товары имеют категорию "Phones" (2 товара: iPhone 15 Pro, Samsung Galaxy S24 Ultra). |
| 2.5 | Сортировка: цена ↑ | Выбрать "Цена ↑" | Positive | Первый товар дешевле последнего. Проверить первую и последнюю цену. |
| 2.6 | Сортировка: рейтинг | Выбрать "Рейтинг" | Positive | Первый товар имеет рейтинг >= последнего. |
| 2.7 | Сброс фильтров | Установить фильтр → сбросить (выбрать "Все категории") | Positive | Показываются все 10 товаров. |
| 2.8 | Переход на страницу товара | Кликнуть на карточку товара | Navigation | Редирект на `/product/:id`. Отображается название, описание, цена товара. |

### product-detail.spec.ts

| # | Название | Сценарий | Тип | AC |
|---|---|---|---|---|
| 2.9 | Карточка: отображение данных | Зайти на `/product/1` | Positive | Видно: "iPhone 15 Pro", "$1299.99", категория "Phones", описание, рейтинг. |
| 2.10 | Карточка: кнопка "В корзину" без авторизации | Зайти на `/product/1` неавторизованным | Guard | Кнопка "В корзину" НЕ отображается. Есть текст "Войдите, чтобы купить". |
| 2.11 | Карточка: кнопка "В корзину" для авторизованного | Залогиниться → `/product/1` | Positive | Кнопка "В корзину" отображается. |
| 2.12 | Карточка: отзывы | Зайти на `/product/1` | Positive | Раздел "Отзывы" содержит минимум 1 отзыв. Видно: имя автора, рейтинг, текст. |
| 2.13 | Карточка: кнопка "Назад" | Зайти на `/product/1` → нажать "← Назад" | Navigation | Возврат на предыдущую страницу (каталог). |

**Page Object:** `CatalogPage.ts`, `ProductPage.ts`

---

## Задача 3: Корзина — UI тесты

**Уроки:** 1 (actions), 2 (Page Object)

### cart.spec.ts

| # | Название | Сценарий | Тип | AC |
|---|---|---|---|---|
| 3.1 | Добавление товара в корзину | Залогиниться → `/product/1` → "В корзину" | Positive | Появляется тост "добавлен в корзину". Счётчик в хедере показывает 1. |
| 3.2 | Добавление нескольких товаров | Добавить товар 1 → добавить товар 3 | Positive | Счётчик в хедере = 2. На странице `/cart` отображаются оба товара. |
| 3.3 | Изменение количества (+) | Зайти в корзину → нажать "+" у товара | Positive | Количество увеличивается на 1. Итого пересчитывается. |
| 3.4 | Изменение количества (-) | Нажать "-" у товара с количеством 2 | Positive | Количество уменьшается на 1. Итого пересчитывается. |
| 3.5 | Удаление товара | Нажать кнопку удаления (X) | Positive | Товар исчезает из списка. Счётчик уменьшается. |
| 3.6 | Пустая корзина | Зайти в `/cart` без товаров | Negative | Отображается EmptyState "Корзина пуста". Кнопка "Перейти в каталог". |
| 3.7 | Кнопка "Оформить заказ" | Добавить товар → "Оформить заказ" | Navigation | Редирект на `/checkout`. |
| 3.8 | Корзина очищается после заказа | Добавить товар → оформить заказ → вернуться в корзину | Regression | Корзина пуста после оформления. |

**Page Object:** `CartPage.ts`, `CheckoutPage.ts`

---

## Задача 4: Checkout и заказы — UI тесты

**Уроки:** 1 (form fill), 2 (Page Object)

### checkout.spec.ts

| # | Название | Сценарий | Тип | AC |
|---|---|---|---|---|
| 4.1 | Checkout: happy path | Добавить товар → `/checkout` → заполнить адрес + телефон → "Подтвердить заказ" | Positive | Тост "Заказ оформлен!". Редирект на `/orders`. |
| 4.2 | Checkout: пустой адрес | Оставить адрес пустым → попытаться отправить | Negative | Браузерная валидация (required). Форма не отправляется. |
| 4.3 | Checkout: пустой телефон | Оставить телефон пустым → попытаться отправить | Negative | Браузерная валидация (required). |
| 4.4 | Checkout → заказ появляется в списке | Оформить заказ → `/orders` | Flow | Заказ отображается в списке с корректными данными (адрес, телефон, товары, сумма, статус PENDING). |

### orders.spec.ts

| # | Название | Сценарий | Тип | AC |
|---|---|---|---|---|
| 4.5 | Список заказов | Залогиниться как john@test.com → `/orders` | Positive | Заказы отображаются (если есть). Каждый заказ: ID, дата, статус, товары, сумма. |
| 4.6 | Статус badge | Проверить отображение статуса | Positive | Статус PENDING отображается с жёлтым стилем badge. |
| 4.7 | Детали заказа | Проверить содержимое заказа | Positive | Видно: список товаров с количеством и ценой, итого, адрес доставки. |
| 4.8 | Пустой список заказов | Новый пользователь → `/orders` | Negative | EmptyState "Заказов пока нет". Кнопка "Перейти в каталог". |
| 4.9 | /orders без авторизации | Зайти на `/orders` неавторизованным | Guard | Редирект на `/login`. |

---

## Задача 5: Админ-панель — UI тесты

**Уроки:** 2 (Page Object), 4.5 (навигация, guard)

### dashboard.spec.ts

| # | Название | Сценарий | Тип | AC |
|---|---|---|---|---|
| 5.1 | Дашборд: статистика | Залогиниться admin → `/admin` | Positive | 4 карточки: Пользователей (>=3), Товаров (10), Заказов (>=0), Выручка (>=0). |
| 5.2 | Дашборд: заказы по статусу | Проверить секцию "По статусу" | Positive | Отображаются badges статусов с количествами. |
| 5.3 | Дашборд: таблица заказов | Проверить "Последние заказы" | Positive | Таблица с колонками: ID, Пользователь, Сумма, Статус, Дата. |
| 5.4 | /admin без ADMIN роли | Залогиниться как user → `/admin` | Guard | Редирект на `/`. |

### products-crud.spec.ts

| # | Название | Сценарий | Тип | AC |
|---|---|---|---|---|
| 5.5 | Товары: список | Залогиниться admin → `/admin/products` | Positive | Таблица с минимум 10 товарами. Колонки: ID, Товар, Категория, Цена, Остаток, Действия. |
| 5.6 | Товары: создание | Нажать "+ Добавить" → заполнить форму → "Сохранить" | CRUD | Модалка закрывается. Новый товар появляется в таблице. |
| 5.7 | Товары: редактирование | Кликнуть "Ред." → изменить цену → "Сохранить" | CRUD | Цена обновлена в таблице. |
| 5.8 | Товары: удаление | Кликнуть "Удалить" → подтвердить confirm | CRUD | Товар исчезает из таблицы. |
| 5.9 | Товары: модалка — отмена | Открыть модалку → "Отмена" | Negative | Модалка закрывается. Товар не создаётся. |
| 5.10 | /admin/products без авторизации | Неавторизованный → `/admin/products` | Guard | Редирект на `/login`. |

**Page Object:** `DashboardPage.ts`, `ProductsPage.ts`

---

## Задача 6: API-тесты — Auth

**Урок:** 3 (API testing через `request` fixture)

### auth-api.spec.ts

| # | Название | Метод | Эндпоинт | Ожидаемый код | AC |
|---|---|---|---|---|---|
| 6.1 | Health check | GET | /api/health | 200 | `{status: "ok"}` |
| 6.2 | Регистрация: happy path | POST | /api/auth/register | 201 | Ответ содержит `{user, token}`. User.email совпадает. |
| 6.3 | Регистрация: дубликат | POST | /api/auth/register | 409 | `{error}` содержит текст про существующий email. |
| 6.4 | Регистрация: пустые поля | POST | /api/auth/register | 400 | `{error}`. Тело пустое. |
| 6.5 | Логин: happy path | POST | /api/auth/login | 200 | `{user, token}`. user.email совпадает. |
| 6.6 | Логин: неверный пароль | POST | /api/auth/login | 401 | `{error}`. |
| 6.7 | /me: happy path | GET | /api/auth/me | 200 | Cookie `token` установлен → `{user}`. |
| 6.8 | /me: без токена | GET | /api/auth/me | 401 | `{error}`. |

**API-клиент:** `AuthApi.ts`

---

## Задача 7: API-тесты — Products

**Урок:** 3

### products-api.spec.ts

| # | Название | Метод | Эндпоинт | Код | AC |
|---|---|---|---|---|---|
| 7.1 | Список товаров | GET | /api/products | 200 | `{data: [...], pagination}`. data.length >= 10. |
| 7.2 | Товар по ID | GET | /api/products/1 | 200 | `{data: {id: 1, name: "iPhone 15 Pro", ...}}` |
| 7.3 | Товар не найден | GET | /api/products/9999 | 404 | `{error}`. |
| 7.4 | Категории | GET | /api/products/categories | 200 | `{data: ["Phones", "Laptops", ...]}`. Минимум 6 категорий. |
| 7.5 | Фильтр: category=Phones | GET | /api/products?category=Phones | 200 | Все элементы data.category === "Phones". |
| 7.6 | Фильтр: search=iPhone | GET | /api/products?search=iPhone | 200 | data.length >= 1. |
| 7.7 | Сортировка: price_asc | GET | /api/products?sort=price_asc | 200 | data[0].price <= data[1].price. |
| 7.8 | Пагинация | GET | /api/products?page=1&limit=3 | 200 | data.length === 3. pagination.pages >= 4. |

**API-клиент:** `ProductsApi.ts`

---

## Задача 8: API-тесты — Cart

**Урок:** 3

### cart-api.spec.ts

| # | Название | Метод | Эндпоинт | Код | AC |
|---|---|---|---|---|---|
| 8.1 | Добавление в корзину | POST | /api/cart | 201 | `{data: {id, productId, quantity}}`. |
| 8.2 | Список корзины | GET | /api/cart | 200 | `{data: [...], total, count}`. count >= 1. |
| 8.3 | Обновление количества | PUT | /api/cart/:itemId | 200 | `{data: {quantity: N}}`. |
| 8.4 | Удаление из корзины | DELETE | /api/cart/:itemId | 204 | Товар удалён. |
| 8.5 | Корзина без авторизации | GET | /api/cart | 401 | `{error}`. |
| 8.6 | Добавление несуществующего товара | POST | /api/cart | 404 | `{error}`. |

**API-клиент:** `CartApi.ts`

---

## Задача 9: API-тесты — Orders

**Урок:** 3

### orders-api.spec.ts

| # | Название | Метод | Эндпоинт | Код | AC |
|---|---|---|---|---|---|
| 9.1 | Создание заказа | POST | /api/orders | 201 | `{data: {id, status: "PENDING", total, ...}}`. |
| 9.2 | Список заказов | GET | /api/orders | 200 | `{data: [...]}`. |
| 9.3 | Заказ по ID | GET | /api/orders/:id | 200 | `{data: {id, items, user, ...}}`. |
| 9.4 | Чужой заказ | GET | /api/orders/:id (чужой ID) | 403 | `{error}`. |
| 9.5 | Обновление статуса (admin) | PATCH | /api/orders/:id/status | 200 | Статус обновлён. |

**API-клиент:** `OrdersApi.ts`

---

## Задача 10: API-тесты — Negative / Edge Cases

**Урок:** 3

### negative-api.spec.ts

| # | Название | Метод | Эндпоинт | Код | AC |
|---|---|---|---|---|---|
| 10.1 | PUT /api/cart/:id — несуществующий | PUT | /api/cart/99999 | 404 | `{error}`. |
| 10.2 | DELETE /api/cart/:id — несуществующий | DELETE | /api/cart/99999 | 404 | `{error}`. |
| 10.3 | POST /api/orders без авторизации | POST | /api/orders | 401 | `{error}`. |
| 10.4 | POST /api/orders — пустой адрес | POST | /api/orders | 400 | `{error}`. |
| 10.5 | PATCH /api/orders/:id/status — несуществующий | PATCH | /api/orders/99999/status | 404 | `{error}`. |
| 10.6 | POST /api/products (user роль) | POST | /api/products | 403 | `{error}`. |
| 10.7 | PUT /api/products/:id (user роль) | PUT | /api/products/1 | 403 | `{error}`. |
| 10.8 | GET /api/admin/stats (user роль) | GET | /api/admin/stats | 403 | `{error}`. |

**API-клиент:** `AdminApi.ts`

---

## Задача 11: Mock / Intercept (API + UI)

**Урок:** 4 (page.route, route.fulfill, route.request().postDataJSON())

### mock-intercept.spec.ts

| # | Название | Сценарий | Техника | AC |
|---|---|---|---|---|
| 11.1 | Мок: каталог с фейковыми товарами | `page.route("**/api/products", route.fulfill({data: [...fake]}))` | route.fulfill | На главной отображаются моковые товары (не реальные). Проверить название мокового товара. |
| 11.2 | Мок: ошибка сервера 500 | `page.route("**/api/products", route.fulfill({status: 500}))` | route.fulfill | На странице отображается пустое состояние или сообщение об ошибке. Нет краша. |
| 11.3 | Перехват: тело запроса логина | `page.route("**/api/auth/login", route => { capture = route.request().postDataJSON(); route.continue(); })` | route.continue + capture | После отправки формы логина captured body содержит `{email, password}`. Запрос доходит до сервера. |
| 11.4 | Мок: корзина с фейсовыми данными | Залогиниться → замокать GET /api/cart → зайти в `/cart` | route.fulfill | Отображаются моковые товары в корзине. |
| 11.5 | Мок: админ-дашборд с фейковой статистикой | Залогиниться admin → замокать GET /api/admin/stats | route.fulfill | На дашборде отображаются фейковые цифры статистики. |

---

## Задача 12: Regression — полные сценарии

**Урок:** 4.5 (архитектура, навигация), 5 (артефакты)

### full-flow.spec.ts

| # | Название | Сценарий | AC |
|---|---|---|---|
| 12.1 | Full flow: регистрация → покупка | Зарегистрироваться → зайти в каталог → найти "AirPods Pro 2" → добавить в корзину → перейти в корзину → оформить заказ (адрес, телефон) → перейти в заказы → проверить что заказ есть со статусом PENDING | Весь флоу без ошибок. |
| 12.2 | Full flow: admin CRUD | Залогиниться admin → `/admin/products` → добавить товар "Test Product" → проверить что он в таблице → отредактировать цену → проверить что цена изменилась → удалить товар → проверить что его нет | Полный CRUD-цикл. |

**Артефакты (Урок 5):**
- Тест 12.1 делает скриншот после каждого ключевого шага через `test.info().attach()`
- Конфиг уже настроен: `trace: "on-first-retry"`, `screenshot: "only-on-failure"`, `video: "retain-on-failure"`

---

## Итого: сводка тестов

| Раздел | Файл | Кол-во | Уроки |
|---|---|---|---|
| Авторизация (UI) | login.spec.ts | 6 | 1, 2 |
| Регистрация (UI) | register.spec.ts | 4 | 1, 2 |
| Каталог (UI) | catalog.spec.ts | 8 | 1, 4.5 |
| Карточка товара (UI) | product-detail.spec.ts | 5 | 1, 2 |
| Корзина (UI) | cart.spec.ts | 8 | 1, 2 |
| Checkout (UI) | checkout.spec.ts | 4 | 1, 2 |
| Заказы (UI) | orders.spec.ts | 5 | 1, 2 |
| Админ дашборд (UI) | dashboard.spec.ts | 4 | 2, 4.5 |
| Админ товары (UI) | products-crud.spec.ts | 6 | 2, 4.5 |
| API Auth | auth-api.spec.ts | 8 | 3 |
| API Products | products-api.spec.ts | 8 | 3 |
| API Cart | cart-api.spec.ts | 6 | 3 |
| API Orders | orders-api.spec.ts | 5 | 3 |
| API Negative | negative-api.spec.ts | 8 | 3 |
| Mock/Intercept | mock-intercept.spec.ts | 5 | 4 |
| Regression | full-flow.spec.ts | 2 | 4.5, 5 |
| **ИТОГО** | | **~84** | **1–5** |

---

## Порядок написания (рекомендация)

Писать тесты в этом порядке — от простого к сложному:

1. **Конфиг** — `playwright.config.ts` (baseURL, webServer)
2. **API-клиенты** — `api/AuthApi.ts`, `ProductsApi.ts`, `CartApi.ts`, `OrdersApi.ts`, `AdminApi.ts`
3. **API-тесты Auth** — `auth-api.spec.ts` (быстро, проверяют что API работает)
4. **Page Object: Header, Login, Register** — базовые компоненты
5. **UI-тесты Auth** — `login.spec.ts`, `register.spec.ts`
6. **Page Object: Catalog, Product** — каталог и товар
7. **UI-тесты Catalog** — `catalog.spec.ts`, `product-detail.spec.ts`
8. **Page Object: Cart, Checkout, Orders** — корзина и заказы
9. **UI-тесты Cart + Checkout** — `cart.spec.ts`, `checkout.spec.ts`, `orders.spec.ts`
10. **Page Object: Admin** — дашборд и товары
11. **UI-тесты Admin** — `dashboard.spec.ts`, `products-crud.spec.ts`
12. **API-тесты Products, Cart, Orders** — `products-api.spec.ts`, `cart-api.spec.ts`, `orders-api.spec.ts`
13. **API-тесты Negative** — `negative-api.spec.ts`
14. **Mock/Intercept** — `mock-intercept.spec.ts`
15. **Regression** — `full-flow.spec.ts`
16. **Docker + CI** — `Dockerfile`, `docker-compose.yml`, `.github/workflows/test.yml`

---

## Fixture: loginAs

Для всех UI-тестов, требующих авторизации, используется фикстура:

```typescript
// fixtures/base.ts
import { test as base, Page } from "@playwright/test";

type Fixtures = {
  adminPage: Page;
  userPage: Page;
};

export const test = base.extend<Fixtures>({
  adminPage: async ({ page }, use) => {
    await page.goto("http://localhost:5173/login");
    await page.getByPlaceholder("admin@techshop.com").fill("admin@techshop.com");
    await page.getByPlaceholder("••••••••").fill("admin123");
    await page.getByRole("button", { name: "Войти" }).click();
    await page.waitForURL("/");
    await use(page);
  },
  userPage: async ({ page }, use) => {
    await page.goto("http://localhost:5173/login");
    await page.getByPlaceholder("admin@techshop.com").fill("john@test.com");
    await page.getByPlaceholder("••••••••").fill("user123");
    await page.getByRole("button", { name: "Войти" }).click();
    await page.waitForURL("/");
    await use(page);
  },
});

export { expect } from "@playwright/test";
```

---

## Конфигурация Playwright

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:5173",
    apiURL: process.env.API_URL || "http://localhost:4000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
```

---

## Данные для тестов (переменные)

```typescript
// tests/test-data.ts
export const USERS = {
  admin: { email: "admin@techshop.com", password: "admin123", name: "Admin User" },
  user:  { email: "john@test.com",      password: "user123",  name: "John Doe" },
  jane:  { email: "jane@test.com",       password: "user123",  name: "Jane Smith" },
};

export const PRODUCTS = {
  iphone:     { id: 1, name: "iPhone 15 Pro",              price: 1299.99, category: "Phones" },
  macbook:    { id: 2, name: "MacBook Air M3",             price: 1099.99, category: "Laptops" },
  sony:       { id: 3, name: "Sony WH-1000XM5",            price: 349.99,  category: "Audio" },
  ipad:       { id: 4, name: "iPad Air",                    price: 599.99,  category: "Tablets" },
  samsung:    { id: 5, name: "Samsung Galaxy S24 Ultra",    price: 1199.99, category: "Phones" },
  dell:       { id: 6, name: "Dell XPS 15",                 price: 1299.99, category: "Laptops" },
  airpods:    { id: 7, name: "AirPods Pro 2",               price: 249.99,  category: "Audio" },
  switch:     { id: 8, name: "Nintendo Switch OLED",        price: 349.99,  category: "Gaming" },
  dualsense:  { id: 9, name: "PS5 DualSense Controller",    price: 69.99,   category: "Gaming" },
  mxmaster:   { id: 10, name: "Logitech MX Master 3S",     price: 99.99,   category: "Accessories" },
};
```
