import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("admin@afya.test");
  const [password, setPassword] = useState("adminpass");
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const API_BASE =
    import.meta.env.VITE_API_URL ||
    "https://afyalink-hrms-4.onrender.com/api";

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await axios.post(
        `${API_BASE}/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data?.token && res.data?.user) {
        // Save auth in context + localStorage
        login(res.data.user, res.data.token);

        // Redirect based on role (optional logic)
        navigate("/");
      } else {
        setErr("Login failed: invalid response");
      }
    } catch (error) {
      console.error("Login error:", error.response || error);
      setErr(error.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to AfyaLink HRMS</h2>

        {err && <div className="error-msg">{err}</div>}

        <form onSubmit={submit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="demo-users">
          Demo users:<br />
          admin@afya.test (adminpass)<br />
          dr.asha@afya.test (docpass)<br />
          nurse.john@afya.test (nursepass)<br />
          mary@afya.test (patientpass)
        </p>
      </div>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .login-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(12px);
          padding: 32px 24px;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          width: 100%;
          max-width: 420px;
        }

        .login-card h2 {
          text-align: center;
          font-size: 28px;
          margin-bottom: 24px;
          font-weight: 700;
          background: linear-gradient(90deg, #4f46e5, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        label {
          display: block;
          margin-top: 12px;
          margin-bottom: 6px;
          font-weight: 600;
        }

        input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .login-btn {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          color: white;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
        }

        .error-msg {
          color: #ef4444;
          margin-bottom: 12px;
          font-weight: 600;
          text-align: center;
        }

        .demo-users {
          margin-top: 16px;
          font-size: 12px;
          color: #555;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
