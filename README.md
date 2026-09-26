# Vidyayan

A learning-continuity workspace for children of migrant families, with a
real login/register system backed by a database.

## Project structure

```
vidyayan/
├── frontend/    React + Vite app (the UI)
├── backend/     Express API — register, login, translation proxy
└── database/    SQLite schema + the database file itself
```

The frontend never talks to the database directly — it calls the
backend's API, and the backend is the only thing that touches the
database. That's what "frontend / backend / database" means here.

## 1. Set up the database + backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

This starts the API on `http://localhost:4000`. The very first time it
runs, it creates `database/vidyayan.db` automatically using
`database/schema.sql` — you don't need to create it by hand.

## 2. Set up the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

This starts the app on `http://localhost:5173` (Vite's default). Open
that in your browser.

## How login/register works

- **Register** asks for: full name, phone number, password, re-entered
  password (both with a show/hide eye button), native language,
  previous state, current state, and the month + year the family
  migrated.
- **Login** asks for: phone number and password.
- Passwords are hashed with bcrypt before they're stored — the database
  never holds a plain-text password.
- On success, the backend returns a login token (JWT) that the frontend
  stores and sends with future requests, so the person stays signed in
  across page reloads.
- Every page in the app is protected: if you're not signed in, you're
  sent to `/login`.

## Notes

- The translation feature (`Translate a lesson`) still works the same
  way it did before — see the LibreTranslate setup, now proxied through
  `backend/routes/translateRoutes.js` instead of the old `server/`
  folder.
- All the dashboard/curriculum/progress screens still use the mock data
  in `frontend/src/data.js`, exactly as before — only login/register is
  now backed by a real database.
