import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import WorkflowTimeline from "../workflow/WorkflowTimeline";

export default function LabDashboard() {
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadLabQueue();
  }, []);

  async function loadLabQueue() {
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
    try {
      const res = await apiFetch("/api/lab/complete", {
        method: "POST",
        body: { encounterId },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      loadLabQueue();
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <div className="card premium-card">
      <h2>Lab Queue</h2>
      {msg && <div style={{ color: "red" }}>{msg}</div>}

      {loading ? (
        "Loading…"
      ) : (
        encounters.map((e) => {
          const canComplete =
            e.workflow?.allowedTransitions?.includes("LAB_COMPLETED");

          return (
            <div key={e._id} className="card sub-card">
              <div>
                <strong>{e.patient?.name}</strong>
              </div>

              <button
                disabled={!canComplete}
                onClick={() => completeLab(e._id)}
              >
                Complete Lab
              </button>

              <WorkflowTimeline encounterId={e._id} />
            </div>
          );
        })
      )}
    </div>
  );
}
