export async function apiFetch(path, options = {}) {
  const base = import.meta.env.VITE_API_URL || '';
  const headers = options.headers || {};
  let res;

  // Try cookie-based auth first
  res = await fetch(base + path, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (res.status !== 401) return res;

  // Fallback to Bearer token
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    res = await fetch(base + path, {
      ...options,
      headers,
    });
  }

  return res;
}