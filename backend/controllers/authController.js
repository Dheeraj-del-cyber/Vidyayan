import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { validateRegistration, validateLogin, validateProfileUpdate, validatePasswordChange, normalizePhone } from '../utils/validators.js';

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

  const { name, password } = req.body;
  const phone = normalizePhone(req.body.phone);

  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
  if (existing) return res.status(409).json({ errors: ['An account with this phone number already exists.'] });

  const passwordHash = bcrypt.hashSync(password, 10);

  const insert = db.prepare(`
    INSERT INTO users (name, phone, password_hash)
    VALUES (?, ?, ?)
  `);

  const result = insert.run(name.trim(), phone, passwordHash);

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

// Updates the profile screen's editable field (name). The phone number is
// how the person signs in and stays fixed once the account exists, and the
// password is changed separately through changePassword below.
export function updateProfile(req, res) {
  const errors = validateProfileUpdate(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const existing = db.prepare('SELECT id FROM users WHERE id = ?').get(req.userId);
  if (!existing) return res.status(404).json({ errors: ['User not found.'] });

  const { name } = req.body;

  db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name.trim(), req.userId);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  res.json({ user: toPublicUser(user) });
}

// Changes the account password. Requires the current password so a stolen,
// already-open session can't be used to lock the real owner out.
export function changePassword(req, res) {
  const errors = validatePasswordChange(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ errors: ['User not found.'] });

  const { currentPassword, newPassword } = req.body;
  if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
    return res.status(401).json({ errors: ['Your current password is incorrect.'] });
  }

  const passwordHash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, req.userId);

  res.json({ success: true });
}

export { JWT_SECRET };
