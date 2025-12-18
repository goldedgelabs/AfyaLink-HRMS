import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiFetch, logout as apiLogout } from "./apiFetch";

/* ======================================================
   JWT PARSER (2FA FLAG)
====================================================== */
function parseJwt(token) {
  try {
    const base64 = token.split(".")[1];
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

/* ======================================================
   AUTH CONTEXT
====================================================== */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* --------------------------------------------------
     Restore session on reload (WITH 2FA STATE)
  -------------------------------------------------- */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        const decoded = parseJwt(token);

        setUser({
          ...parsedUser,
          twoFactorVerified: decoded?.twoFactor !== false,
        });
      }
    } catch {
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  /* --------------------------------------------------
     LOGIN
     (normal + 2FA-required users)
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

    // 🔐 2FA REQUIRED → stop here
    if (data.requires2FA) {
      localStorage.setItem("2fa_pending", "true");
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

    const decoded = parseJwt(data.accessToken);

    setUser({
      ...safeUser,
      twoFactorVerified: decoded?.twoFactor !== false,
    });

    return { user: safeUser };
  };

  /* --------------------------------------------------
     COMPLETE 2FA (after OTP verify)
     🔓 Unlocks dashboard automatically
  -------------------------------------------------- */
  const complete2FA = (accessToken) => {
    localStorage.setItem("token", accessToken);
    localStorage.removeItem("2fa_pending");

    const storedUser = localStorage.getItem("user");
    const decoded = parseJwt(accessToken);

    if (storedUser) {
      setUser({
        ...JSON.parse(storedUser),
        twoFactorVerified: decoded?.twoFactor !== false,
      });
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
      apiLogout();
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
