// Talks to the Vidyayan backend (see /backend). Set VITE_API_URL in a
// .env file inside /frontend if the backend runs somewhere other than
// http://localhost:4000.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch {
    throw new Error('Could not reach the server. Make sure the backend is running.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error((data.errors && data.errors[0]) || 'Something went wrong.');
  }

  return data;
}

export function apiRegister(payload) {
  return request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export function apiLogin(payload) {
  return request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}

export function apiMe(token) {
  return request('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
}
