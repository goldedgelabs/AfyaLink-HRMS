import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import WorkflowTimeline from "../workflow/WorkflowTimeline";

export default function PharmacyDashboard() {
  const [queue, setQueue] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadQueue();
  }, []);

  async function loadQueue() {
    const res = await apiFetch("/api/encounters?stage=PHARMACY");
    setQueue(await res.json());
  }

  async function dispense(encounterId, prescriptionId) {
    try {
      const res = await apiFetch("/api/pharmacy/dispense", {
        method: "POST",
        body: { encounterId, prescriptionId },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      loadQueue();
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <div className="card premium-card">
      <h2>Pharmacy Queue</h2>
      {msg && <div style={{ color: "red" }}>{msg}</div>}

      {queue.map((e) => {
        const canDispense =
          e.workflow?.allowedTransitions?.includes("DISPENSED");

        return (
          <div key={e._id} className="card sub-card">
            <strong>{e.patient?.name}</strong>

            <button
              disabled={!canDispense}
              onClick={() =>
                dispense(e._id, e.prescriptions?.[0])
              }
            >
              Dispense
            </button>

            <WorkflowTimeline encounterId={e._id} />
          </div>
        );
      })}
    </div>
  );
}
