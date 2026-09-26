// Small, dependency-free validation helpers shared by the auth routes.

export function isValidPhone(phone) {
  return typeof phone === 'string' && /^\+?[0-9\s()-]{10,15}$/.test(phone.trim());
}

export function normalizePhone(phone) {
  return phone.trim();
}

export function validateRegistration(body) {
  const errors = [];
  const {
    name, phone, password, confirmPassword,
    nativeLanguage, previousState, currentState,
    migratedMonth, migratedYear,
  } = body || {};

  if (!name || !name.trim()) errors.push('Name is required.');
  if (!phone || !isValidPhone(phone)) errors.push('Enter a valid phone number with at least 10 digits.');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');
  if (password !== confirmPassword) errors.push('Password and re-entered password do not match.');
  if (!nativeLanguage) errors.push('Native language is required.');
  if (!previousState) errors.push('Previous state is required.');
  if (!currentState) errors.push('Current state is required.');
  if (!migratedMonth) errors.push('Migrated month is required.');
  if (!migratedYear || Number.isNaN(Number(migratedYear))) errors.push('Migrated year is required.');

  return errors;
}

// Phone number is deliberately left out: it's how a person signs in, so it
// isn't editable from the profile screen.
export function validateProfileUpdate(body) {
  const errors = [];
  const {
    name, nativeLanguage, previousState, currentState,
    migratedMonth, migratedYear, avatar,
  } = body || {};

  if (!name || !name.trim()) errors.push('Name is required.');
  if (!nativeLanguage) errors.push('Native language is required.');
  if (!previousState) errors.push('Previous state is required.');
  if (!currentState) errors.push('Current state is required.');
  if (!migratedMonth) errors.push('Migrated month is required.');
  if (!migratedYear || Number.isNaN(Number(migratedYear))) errors.push('Migrated year is required.');
  if (avatar && typeof avatar === 'string' && avatar.length > 4_000_000) {
    errors.push('That photo is too large. Try a smaller image.');
  }

  return errors;
}

export function validateLogin(body) {
  const errors = [];
  const { phone, password } = body || {};

  if (!phone || !isValidPhone(phone)) errors.push('Enter a valid phone number.');
  if (!password) errors.push('Password is required.');

  return errors;
}
