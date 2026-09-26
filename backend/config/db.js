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

export default db;

