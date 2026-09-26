# Database

Vidyayan uses **SQLite** — a single file on disk, no separate database
server to install or run. This keeps the project simple to set up while
still being a real, persistent database.

## Files

- `schema.sql` — the table definitions. The backend runs this
  automatically every time it starts (`CREATE TABLE IF NOT EXISTS`, so
  it's always safe to re-run and never deletes data).
- `vidyayan.db` — the actual database file. It is created automatically
  the first time you start the backend, so it is not included in this
  zip. It will appear here after you run `npm run dev` inside `backend/`.

## `users` table

| Column            | Type     | Notes                                   |
|-------------------|----------|------------------------------------------|
| id                | INTEGER  | Primary key, auto-increment              |
| name              | TEXT     | Full name entered at registration        |
| phone             | TEXT     | Unique — this is the login identifier    |
| password_hash     | TEXT     | Password, hashed with bcrypt (never stored in plain text) |
| native_language   | TEXT     | e.g. Kannada, Hindi, Marathi              |
| previous_state    | TEXT     | State the person migrated from            |
| current_state     | TEXT     | State the person currently lives in       |
| migrated_month    | TEXT     | Month of migration, e.g. "June"           |
| migrated_year     | INTEGER  | Year of migration, e.g. 2026              |
| created_at        | DATETIME | Set automatically when the row is created |

## Inspecting the database

Once the backend has run at least once, you can open `vidyayan.db` with
any SQLite browser (e.g. [DB Browser for SQLite](https://sqlitebrowser.org/))
or from a terminal:

```bash
sqlite3 database/vidyayan.db "SELECT id, name, phone, current_state FROM users;"
```
