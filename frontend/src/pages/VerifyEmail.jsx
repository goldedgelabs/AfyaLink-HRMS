import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("Invalid verification link");
      return;
    }

    fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/verify-email?token=${token}`
    )
      .then((res) => res.json())
      .then(() => setStatus("Email verified successfully! You can now login."))
      .catch(() => setStatus("Verification failed or expired."));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Email Verification</h1>
      <p>{status}</p>
    </div>
  );
}
