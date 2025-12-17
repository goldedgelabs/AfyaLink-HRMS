import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";


export default function Login() {
  const [email, setEmail] = useState("admin@afya.test");
  const [password, setPassword] = useState("adminpass");
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const API_BASE =
    import.meta.env.VITE_API_URL ||
    "https://afyalink-hrms-4.onrender.com/api";

  // 🔁 role → dashboard mapping
  const roleRedirect = (role) => {
    switch (role) {
      case "SuperAdmin":
        return "/superadmin";
      case "HospitalAdmin":
        return "/hospitaladmin";
      case "Doctor":
        return "/doctor";
      case "Nurse":
        return "/ai/medical";
      case "LabTech":
        return "/labtech/labs";
      case "Patient":
      default:
        return "/patient";
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await axios.post(
        `${API_BASE}/auth/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // 🔐 for refresh token cookie
        }
      );

      const { user, accessToken } = res.data;

      if (!user || !accessToken) {
        setErr("Login failed: invalid response");
        return;
      }

      // ✅ save user + token
      login(user, accessToken);

      // ✅ redirect by role
      navigate(roleRedirect(user.role), { replace: true });
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
    </div>
  );
}
