import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch";
import { useAuth } from "../utils/auth";

export default function TwoFactor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { complete2FA } = useAuth();

  const userId = location.state?.userId;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!userId) {
    navigate("/login");
    return null;
  }

  const submitOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/api/auth/verify-2fa", {
        method: "POST",
        body: JSON.stringify({ userId, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Invalid code");
      }

      // 🔓 Unlock session
      complete2FA(data.accessToken);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>🔐 Two-Factor Authentication</h2>
      <p>Enter the 6-digit code sent to your email</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={submitOtp}>
        <input
          type="text"
          maxLength="6"
          placeholder="123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <style>{`
        .auth-card {
          max-width: 400px;
          margin: 80px auto;
          padding: 32px;
          border-radius: 16px;
          background: white;
          text-align: center;
        }
        input {
          width: 100%;
          padding: 12px;
          margin: 16px 0;
          font-size: 18px;
          text-align: center;
          letter-spacing: 6px;
        }
        button {
          width: 100%;
          padding: 12px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
        }
        .error {
          color: red;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
