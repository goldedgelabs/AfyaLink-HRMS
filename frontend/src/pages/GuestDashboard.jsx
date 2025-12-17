import React from "react";
import { useNavigate } from "react-router-dom";

export default function GuestDashboard() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: 40,
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <h1>AfyaLink Demo</h1>

      <p style={{ opacity: 0.8 }}>
        You are exploring AfyaLink in <strong>Demo Mode</strong>.
      </p>

      <div
        style={{
          marginTop: 24,
          padding: 20,
          borderRadius: 8,
          background: "#111",
          color: "#f5c26b",
        }}
      >
        <strong>Read-only experience</strong>
        <p style={{ marginTop: 8 }}>
          You can browse the interface and AI features.
          Creating, editing, payments, and admin actions are disabled.
        </p>
      </div>

      <div style={{ marginTop: 32 }}>
        <button
          onClick={() => navigate("/register")}
          style={{
            padding: "10px 18px",
            borderRadius: 6,
            background: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            marginRight: 12,
          }}
        >
          Unlock Full Access
        </button>

        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 18px",
            borderRadius: 6,
            background: "transparent",
            color: "#000",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
