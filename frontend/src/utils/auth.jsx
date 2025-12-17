import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ======================================================
   ROLE → DEFAULT ROUTE MAP
====================================================== */
const ROLE_HOME = {
  SuperAdmin: "/superadmin",
  HospitalAdmin: "/hospitaladmin",
  Doctor: "/doctor",
  Nurse: "/ai/medical",
  LabTech: "/lab",
  Pharmacist: "/pharmacy",
  Patient: "/patient",
};

/* ======================================================
   AUTH CONTEXT
====================================================== */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* --------------------------------------------------
     Restore auth on refresh
  -------------------------------------------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  /* --------------------------------------------------
     LOGIN (with auto-redirect by role)
  -------------------------------------------------- */
  const login = (userData, token) => {
    if (!userData || !userData.role) {
      console.error("Invalid user data on login");
      return;
    }

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    const target = ROLE_HOME[userData.role] || "/";
    navigate(target, { replace: true });
  };

  /* --------------------------------------------------
     LOGOUT
  -------------------------------------------------- */
  const logout = () => {
    setUser(null);
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        role: user?.role,
        login,
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

/* ======================================================
   API FETCH HELPER (JWT-aware)
====================================================== */
export async function apiFetch(path, options = {}) {
  const base = import.meta.env.VITE_API_URL || "";
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(base + path, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
  }

  return res;
}
