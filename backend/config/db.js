// Opens the SQLite database that lives in /database, creating it (and its
// tables, from database/schema.sql) the first time the server starts.
//
// Uses Node's built-in "node:sqlite" module (stable in Node 22.5+) instead
// of a third-party native package, so there is nothing to compile — no
// Visual Studio / build tools required, on any OS.

import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATABASE_DIR = path.join(__dirname, '..', '..', 'database');
const DATABASE_FILE = path.join(DATABASE_DIR, 'vidyayan.db');
const SCHEMA_FILE = path.join(DATABASE_DIR, 'schema.sql');

if (!fs.existsSync(DATABASE_DIR)) {
  fs.mkdirSync(DATABASE_DIR, { recursive: true });
}

export const db = new DatabaseSync(DATABASE_FILE);

const schema = fs.readFileSync(SCHEMA_FILE, 'utf-8');
db.exec(schema);

// Databases created before the "avatar" column existed won't have it yet
// (CREATE TABLE IF NOT EXISTS above only runs on a brand-new file), so add
// it here if it's missing.
const columns = db.prepare('PRAGMA table_info(users)').all();
if (!columns.some(column => column.name === 'avatar')) {
  db.exec('ALTER TABLE users ADD COLUMN avatar TEXT');
}

// Registration used to require native_language/previous_state/current_state/
// migrated_month/migrated_year as NOT NULL columns. Registration no longer
// collects them, so any database still carrying that NOT NULL constraint
// needs its users table rebuilt without it - SQLite can't drop a NOT NULL
// constraint with a plain ALTER TABLE.
const migrationColumns = ['native_language', 'previous_state', 'current_state', 'migrated_month', 'migrated_year'];
const needsMigration = columns.some(column => migrationColumns.includes(column.name) && column.notnull);
if (needsMigration) {
  db.exec(`
    BEGIN TRANSACTION;

    CREATE TABLE users_new (
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

    INSERT INTO users_new (id, name, phone, password_hash, native_language, previous_state, current_state, migrated_month, migrated_year, avatar, created_at)
    SELECT id, name, phone, password_hash, native_language, previous_state, current_state, migrated_month, migrated_year, avatar, created_at FROM users;

    DROP TABLE users;
    ALTER TABLE users_new RENAME TO users;

    CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone);

    COMMIT;
  `);
}

export default db;

