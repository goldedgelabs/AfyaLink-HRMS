import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";


export default function Register({ currentRole, editingStaff }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const API_BASE =
    import.meta.env.VITE_API_URL ||
    "https://afyalink-hrms-4.onrender.com/api";

  // Prefill when editing staff
  useEffect(() => {
    if (editingStaff) {
      setName(editingStaff.name || "");
      setEmail(editingStaff.email || "");
      setRole(editingStaff.role || "patient");
      setPassword("");
    }
  }, [editingStaff]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    try {
      const payload = { name, email, role };
      if (password) payload.password = password;

      // 🔁 UPDATE STAFF
      if (editingStaff) {
        await axios.put(
          `${API_BASE}/auth/users/${editingStaff._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setSuccess("User updated successfully");
        return;
      }

      // 🆕 REGISTER
      const res = await axios.post(
        `${API_BASE}/auth/register`,
        { ...payload, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // Auto-login ONLY for self-registration
      if (res.data?.token && res.data?.user && !currentRole) {
        login(res.data.user, res.data.token);
        navigate("/");
        return;
      }

      setSuccess("Registration successful");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Register error:", error.response || error);
      setErr(error.response?.data?.msg || "Registration failed");
    }
  };

  // Role selection rules
  const roleOptions = () => {
    if (currentRole === "superadmin") return ["hospitaladmin"];
    if (currentRole === "hospitaladmin") return ["doctor", "nurse", "labtech"];
    return ["patient"];
  };

  return (
    <div className="container">
      <div className="card">
        <h2>{editingStaff ? "Edit User" : "Register"}</h2>

        {err && <div className="error">{err}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={submit}>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>
            Password {editingStaff && "(leave blank to keep current)"}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!editingStaff}
          />

          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {roleOptions().map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>

          <button type="submit" className="button">
            {editingStaff ? "Update" : "Register"}
          </button>
        </form>

        {!currentRole && !editingStaff && (
          <p className="link">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")}>Login</button>
          </p>
        )}
      </div>

      <style>{`
        .container {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }
        .card {
          max-width: 420px;
          width: 100%;
          padding: 20px;
          border-radius: 10px;
          background: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        label {
          display: block;
          margin-top: 10px;
          font-weight: 600;
        }
        input, select {
          width: 100%;
          padding: 8px;
          margin-top: 4px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
        .button {
          margin-top: 15px;
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 6px;
          background: #4f46e5;
          color: white;
          font-weight: 700;
          cursor: pointer;
        }
        .error {
          color: #ef4444;
          margin-bottom: 10px;
        }
        .success {
          color: #16a34a;
          margin-bottom: 10px;
        }
        .link {
          margin-top: 12px;
          text-align: center;
        }
        .link button {
          background: none;
          border: none;
          color: #4f46e5;
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
