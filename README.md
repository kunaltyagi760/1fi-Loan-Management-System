# LMS - LAMF Demo

This repository contains a small demo Loan Management System focused on Lending Against Mutual Funds (LAMF).

Contents:
- Next.js + TypeScript frontend using Chakra UI and Formik
- API routes (Next.js) with Prisma (SQLite) database
- JWT authentication (demo)

Quick start

1. Copy `.env.example` to `.env` and adjust values.
2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client and migrate/seed:

```bash
npx prisma generate

If you want to keep using SQLite (default):

npx prisma generate
npx prisma migrate dev --name init
npm run seed

Switching to MongoDB (optional)

Yes — you can point the `DATABASE_URL` to a local MongoDB instance (for example one managed via MongoDB Compass). However, switching to MongoDB requires updating the Prisma datasource provider and some schema changes. Below are the recommended steps to convert the project to MongoDB when you are ready:

1. Update `.env` to set your MongoDB connection string, for example:

```bash
# LMS - LAMF Demo

This repository is a demo Loan Management System focused on Lending Against Mutual Funds (LAMF).

Overview
- Next.js + TypeScript frontend (Chakra UI, Formik)
- API routes implemented with Next.js + Prisma
- Database: MongoDB (development) via Prisma MongoDB connector (project also includes legacy SQLite notes)
- JWT authentication (demo tokens)

Quick start (local development)

1. Copy `.env.example` to `.env` and update values. Required vars:

	 - `DATABASE_URL` — a MongoDB connection string, e.g. `mongodb://localhost:27017/1fi-lms`
	 - `JWT_SECRET` — any strong secret used to sign JWTs

2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client and push schema (Mongo):

```bash
npx prisma generate
npx prisma db push
```

4. Seed the database (native Mongo seed for local Mongo without replica set):

```bash
node prisma/seed_mongo.js
```

5. Run the dev server:

```bash
npm run dev
```

Notes about Mongo & Prisma
- This project uses Prisma with the MongoDB provider. Local MongoDB instances that are not started as a replica set may cause Prisma operations requiring transactions to fail. To accommodate this during development the repository includes `prisma/seed_mongo.js` (native Mongo driver) and API handlers include fallbacks that insert documents using the native Mongo driver when Prisma raises a "replica set / transactions" error.
- If you run MongoDB as a replica set (or use a hosted Mongo that supports transactions) you can use Prisma directly for all writes.

Default seeded user
- `admin@example.com` / `password123` (created by `prisma/seed_mongo.js`)

API Endpoints

Auth
- `POST /api/auth/login`
	- Body: `{ "email": "<email>", "password": "<password>" }`
	- Success response: `200` `{ "token": "<jwt>" }`

- `POST /api/auth/register`
	- Body: `{ "email": "<email>", "password": "<password>", "name": "<name>" }`
	- Success: `201` `{ "id": "<id>", "email": "..." }`
	- Duplicate email: `409` `{ "error": "Email already registered" }`

Loans / Applications
- `POST /api/loans` (protected — Authorization: `Bearer <token>`)
	- Body example:
		```json
		{
			"productId": "69477f911d8101e26941f05e",
			"applicantName": "Kunal Tyagi",
			"applicantEmail": "kunal@gmail.com",
			"principal": 300000,
			"tenureMonths": 24
		}
		```
	- Success: `201` returns created application JSON (Prisma document or native Mongo fallback)
	- Error: `400` for validation, `401` for missing auth

- `GET /api/loans/my` (protected) — returns user's applications

- `GET /api/loans/:id` — application detail

Products
- `GET /api/products` — returns available loan products

Example responses
- Login success:
```json
{ "token": "eyJ..." }
```
- Create application success (example):
```json
{
	"id": "6948c34eea4a4229458e5761",
	"productId": "69477f911d8101e26941f05e",
	"applicantName": "Kunal Tyagi",
	"applicantEmail": "kunal@gmail.com",
	"principal": 300000,
	"tenureMonths": 24,
	"rate": 10,
	"status": "pending",
	"createdAt": "2025-12-22T04:04:30.393Z",
	"createdBy": "6948c201ea4a4229458e575e"
}
```

Tech stack
- Next.js (pages router)
- TypeScript
- Chakra UI
- Formik
- Prisma (MongoDB provider)
- MongoDB (development)
- jsonwebtoken (JWT)
- bcrypt for password hashing

