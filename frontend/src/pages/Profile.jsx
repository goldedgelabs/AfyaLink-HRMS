import { useEffect, useState } from "react";
import { apiFetch } from "../utils/apiFetch";

export default function Profile() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    const res = await apiFetch("/api/2fa/status");
    const data = await res.json();
    setEnabled(data.enabled);
    setLoading(false);
  };

  const toggle2FA = async () => {
    const next = !enabled;
    await apiFetch("/api/2fa/toggle", {
      method: "POST",
      body: JSON.stringify({ enabled: next }),
    });
    setEnabled(next);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="premium-card">
      <h2>🔐 Security Settings</h2>

      <div className="row">
        <span>Email OTP (2FA)</span>
        <button
          className={enabled ? "danger" : "success"}
          onClick={toggle2FA}
        >
          {enabled ? "Disable" : "Enable"}
        </button>
      </div>

      <p style={{ opacity: 0.7, marginTop: 8 }}>
        {enabled
          ? "2FA is enabled. You’ll be asked for a code at login."
          : "2FA is disabled. Your account uses password only."}
      </p>

      <style>{`
        .premium-card {
          background:#fff;
          padding:24px;
          border-radius:16px;
          max-width:420px;
        }
        .row {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-top:16px;
        }
        button {
          padding:8px 16px;
          border:none;
          border-radius:8px;
          font-weight:600;
          cursor:pointer;
        }
        .success { background:#22c55e; color:white }
        .danger { background:#ef4444; color:white }
      `}</style>
    </div>
  );
}
