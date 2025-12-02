
# Financial Advisor Website

A full‑stack financial advisor platform with portfolio management, monthly budgets, and retirement planning. Backend runs on Node/Express with JWT auth; data is stored in Supabase via `@supabase/supabase-js`. Frontend runs on Vite/React.

Website : finflowad.netlify.app

## Features

- Authentication: register, login, profile update
- Portfolio: allocation tracking and updates
- Budget: monthly budgets with categories and current month default
- Retirement: create, update, list, delete plans
- Activity log: simple audit trail of user actions

## Project Structure

- `src/backend/` Node.js/Express API
  - `server.js` entrypoint and routes
  - `controllers/` business logic (auth, portfolio, budget, retirement)
  - `middleware/` JWT auth
  - `config/` Supabase client and legacy Prisma config
- Frontend at project root (Vite). Entry `index.html` and `src/`
- `src/frontend/src/services/api.ts` shared API helper used by UI

## Prerequisites

- Node.js 18+ and npm
- Supabase project (URL + keys)

## Environment Configuration

Backend `.env` in `src/backend/`:

```
JWT_SECRET="<a strong random string>"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"

SUPABASE_URL="https://<your-project-ref>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="<service role key>"
SUPABASE_ANON_KEY="<anon key>"
USE_SUPABASE="1"
```

- Do not commit `.env` files or keys
- Server uses `SUPABASE_SERVICE_ROLE_KEY` for trusted operations (bypasses RLS)
- Client can use `SUPABASE_ANON_KEY` if you integrate supabase-js in the browser

## Supabase Setup

Create tables in Supabase SQL editor:

```
-- Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password text not null,
  phone text,
  address text,
  "dateOfBirth" timestamptz,
  occupation text,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);

-- Activities
create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references users(id) on delete cascade,
  type text not null,
  description text not null,
  timestamp timestamptz default now()
);

-- Portfolios (one per user)
create table if not exists portfolios (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references users(id) on delete cascade,
  stocks double precision default 0,
  bonds double precision default 0,
  "realEstate" double precision default 0,
  cash double precision default 0,
  "totalInvested" double precision default 0,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);
create unique index if not exists portfolios_user_unique on portfolios("userId");

-- Budgets (unique per user+month+year)
create table if not exists budgets (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references users(id) on delete cascade,
  "monthlyIncome" double precision not null,
  housing double precision default 0,
  utilities double precision default 0,
  food double precision default 0,
  transportation double precision default 0,
  insurance double precision default 0,
  entertainment double precision default 0,
  other double precision default 0,
  month int not null,
  year int not null,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);
create unique index if not exists budgets_user_month_year_unique on budgets("userId", month, year);

-- Retirement Plans
create table if not exists retirement_plans (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references users(id) on delete cascade,
  "currentAge" int not null,
  "retirementAge" int not null,
  "currentSavings" double precision not null,
  "monthlyContribution" double precision not null,
  "expectedReturn" double precision not null,
  "retirementGoal" double precision not null,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);
```

Enable RLS and add owner policies (if using anon key on client):

- Enable RLS: `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`
- Policies: allow SELECT/INSERT/UPDATE/DELETE where `"userId" = auth.uid()`; for `users`, use `id = auth.uid()`
- Server calls with service role key bypass RLS

## Running Locally

Backend (from `src/backend/`):

```
npm install
npm run dev
```

Frontend (project root):

```
npm install
npm run dev
```

- Open `http://localhost:3000/`
- Backend health: `http://localhost:5000/health` and `http://localhost:5000/api/health`

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `GET /api/portfolio`
- `PUT /api/portfolio`
- `GET /api/budget`
- `GET /api/budget/current`
- `POST /api/budget`
- `DELETE /api/budget/:month/:year`
- `GET /api/retirement`
- `POST /api/retirement`
- `PUT /api/retirement/:id`
- `DELETE /api/retirement/:id`

## Frontend API Config

- `VITE_API_URL` defaults to `http://localhost:5000/api`
- Auth token stored as `wealthwise_token` in `localStorage`

## Testing (Backend)

From `src/backend/`:

```
npm run test:unit
npm run test:integration
npm test -- --coverage
```

## Troubleshooting

- “Service unavailable” in UI:
  - Ensure backend is running on `http://localhost:5000`
  - Verify frontend `.env` sets `VITE_API_URL` correctly
  - Log in so protected endpoints include `Authorization: Bearer <token>`
  - Health: check `/api/health`

## Security

- Never commit secrets or `.env` files
- Use strong `JWT_SECRET`
- Prefer service role key only on server; never expose it to clients
  