Schema
- See `prisma/schema.prisma`. Models include:
	- `User` (id, email, password (hashed), name, createdAt, applications[])
	- `LoanProduct` (id, name, description, interest, createdAt, applications[])
	- `LoanApplication` (id, productId, applicantName, applicantEmail, principal, tenureMonths, rate, status, createdAt, createdBy, collaterals[])
	- `Collateral` (id, applicationId, fundName, folio, units, nav, createdAt)

Database seed data
- `prisma/seed_mongo.js` creates a demo admin user, some loan products, and a sample application and collateral. Use it when running a local MongoDB that is not a replica set.

Deployment (Vercel)

1. Create a new Vercel project and point it to this GitHub repo.
2. Set environment variables in Vercel's dashboard:
	 - `DATABASE_URL` (MongoDB connection string)
	 - `JWT_SECRET`
3. Build command: `npm run build` (Vercel will run `npm install` automatically)
4. After deployment, run `npx prisma db push` on your production database (or include migration/push as part of your CI) and seed the DB if needed. For hosted Mongo, you can run the included `prisma/seed_mongo.js` with Node targeting your production DB (be careful not to overwrite production data).

Repository contents
- `pages/` — Next.js pages & API routes
- `components/` — React components (Sidebar, Layout, etc.)
- `lib/` — Prisma client wrapper, API helpers
- `prisma/` — `schema.prisma`, `seed_mongo.js` (native seed), fallback `seed.js`
- `scripts/` — helper scripts (test scripts)

Security notes
- Tokens in this demo are stored in `localStorage`. For production, use httpOnly secure cookies and refresh-token flows.
- Never commit `.env` or secrets to Git.

Deliverables checklist
1. 5–10 minute demo video (you): show frontend, API, and DB seed/inspect. See the "Video script" section below.
2. GitHub repo: includes schema and seed data (`prisma/schema.prisma`, `prisma/seed_mongo.js`)
3. Deployed demo: deploy to Vercel/Render and provide public link; remember to set `DATABASE_URL` and `JWT_SECRET` in the platform's env settings.

Video script / recording content (5–10 minutes)
-- 0:00–0:30 — Intro: Project name, objective (LAMF loan demo), tech stack (Next.js, Prisma, MongoDB, Chakra, JWT)
-- 0:30–1:30 — Quick tour of the UI: Home page, Login / Signup, Dashboard, Loan Products listing
-- 1:30–2:30 — Show the Create Application flow in the UI (fill form and submit). Explain validation and protected route behavior (redirects to login if unauthenticated).
-- 2:30–3:30 — Show the API in action: open browser DevTools / Network or use `curl` / `http` to call `POST /api/loans` and `GET /api/loans/my`. Show request/response (include Authorization header with Bearer token).
-- 3:30–4:30 — Inspect the database: open MongoDB Compass (or `mongosh`) and show the inserted documents in `User`, `LoanProduct`, `LoanApplication`, and `Collateral` collections. Mention `prisma/seed_mongo.js` used to seed initial data.
-- 4:30–5:30 — Briefly open key code: `pages/api/loans/index.ts`, `pages/api/auth/register.ts`, and `lib/prisma.ts`. Explain JWT auth flow and fallback logic for local Mongo (native driver fallback when Prisma requires replica set).
-- 5:30–6:00 — Deployment: mention Vercel settings (set `DATABASE_URL`, `JWT_SECRET`) and show live deployed link if available.
-- 6:00–6:30 — Closing: next steps (httpOnly cookies, server-side validation, production DB migrations) and where the repo is located.

Suggested recording commands (for API demo):
```bash
# Login and store token
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"password123"}'

# Create an application (replace <TOKEN>)
curl -X POST http://localhost:3000/api/loans -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"productId":"69477f911d8101e26941f05e","applicantName":"Demo","applicantEmail":"demo@example.com","principal":100000,"tenureMonths":12}'
```

Troubleshooting & FAQs
- If you see errors about Prisma requiring a replica set or transactions, run the native seed: `node prisma/seed_mongo.js`. The API includes native Mongo fallbacks for some writes in local dev for convenience.
- Ensure `DATABASE_URL` is set and MongoDB is reachable.

If you'd like, I can also:
- Add httpOnly cookie auth and refresh token support
- Harden validation with `yup` on forms and server-side
- Create a short `deploy.sh` script for easy deployment to a hosted Mongo and Vercel

---

# 1fi-Loan-Management-System