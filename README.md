# TechShop — E2E Testing Project

Full-stack e-commerce application with comprehensive Playwright E2E tests.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| Backend | Express + TypeScript + Prisma ORM + PostgreSQL |
| Tests | Playwright (UI + API + Mock/Intercept) |
| CI/CD | GitHub Actions + Docker Compose |

## Quick Start

```bash
docker compose up -d db backend
cd frontend && npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:4000

## Run Tests

```bash
cd Playwright-Study
npx playwright test
```

## Project Structure

```
├── backend/              # Express API server
│   ├── src/modules/      # auth, products, cart, orders, admin
│   ├── prisma/           # schema + seed
│   └── Dockerfile
├── frontend/             # React SPA
│   ├── src/pages/        # Home, ProductDetail, Cart, Checkout, etc.
│   ├── src/contexts/     # Auth, Cart, Toast
│   └── Dockerfile
├── Playwright-Study/     # E2E tests
│   ├── fixtures/         # Custom fixtures (adminPage, userPage)
│   ├── pages/            # Page Objects
│   ├── tests/            # Test specs
│   │   ├── auth/         # Login, Register
│   │   ├── catalog/      # Catalog, Product Detail
│   │   ├── cart/         # Cart operations
│   │   ├── checkout/     # Checkout, Orders
│   │   ├── admin/        # Dashboard, Products CRUD
│   │   ├── api/          # API tests (auth, products, cart, orders, negative)
│   │   ├── mock/         # Mock & Intercept tests
│   │   └── regression/   # Full flow scenarios
│   └── test-data.ts      # Test data (users, products)
├── test-plan/            # Test plan documentation
├── docker-compose.yml    # All services
└── .github/workflows/    # CI pipeline
```

## Test Coverage

| Module | Tests | Type |
|--------|-------|------|
| Auth (UI) | Login, Register | Positive / Negative / Guard |
| Catalog | Search, Filters, Sorting | Positive / Negative |
| Product Detail | Data, Reviews, Cart button | Positive / Guard |
| Cart | Add, Quantity, Remove, Empty | Positive / Regression |
| Checkout | Order placement | Positive / Negative |
| Orders | List, Status, Details | Positive / Guard |
| Admin | Dashboard stats, Products CRUD | Positive / Guard |
| API | Auth, Products, Cart, Orders | Positive / Negative |
| Mock/Intercept | Fake data, Server errors | Integration |
| Regression | Full purchase flow | E2E |

## Seed Data

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@techshop.com | admin123 |
| User | john@test.com | user123 |
| User | jane@test.com | user123 |
