import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiFetch, logout as apiLogout } from "./apiFetch";

/* ======================================================
   AUTH CONTEXT
====================================================== */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* --------------------------------------------------
     Restore session on reload
  -------------------------------------------------- */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.id && parsed?.role) {
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
     LOGIN
     (handles both normal + 2FA-required users)
  -------------------------------------------------- */
  const login = async (email, password) => {
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.msg || "Login failed");
    }

    // 🔐 2FA REQUIRED → frontend will redirect
    if (data.requires2FA) {
      return { requires2FA: true };
    }

    // ✅ Normal login
    const safeUser = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    };

    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("user", JSON.stringify(safeUser));
    setUser(safeUser);

    return { user: safeUser };
  };

  /* --------------------------------------------------
     COMPLETE 2FA (after OTP verification)
  -------------------------------------------------- */
  const complete2FA = (accessToken) => {
    localStorage.setItem("token", accessToken);

    // user already exists from initial login
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  /* --------------------------------------------------
     LOGOUT
  -------------------------------------------------- */
  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } finally {
      localStorage.clear();
      setUser(null);
      apiLogout(); // safe redirect helper
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
        complete2FA,
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
