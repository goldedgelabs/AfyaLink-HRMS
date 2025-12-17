import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

/* ======================================================
   AUTH CONTEXT
====================================================== */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* --------------------------------------------------
     Restore auth on refresh (SAFE)
  -------------------------------------------------- */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  /* --------------------------------------------------
     LOGIN
  -------------------------------------------------- */
  const login = (userData, accessToken) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);
  };

  /* --------------------------------------------------
     GUEST LOGIN (FRONTEND ONLY)
  -------------------------------------------------- */
  const loginAsGuest = () => {
    setUser({
      role: "guest",
      name: "Demo User",
    });
  };

  /* --------------------------------------------------
     LOGOUT (INFORM BACKEND)
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
      // ignore network errors
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
        isAuthenticated: !!user,
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
