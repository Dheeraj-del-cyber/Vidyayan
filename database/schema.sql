-- Vidyayan database schema (SQLite)
-- This file is executed automatically by backend/config/db.js the first
-- time the server starts, so you never have to run it by hand.

-- native_language / previous_state / current_state / migrated_month /
-- migrated_year are no longer collected at sign-up (registration only asks
-- for name, phone and password), so they're nullable rather than required.
CREATE TABLE IF NOT EXISTS users (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT NOT NULL,
  phone             TEXT NOT NULL UNIQUE,
  password_hash     TEXT NOT NULL,
  native_language   TEXT,
  previous_state    TEXT,
  current_state     TEXT,
  migrated_month    TEXT,
  migrated_year     INTEGER,
  avatar            TEXT,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Speeds up the login lookup (phone number is how users sign in).
CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone);
