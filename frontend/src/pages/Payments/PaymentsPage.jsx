import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import { useAuth } from "../../utils/auth";

/**
 * Payments Page (WORKFLOW ENFORCED)
 * - Stripe + M-Pesa
 * - No double payment
 * - Backend is authority
 */

export default function PaymentsPage() {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user) loadTransactions();
  }, [user]);

  async function loadTransactions() {
    try {
      const res = await apiFetch("/api/billing/transactions");
      if (!res.ok) throw new Error();
      setTransactions(await res.json());
    } catch {
      setMsg("Failed to load transactions");
    }
  }

  /* ===============================
     STRIPE — CREATE INTENT ONLY
  =============================== */
  async function payStripe(tx) {
    if (tx.status === "success") {
      setMsg("Payment already completed");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await apiFetch(
        "/payments/stripe/create-payment-intent",
        {
          method: "POST",
          body: JSON.stringify({
            amount: tx.amount,
            transactionId: tx._id, // 🔒 bind to transaction
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Stripe failed");

      setMsg(
        "Stripe Payment Intent created.\nClient Secret:\n" +
          data.clientSecret
      );
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     M-PESA — STK PUSH ONLY
  =============================== */
  async function payMpesa(tx) {
    if (!tx.phone) {
      setMsg("Missing phone number on transaction");
      return;
    }

    if (tx.status === "success") {
      setMsg("Payment already completed");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await apiFetch("/payments/mpesa/stk", {
        method: "POST",
        body: JSON.stringify({
          amount: tx.amount,
          phone: tx.phone,
          transactionId: tx._id, // 🔒 bind to transaction
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "M-Pesa failed");

      setMsg("M-Pesa STK Push sent. Await confirmation.");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return <div>Please log in</div>;

  /* ===============================
     UI
  =============================== */
  return (
    <div className="card premium-card">
      <h2>Payments</h2>

      {msg && (
        <pre
          style={{
            background: "#f3f4f6",
            padding: 12,
            whiteSpace: "pre-wrap",
          }}
        >
          {msg}
        </pre>
      )}

      <table className="table premium-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length ? (
            transactions.map((tx) => (
              <tr key={tx._id}>
                <td>{tx.patient?.name || "—"}</td>
                <td>{tx.amount} {tx.currency}</td>
                <td>
                  <strong
                    style={{
                      color:
                        tx.status === "success"
                          ? "green"
                          : tx.status === "failed"
                          ? "red"
                          : "orange",
                    }}
                  >
                    {tx.status.toUpperCase()}
                  </strong>
                </td>
                <td>
                  <button
                    disabled={loading || tx.status === "success"}
                    onClick={() => payStripe(tx)}
                  >
                    Stripe
                  </button>

                  <button
                    disabled={loading || tx.status === "success"}
                    onClick={() => payMpesa(tx)}
                    style={{ marginLeft: 8 }}
                  >
                    M-Pesa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No pending payments
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
