import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { validateRegistration, validateLogin, validateProfileUpdate, normalizePhone } from '../utils/validators.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function toPublicUser(row) {
  if (!row) return null;
  const { password_hash, ...publicUser } = row;
  return publicUser;
}

function issueToken(user) {
  return jwt.sign({ sub: user.id, phone: user.phone }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function register(req, res) {
  const errors = validateRegistration(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const {
    name, password, nativeLanguage, previousState,
    currentState, migratedMonth, migratedYear,
  } = req.body;
  const phone = normalizePhone(req.body.phone);

  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
  if (existing) return res.status(409).json({ errors: ['An account with this phone number already exists.'] });

  const passwordHash = bcrypt.hashSync(password, 10);

  const insert = db.prepare(`
    INSERT INTO users (name, phone, password_hash, native_language, previous_state, current_state, migrated_month, migrated_year)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    name.trim(),
    phone,
    passwordHash,
    nativeLanguage,
    previousState,
    currentState,
    migratedMonth,
    Number(migratedYear),
  );

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  const token = issueToken(user);

  res.status(201).json({ token, user: toPublicUser(user) });
}

export function login(req, res) {
  const errors = validateLogin(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const phone = normalizePhone(req.body.phone);
  const { password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ errors: ['Incorrect phone number or password.'] });
  }

  const token = issueToken(user);
  res.json({ token, user: toPublicUser(user) });
}

export function me(req, res) {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ errors: ['User not found.'] });
  res.json({ user: toPublicUser(user) });
}

// Updates everything on the profile screen except the phone number, which
// is how the person signs in and stays fixed once the account exists.
export function updateProfile(req, res) {
  const errors = validateProfileUpdate(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const existing = db.prepare('SELECT id FROM users WHERE id = ?').get(req.userId);
  if (!existing) return res.status(404).json({ errors: ['User not found.'] });

  const {
    name, nativeLanguage, previousState,
    currentState, migratedMonth, migratedYear, avatar,
  } = req.body;

  db.prepare(`
    UPDATE users
    SET name = ?, native_language = ?, previous_state = ?, current_state = ?,
        migrated_month = ?, migrated_year = ?, avatar = ?
    WHERE id = ?
  `).run(
    name.trim(),
    nativeLanguage,
    previousState,
    currentState,
    migratedMonth,
    Number(migratedYear),
    avatar || null,
    req.userId,
  );

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  res.json({ user: toPublicUser(user) });
}

export { JWT_SECRET };
