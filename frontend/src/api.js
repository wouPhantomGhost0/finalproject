const API_URL = 'http://localhost:5000/api';

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
}

export async function signupUser(name, email, password) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Sign up failed');
  }
  return data;
}

export async function fetchUserRooms(user) {
  if (!user) return [];
  const params = new URLSearchParams({
    name: user.name || '',
    email: user.email || '',
  });

  const response = await fetch(`${API_URL}/my-rooms?${params.toString()}`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}