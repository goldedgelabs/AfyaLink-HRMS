import React, { createContext, useContext, useEffect, useState } from "react";

/* ======================================================
   AUTH CONTEXT
====================================================== */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore auth from localStorage if present
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("token", token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}

/* ======================================================
   API FETCH HELPER (kept from your original file)
====================================================== */

export async function apiFetch(path, options = {}) {
  const base = import.meta.env.VITE_API_URL || "";
  const headers = options.headers || {};
  let res;

  // Try cookie-based auth first
  res = await fetch(base + path, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status !== 401) return res;

  // Fallback to Bearer token
  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    res = await fetch(base + path, {
      ...options,
      headers,
    });
  }

  return res;
}
