-- Vidyayan database schema (SQLite)
-- This file is executed automatically by backend/config/db.js the first
-- time the server starts, so you never have to run it by hand.

CREATE TABLE IF NOT EXISTS users (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT NOT NULL,
  phone             TEXT NOT NULL UNIQUE,
  password_hash     TEXT NOT NULL,
  native_language   TEXT NOT NULL,
  previous_state    TEXT NOT NULL,
  current_state     TEXT NOT NULL,
  migrated_month    TEXT NOT NULL,
  migrated_year     INTEGER NOT NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Speeds up the login lookup (phone number is how users sign in).
CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone);
