
import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { const u = localStorage.getItem('user'); return u ? JSON.parse(u) : null; } catch { return null; }
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken') || null);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  }, [user]);
  useEffect(() => {
    if (accessToken) localStorage.setItem('accessToken', accessToken); else localStorage.removeItem('accessToken');
  }, [accessToken]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ msg: 'Login failed' }));
      throw new Error(err.msg || 'Login failed');
    }
    const data = await res.json();
    setUser(data.user);
    setAccessToken(data.accessToken);
    return data;
  };

  const register = async (payload) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({msg:'Register failed'}));
      throw new Error(err.msg || 'Register failed');
    }
    const data = await res.json();
    return data;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', headers: {'Content-Type':'application/json'} });
    } catch (e) {}
    setUser(null); setAccessToken(null);
    localStorage.removeItem('user'); localStorage.removeItem('accessToken');
  };

  // automatic refresh - try to get a new access token using cookie-based refresh
  const refresh = async () => {
    try {
      const res = await fetch('/api/auth/refresh', { method: 'POST', headers: {'Content-Type':'application/json'} });
      if (!res.ok) return null;
      const data = await res.json();
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (e) {
      return null;
    }
  };

  const value = { user, login, logout, register, accessToken, setAccessToken, refresh };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
