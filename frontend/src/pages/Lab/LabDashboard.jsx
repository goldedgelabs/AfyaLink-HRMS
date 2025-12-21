import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import WorkflowTimeline from "../workflow/WorkflowTimeline";

/**
 * LAB DASHBOARD — WORKFLOW ENFORCED
 * Backend is the single source of truth
 */

export default function LabDashboard() {
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadLabQueue();
  }, []);

  async function loadLabQueue() {
    setLoading(true);
    setMsg("");

    try {
      const res = await apiFetch("/api/encounters?stage=LAB");
      if (!res.ok) throw new Error();

      setEncounters(await res.json());
    } catch {
      setMsg("Failed to load lab queue");
    } finally {
      setLoading(false);
    }
  }

  async function completeLab(encounterId) {
    setMsg("");

    try {
      const res = await apiFetch("/api/lab/complete", {
        method: "POST",
        body: JSON.stringify({ encounterId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Lab completion failed");
      }

      await loadLabQueue();
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <div className="card premium-card">
      <h2>Lab Queue</h2>

      {msg && <div style={{ color: "red", marginBottom: 12 }}>{msg}</div>}

      {loading ? (
        <div>Loading…</div>
      ) : encounters.length ? (
        encounters.map((e) => {
          const canComplete =
            e.workflow?.allowedTransitions?.includes("LAB_COMPLETED");

          return (
            <div key={e._id} className="card sub-card">
              <strong>{e.patient?.name}</strong>

              <button
                disabled={!canComplete}
                onClick={() => completeLab(e._id)}
              >
                Complete Lab
              </button>

              {/* 🔐 Timeline is NEVER hidden */}
              <WorkflowTimeline encounterId={e._id} />
            </div>
          );
        })
      ) : (
        <div>No lab work pending</div>
      )}
    </div>
  );
}
