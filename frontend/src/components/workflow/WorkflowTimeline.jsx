import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";

/**
 * WORKFLOW TIMELINE — READ ONLY (VISUAL ENHANCED)
 * Backend is the single source of truth
 */

/* =========================================
   STATE → VISUAL CONFIG
========================================= */
const STATE_META = {
  // Doctor
  TRIAGED: { color: "#2563eb", label: "Triage" },
  DIAGNOSED: { color: "#2563eb", label: "Diagnosis" },

  // Insurance (SHA)
  SHA_PENDING: { color: "#f59e0b", label: "SHA Pending" },
  SHA_APPROVED: { color: "#16a34a", label: "SHA Approved" },
  SHA_REJECTED: { color: "#dc2626", label: "SHA Rejected" },

  // Lab
  LAB_PENDING: { color: "#7c3aed", label: "Lab Pending" },
  LAB_COMPLETED: { color: "#7c3aed", label: "Lab Completed" },

  // Pharmacy
  PRESCRIPTION_READY: { color: "#0891b2", label: "Rx Ready" },
  DISPENSED: { color: "#0891b2", label: "Dispensed" },

  // Billing
  PAYMENT_PENDING: { color: "#f59e0b", label: "Payment Pending" },
  PAID: { color: "#16a34a", label: "Paid" },

  // Terminal
  COMPLETED: { color: "#16a34a", label: "Completed" },
  CANCELLED: { color: "#6b7280", label: "Cancelled" },
};

/* =========================================
   BADGE COMPONENT
========================================= */
function StateBadge({ state }) {
  const meta = STATE_META[state] || {
    color: "#6b7280",
    label: state,
  };

  return (
    <span
      style={{
        background: meta.color,
        color: "white",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        marginRight: 6,
        display: "inline-block",
      }}
    >
      {meta.label}
    </span>
  );
}

export default function WorkflowTimeline({ encounterId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!encounterId) return;
    loadTimeline();
  }, [encounterId]);

  async function loadTimeline() {
    setLoading(true);
    setErr("");

    try {
      const res = await apiFetch(
        `/api/workflows/${encounterId}/timeline`
      );
      if (!res.ok) throw new Error("Failed to load workflow");

      setData(await res.json());
    } catch (e) {
      setErr(e.message || "Failed to load workflow timeline");
    } finally {
      setLoading(false);
    }
  }

  if (!encounterId) return null;

  if (loading) {
    return <div className="card">Loading workflow…</div>;
  }

  if (err) {
    return (
      <div className="card" style={{ color: "red" }}>
        {err}
      </div>
    );
  }

  const { workflow, audit } = data;

  return (
    <div className="card premium-card">
      <h3 style={{ marginBottom: 12 }}>Workflow Timeline</h3>

      {/* ================= CURRENT STATE ================= */}
      <div style={{ marginBottom: 16 }}>
        <strong>Current State:</strong>{" "}
        <StateBadge state={workflow.state} />
      </div>

      {/* ================= ALLOWED ACTIONS ================= */}
      <div style={{ marginBottom: 20 }}>
        <strong>Allowed Actions:</strong>
        <div style={{ marginTop: 8 }}>
          {workflow.allowedTransitions.length === 0 ? (
            <em style={{ opacity: 0.7 }}>No actions allowed</em>
          ) : (
            workflow.allowedTransitions.map((a) => (
              <StateBadge key={a} state={a} />
            ))
          )}
        </div>
      </div>

      {/* ================= WORKFLOW HISTORY ================= */}
      <h4>Clinical Progress</h4>

      {workflow.history.length === 0 ? (
        <em>No workflow transitions recorded.</em>
      ) : (
        <ul className="timeline">
          {workflow.history.map((h, idx) => (
            <li
              key={idx}
              className="timeline-item"
              style={{ marginBottom: 12 }}
            >
              <StateBadge state={h.state} />
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                {new Date(h.at).toLocaleString()}
              </div>
              <div style={{ fontSize: 13 }}>
                By: {h.by || "system"}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ================= AUDIT LOG ================= */}
      {audit?.length > 0 && (
        <>
          <h4 style={{ marginTop: 24 }}>Audit Trail</h4>
          <ul className="timeline audit">
            {audit.map((a) => (
              <li
                key={a.id}
                className="timeline-item"
                style={{ marginBottom: 12 }}
              >
                <strong>{a.action}</strong>
                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  {new Date(a.at).toLocaleString()}
                </div>
                <div style={{ fontSize: 13 }}>
                  Role: {a.actorRole}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
