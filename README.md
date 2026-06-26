# Inventory Management

Role-based inventory system rebuilt as a portfolio project aligned with ID.me’s stack: **Java 17, Spring Boot, Spring Security (JWT + `@PreAuthorize`), PostgreSQL, Next.js, TypeScript, and Tailwind**.

The previous Express/Vite app was a personal CRUD tool. This rewrite is a multi-role inventory system: users and roles, products, categories, suppliers, a stock movement ledger, audit logs, and backend-enforced permissions.

## Features

- JWT login and register (register always creates **Staff**)
- Roles: **Staff**, **Manager**, **Admin**, enforced on the API with `@PreAuthorize`
- Product CRUD with search, category/supplier filters, and pagination
- `POST /stock/in` and `POST /stock/out` update quantity and write a movement in the same transaction
- Stock-out is rejected when quantity would go negative
- Low-stock report (Manager+)
- Audit logs (Admin only)
- Next.js UI that shows or hides actions by role (the API still returns 403 if you call a forbidden endpoint)

## Permission matrix

| Action | Staff | Manager | Admin |
|---|---|---|---|
| View products, record stock in/out | Yes | Yes | Yes |
| Manage products, suppliers, categories | No | Yes | Yes |
| Low-stock report | No | Yes | Yes |
| Manage users/roles, view audit logs | No | No | Yes |

## Tech

- Backend: Spring Boot 3.4, Java 17, Spring Security, Spring Data JPA, Flyway, JUnit 5, Mockito
- Database: PostgreSQL 16 (H2 for tests and a local `dev` profile)
- Frontend: Next.js 15, TypeScript, Tailwind CSS
- DevOps: Docker Compose, GitHub Actions CI

## Quick start

### Option A — in-memory database (no Docker)

```bash
# terminal 1
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# terminal 2
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Option B — PostgreSQL with Docker Compose

```bash
docker compose up postgres
cd backend
./mvnw spring-boot:run
cd ../frontend
npm run dev
```

The API listens on `http://localhost:8080`. Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` if you change that.

### Demo accounts (seeded on first run)

| Role | Email | Password |
|---|---|---|
| Admin | admin@inventory.local | Admin123! |
| Manager | manager@inventory.local | Manager123! |
| Staff | staff@inventory.local | Staff123! |

## API

| Method | Path | Access |
|---|---|---|
| POST | `/auth/register` | Public (creates Staff) |
| POST | `/auth/login` | Public |
| GET | `/auth/me` | Authenticated |
| GET/POST/PUT/DELETE | `/products` | GET: Staff+ · write: Manager+ |
| POST | `/stock/in`, `/stock/out` | Staff+ |
| GET | `/stock/movements` | Staff+ |
| GET | `/reports/low-stock` | Manager+ |
| GET | `/audit-logs` | Admin |
| GET/PUT/PATCH | `/users` | Admin |
| GET/POST/PUT/DELETE | `/suppliers` | Manager+ |

Quantity is **not** editable on product update. Stock changes go through the movement endpoints so the ledger stays accurate.

## Tests

```bash
cd backend
./mvnw test
```

Permission tests include:

- Staff cannot create, update, or delete products (`403`)
- Staff cannot view audit logs or the low-stock report
- Manager can view low-stock; Admin can view audit logs
- Stock-out with insufficient quantity is rejected

CI runs backend tests and a frontend production build on every push (`.github/workflows/ci.yml`).

## Screenshots

See [`docs/screenshots`](docs/screenshots) after running the app:

- Login
- Dashboard (low-stock cards for Manager/Admin)
- Product list
- Stock in/out
- Admin users and audit logs

## Built with Cursor

This project was rebuilt with **Cursor**. I used it to:

- Evaluate whether a Spring Boot rewrite of the old Express app was feasible
- Scaffold the Spring Boot module, Flyway schema, JWT security, and `@PreAuthorize` rules
- Generate permission-focused JUnit tests (Staff cannot delete products)
- Build the Next.js + Tailwind UI and GitHub Actions workflow

I reviewed generated code for auth rules, transactional stock updates, and secret handling (JWT and DB credentials come from environment variables, not hardcoded files).
