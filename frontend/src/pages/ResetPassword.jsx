import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PasswordInput from "../components/PasswordInput";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        { token, password }
      );

      setMsg("Password reset successful. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setMsg("Reset link expired or invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <form className="auth-card" onSubmit={submit}>
        <h1>Reset password</h1>

        <PasswordInput
          label="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button disabled={loading}>
          {loading ? "Resetting..." : "Reset password"}
        </button>

        {msg && <p style={{ marginTop: 16 }}>{msg}</p>}
      </form>
    </div>
  );
}
