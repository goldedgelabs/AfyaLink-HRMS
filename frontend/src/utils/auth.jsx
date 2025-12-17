import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

/* ======================================================
   API FETCH (JWT + SILENT REFRESH)
====================================================== */
export async function apiFetch(path, options = {}) {
  const base = import.meta.env.VITE_API_URL;
  let token = localStorage.getItem("token");

  let res = await fetch(base + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  // 🔁 Access token expired → try refresh
  if (res.status === 401) {
    const refresh = await fetch(base + "/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refresh.ok) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject("Session expired");
    }

    const data = await refresh.json();
    localStorage.setItem("token", data.token);

    // retry original request
    res = await fetch(base + path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
        ...(options.headers || {}),
      },
      credentials: "include",
    });
  }

  return res;
}

/* ======================================================
   AUTH CONTEXT
====================================================== */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* --------------------------------------------------
     Restore auth on refresh
  -------------------------------------------------- */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.role && parsed?.email) {
          setUser(parsed);
        } else {
          localStorage.clear();
        }
      }
    } catch {
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  /* --------------------------------------------------
     LOGIN (email + password)
  -------------------------------------------------- */
  const login = async (email, password) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      }
    );

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await res.json();

    const safeUser = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    };

    setUser(safeUser);
    localStorage.setItem("user", JSON.stringify(safeUser));
    localStorage.setItem("token", data.token);

    return safeUser;
  };

  /* --------------------------------------------------
     GUEST LOGIN (frontend only)
  -------------------------------------------------- */
  const loginAsGuest = () => {
    const guest = { role: "guest", name: "Demo User" };
    setUser(guest);
  };

  /* --------------------------------------------------
     LOGOUT
  -------------------------------------------------- */
  const logout = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch {
      // ignore
    } finally {
      localStorage.clear();
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        role: user?.role,
        login,
        loginAsGuest,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

/* ======================================================
   HOOK
====================================================== */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
