import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";

/**
 * WORKFLOW TIMELINE — READ ONLY
 * Backend is the source of truth
 */
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
      <h3>Workflow Timeline</h3>

      {/* ================= CURRENT STATE ================= */}
      <div style={{ marginBottom: 12 }}>
        <strong>Current State:</strong>{" "}
        <span className="badge">{workflow.state}</span>
      </div>

      {/* ================= ALLOWED ACTIONS ================= */}
      <div style={{ marginBottom: 16 }}>
        <strong>Allowed Actions:</strong>
        <div style={{ marginTop: 6 }}>
          {workflow.allowedTransitions.length === 0 ? (
            <em>None</em>
          ) : (
            workflow.allowedTransitions.map((a) => (
              <span
                key={a}
                className="badge badge-secondary"
                style={{ marginRight: 6 }}
              >
                {a}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ================= WORKFLOW HISTORY ================= */}
      <h4>Workflow History</h4>

      {workflow.history.length === 0 ? (
        <em>No workflow transitions recorded.</em>
      ) : (
        <ul className="timeline">
          {workflow.history.map((h, idx) => (
            <li key={idx} className="timeline-item">
              <strong>{h.state}</strong>
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
          <h4 style={{ marginTop: 20 }}>Audit Trail</h4>
          <ul className="timeline audit">
            {audit.map((a) => (
              <li key={a.id} className="timeline-item">
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
