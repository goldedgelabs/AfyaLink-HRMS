import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        { email }
      );
      setMsg(res.data.msg);
    } catch {
      setMsg("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <form className="auth-card" onSubmit={submit}>
        <h1>Forgot password</h1>

        <label>Email address</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </button>

        {msg && <p style={{ marginTop: 16 }}>{msg}</p>}
      </form>
    </div>
  );
}
