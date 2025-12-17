import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/auth";

export default function Login() {
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  /* ---------------------------------------
   Load remembered email (if any)
  ---------------------------------------- */
  useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  /* ---------------------------------------
   Submit handler
  ---------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (rememberMe) {
        localStorage.setItem("remember_email", email);
      } else {
        localStorage.removeItem("remember_email");
      }

      await login(email, password);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-bg">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>AfyaLink HRMS</h1>
        <p className="subtitle">Sign in to your account</p>

        {error && <div className="error">{error}</div>}

        <label>Email</label>
        <input
          type="email"
          placeholder="admin@afya.test"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Remember + Forgot */}
        <div className="auth-row">
          <label className="remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>

          <Link to="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>
        </div>

        <button disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="auth-footer">
          <span>Don’t have an account?</span>
          <Link to="/register">Create account</Link>
        </div>

        <div className="demo-box">
          <strong>Demo users</strong>
          <ul>
            <li>admin@afya.test / adminpass</li>
            <li>dr.asha@afya.test / docpass</li>
            <li>nurse.john@afya.test / nursepass</li>
            <li>mary@afya.test / patientpass</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
