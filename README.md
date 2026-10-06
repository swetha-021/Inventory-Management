# Inventory Management

A role-based inventory system built with Java 17, Spring Boot, Spring Security, PostgreSQL, and Next.js.

Staff, Managers, and Admins each get different permissions, enforced on the backend. Every stock change is recorded in a movement ledger, and admin-level actions are written to an audit log.

---

## Features

- JWT-based login and registration (new accounts are always created as Staff)
- Three roles (Staff, Manager, Admin), enforced on the API with `@PreAuthorize`
- Product management with search, category and supplier filters, and pagination
- Stock in/out endpoints that update quantity and record a movement in the same transaction
- Low-stock report for Managers and Admins
- Audit log for Admins
- A Next.js UI that shows or hides actions based on role

## Permissions

| Action | Staff | Manager | Admin |
|---|:---:|:---:|:---:|
| View products, record stock in/out | ✓ | ✓ | ✓ |
| Manage products, suppliers, categories | | ✓ | ✓ |
| View low-stock report | | ✓ | ✓ |
| Manage users and roles, view audit logs | | | ✓ |

## Design decisions

- **Permissions are enforced on the backend, not just the UI.** The frontend hides actions a user can't take, but the API still returns `403` if a forbidden endpoint is called directly.
- **Quantity can only change through stock movements.** Product updates can't edit quantity, so the ledger always explains the current stock level.
- **Stock updates are transactional.** The quantity change and its movement record are saved together, and a stock-out that would make quantity negative is rejected.
- **Self-registration is limited to Staff.** Only an Admin can grant higher roles.
- **No hardcoded secrets.** The JWT secret and database credentials come from environment variables.

## Tech stack

| Layer | Tools |
|---|---|
| Backend | Java 17, Spring Boot 3.4, Spring Security, Spring Data JPA, Flyway |
| Database | PostgreSQL 16 (H2 for tests and the local dev profile) |
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Testing | JUnit 5, Mockito |
| DevOps | Docker Compose, GitHub Actions |

## Getting started

### Option A: In-memory database (no Docker needed)

```bash
# Terminal 1
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Terminal 2
cd frontend
npm install
npm run dev
```

### Option B: PostgreSQL with Docker Compose

```bash
docker compose up postgres

# In a new terminal
cd backend
./mvnw spring-boot:run

# In another terminal
cd frontend
npm install
npm run dev
```

The frontend runs at http://localhost:3000 and the API at http://localhost:8080. If you change the API port, set `NEXT_PUBLIC_API_URL` in `frontend/.env.local`.

### Demo accounts

These are seeded on first run for local testing only.

| Role | Email | Password |
|---|---|---|
| Admin | admin@inventory.local | Admin123! |
| Manager | manager@inventory.local | Manager123! |
| Staff | staff@inventory.local | Staff123! |

## API overview

| Method | Path | Access |
|---|---|---|
| POST | `/auth/register` | Public (creates Staff) |
| POST | `/auth/login` | Public |
| GET | `/auth/me` | Authenticated |
| GET | `/products` | Staff and above |
| POST / PUT / DELETE | `/products` | Manager and above |
| GET / POST / PUT / DELETE | `/suppliers` | Manager and above |
| POST | `/stock/in`, `/stock/out` | Staff and above |
| GET | `/stock/movements` | Staff and above |
| GET | `/reports/low-stock` | Manager and above |
| GET | `/audit-logs` | Admin |
| GET / PUT / PATCH | `/users` | Admin |

## Tests

```bash
cd backend
./mvnw test
```

The tests focus on access control and stock rules, including:

- Staff cannot create, update, or delete products (`403`)
- Staff cannot view audit logs or the low-stock report
- Managers can view the low-stock report, and Admins can view audit logs
- A stock-out with insufficient quantity is rejected

GitHub Actions runs the backend tests and a frontend production build on every push. See `.github/workflows/ci.yml`.

## Development notes

Cursor was a helpful assistant along the way, mainly for scaffolding boilerplate, drafting test cases, and speeding up the frontend setup. I reviewed and tested its suggestions, especially around authorization rules and transactional stock updates.

## What I'd like to improve next

- Refresh tokens and token revocation
- Rate limiting on the auth endpoints
- Purchase orders that create stock-in movements automatically
- A hosted demo
