// Small, dependency-free validation helpers shared by the auth routes.

export function isValidPhone(phone) {
  return typeof phone === 'string' && /^\+?[0-9\s()-]{10,15}$/.test(phone.trim());
}

export function normalizePhone(phone) {
  return phone.trim();
}

export function validateRegistration(body) {
  const errors = [];
  const { name, phone, password, confirmPassword } = body || {};

  if (!name || !name.trim()) errors.push('Name is required.');
  if (!phone || !isValidPhone(phone)) errors.push('Enter a valid phone number with at least 10 digits.');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');
  if (password !== confirmPassword) errors.push('Password and re-entered password do not match.');

  return errors;
}

// Phone number is deliberately left out: it's how a person signs in, so it
// isn't editable from the profile screen. Password is deliberately left out
// too - there's no change-password flow on the profile screen at all.
export function validateProfileUpdate(body) {
  const errors = [];
  const { name } = body || {};

  if (!name || !name.trim()) errors.push('Name is required.');

  return errors;
}

export function validateLogin(body) {
  const errors = [];
  const { phone, password } = body || {};

  if (!phone || !isValidPhone(phone)) errors.push('Enter a valid phone number.');
  if (!password) errors.push('Password is required.');

  return errors;
}
