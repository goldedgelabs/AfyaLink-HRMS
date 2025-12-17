export async function apiFetch(path, options = {}) {
  const base = import.meta.env.VITE_API_URL;

  let token = localStorage.getItem("token");

  let res = await fetch(`${base}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  // 🔁 Silent refresh
  if (res.status === 401) {
    const refresh = await fetch(`${base}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refresh.ok) {
      const data = await refresh.json();
      localStorage.setItem("token", data.accessToken);
      return apiFetch(path, options);
    }
  }

  return res;
}
