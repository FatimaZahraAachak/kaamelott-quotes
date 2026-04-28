# Local Setup Guide

This document walks you through preparing your local environment and running
the **Kaamelott Quotes** app on your own machine, from a fresh `git clone` to
a working browser tab.

If you only want the original test brief, see [readme.md](readme.md).

---

## Overview

The repository is a small monorepo with two independent Node.js apps:

| Folder       | Stack                                          | Port  |
| ------------ | ---------------------------------------------- | ----- |
| `backend/`   | Express 5 + TypeScript + SQLite (Drizzle ORM)  | 3000  |
| `frontend/`  | React 19 + Vite + Tailwind + TanStack Query    | 5173  |
| `assets/`    | JSON source data (quotes & characters)         | —     |

When you finish this guide you will have:

- A SQLite database at `backend/data.db` populated with all Kaamelott quotes.
- A backend API running at <http://localhost:3000>.
- A frontend running at <http://localhost:5173> that lets you search, filter,
  sort and paginate the quotes.

---

## 1. Prerequisites

Install these once on your machine:

| Tool    | Version           | Check command       |
| ------- | ----------------- | ------------------- |
| Node.js | 20 LTS or newer   | `node -v`           |
| npm     | comes with Node   | `npm -v`            |
| Git     | any recent        | `git --version`     |

> **Why Node 20+?** The project uses Vite 8, Express 5, TypeScript 6 and the
> native `better-sqlite3` module — all of which expect a modern Node runtime.

> **Package manager.** `package-lock.json` files are committed, so use **npm**
> (not yarn / pnpm) to keep the lockfiles consistent.

### Windows-specific note

`better-sqlite3` is a native module. In the vast majority of cases npm will
download a prebuilt binary and you will not need to compile anything.

If `npm install` in `backend/` fails with a `node-gyp` error, install the
free **Visual Studio Build Tools** with the *"Desktop development with C++"*
workload, then re-run `npm install`. Python 3 may also be required by
`node-gyp`.

---

## 2. Project structure

```
technical-test-fatima/
├── assets/          # source JSON data (quotes/, characters.json)
├── backend/         # Express API + SQLite
│   ├── drizzle/     # SQL migrations (auto-generated)
│   └── src/         # TypeScript sources
├── frontend/        # React + Vite app
│   └── src/         # TypeScript sources
├── readme.md        # original technical-test brief
└── SETUP.md         # this file
```

---

## 3. Clone the repository

```bash
git clone <repository-url>
cd technical-test-fatima
```

Replace `<repository-url>` with the URL you were given.

---

## 4. Set up the backend

### 4.1 Install dependencies

```bash
cd backend
npm install
```

This may take a minute the first time — npm fetches/compiles
`better-sqlite3`.

### 4.2 Initialize the database

The database is a single file (`backend/data.db`) that SQLite will create
automatically. It is git-ignored, so each developer starts with a fresh DB.

Run the migrations:

```bash
npm run db:migrate
```

You should see:

```
Migrations applied ✓
```

> Migrations also run automatically the first time the server starts, so this
> step is technically optional — but running it explicitly is a good way to
> catch problems early.

### 4.3 Seed the database with the JSON quotes

```bash
npm run seed
```

Expected output:

```
✓ <number> quotes inserted
```

This reads every file in [assets/quotes/](assets/quotes/) and loads them into
the `quotes` table. **Without this step the API will return empty results.**

Re-running `npm run seed` is safe: it deletes existing rows before inserting,
so you always end up with a clean dataset.

### 4.4 Start the backend dev server

Still in the `backend/` folder:

```bash
npm run dev
```

You should see:

```
Server started on http://localhost:3000
```

Leave this terminal running.

---

## 5. Set up the frontend

Open a **second terminal** (the backend stays running in the first one).

### 5.1 Install dependencies

```bash
cd frontend
npm install
```

### 5.2 Configure the environment file

The frontend needs to know where the backend lives. Copy the example file:

**macOS / Linux / Git Bash:**

```bash
cp .env.example .env
```

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

The resulting `.env` contains:

```
VITE_API_URL=http://localhost:3000
```

That value is correct for local development — leave it as-is unless your
backend runs somewhere else.

### 5.3 Start the frontend dev server

```bash
npm run dev
```

Vite will print something like:

```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Open <http://localhost:5173> in your browser.

---

## 6. Verify everything works

1. Browse to <http://localhost:5173> — you should see the list of quotes.
2. Try the search bar, the character filter, the sort selector, the order
   toggle and the pagination.
3. Sanity-check the API directly:
   - <http://localhost:3000/quotes> → JSON list of quotes
   - <http://localhost:3000/characters> → JSON list of characters

If all three checks pass, your local environment is ready.

---

## 7. Running the tests

### Backend

```bash
cd backend
npm run test:run     # one-shot
npm run test         # watch mode
```

### Frontend

```bash
cd frontend
npm run test:run     # one-shot
npm run test         # watch mode
```

Both projects use **Vitest**. The frontend additionally uses
`@testing-library/react` with `jsdom`; the backend uses `supertest` for the
HTTP routes.

---

## 8. Building for production (optional)

### Backend

```bash
cd backend
npm run build              # compiles TS into backend/dist/
node dist/index.js         # run the compiled server
```

Make sure you have already run `npm run db:migrate && npm run seed` at least
once so `data.db` exists.

### Frontend

```bash
cd frontend
npm run build              # outputs frontend/dist/
npm run preview            # serves the build locally on a Vite preview port
```

---

## 9. Troubleshooting

| Symptom | Likely cause / fix |
| ------- | ------------------ |
| `EADDRINUSE: address already in use :::3000` | Something else is using port 3000. Stop that process, or change the backend port in [backend/src/index.ts](backend/src/index.ts) (it is currently hardcoded). |
| `EADDRINUSE` on port 5173 | Run the frontend on another port: `npm run dev -- --port 5174`. |
| `npm install` fails on `better-sqlite3` (Windows) | Install Visual Studio Build Tools with the "Desktop development with C++" workload, then retry. |
| Frontend shows "Failed to fetch" / network errors | Backend isn't running, or `VITE_API_URL` in `frontend/.env` doesn't match the backend URL. CORS is already open on the backend, so it is rarely the cause. |
| Frontend loads but shows zero quotes | You forgot `npm run seed` in `backend/`. Run it and refresh the page. |
| You want to start over from a clean DB | Stop the backend, delete `backend/data.db`, then run `npm run db:migrate && npm run seed`. |

---

## 10. Command cheat-sheet

| You want to…                       | Folder      | Command                |
| ---------------------------------- | ----------- | ---------------------- |
| Install backend deps               | `backend/`  | `npm install`          |
| Apply DB migrations                | `backend/`  | `npm run db:migrate`   |
| Load JSON quotes into the DB       | `backend/`  | `npm run seed`         |
| Start backend (dev, hot-reload)    | `backend/`  | `npm run dev`          |
| Build backend for production       | `backend/`  | `npm run build`        |
| Run backend tests once             | `backend/`  | `npm run test:run`     |
| Install frontend deps              | `frontend/` | `npm install`          |
| Create local `.env` (first time)   | `frontend/` | `cp .env.example .env` |
| Start frontend (dev)               | `frontend/` | `npm run dev`          |
| Build frontend for production      | `frontend/` | `npm run build`        |
| Preview production frontend build  | `frontend/` | `npm run preview`      |
| Lint the frontend                  | `frontend/` | `npm run lint`         |
| Run frontend tests once            | `frontend/` | `npm run test:run`     |
