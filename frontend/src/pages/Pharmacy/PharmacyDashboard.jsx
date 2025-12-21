import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import WorkflowTimeline from "../../components/workflow/WorkflowTimeline";

/**
 * PHARMACY DASHBOARD — HARD WORKFLOW + INSURANCE ENFORCED
 * Backend is the single source of truth
 */

export default function PharmacyDashboard() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadQueue();
  }, []);

  async function loadQueue() {
    setLoading(true);
    setMsg("");

    try {
      const res = await apiFetch("/api/encounters?stage=PHARMACY");
      if (!res.ok) throw new Error();

      setQueue(await res.json());
    } catch {
      setMsg("Failed to load pharmacy queue");
    } finally {
      setLoading(false);
    }
  }

  async function dispense(encounterId, prescriptionId) {
    setMsg("");

    try {
      const res = await apiFetch("/api/pharmacy/dispense", {
        method: "POST",
        body: {
          encounterId,
          prescriptionId,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Dispense failed");
      }

      await loadQueue();
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div className="card premium-card">
      <h2>Pharmacy Queue</h2>

      {msg && (
        <div style={{ color: "red", marginBottom: 12 }}>
          {msg}
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : queue.length ? (
        <table className="table premium-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Medications</th>
              <th>Status</th>
              <th>Action</th>
              <th>Workflow</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((e) => {
              const canDispense =
                e.workflow?.allowedTransitions?.includes("DISPENSED");

              const insuranceApproved =
                e.insurance?.status === "APPROVED";

              const prescriptionId =
                e.prescriptions?.[0]?._id || e.prescriptions?.[0];

              return (
                <tr key={e._id}>
                  <td>
                    {e.patient?.name}

                    {/* 🔴 INSURANCE BADGE */}
                    {!insuranceApproved && (
                      <span
                        style={{
                          color: "red",
                          fontSize: 12,
                          marginLeft: 8,
                          fontWeight: "bold",
                        }}
                      >
                        Insurance Pending
                      </span>
                    )}
                  </td>

                  <td>{e.prescriptions?.length || 0}</td>

                  <td>{e.workflow?.state}</td>

                  <td>
                    <button
                      className="button gradient-green"
                      disabled={!canDispense || !insuranceApproved}
                      title={
                        !insuranceApproved
                          ? "Insurance authorization required"
                          : !canDispense
                          ? "Workflow does not allow dispensing"
                          : ""
                      }
                      onClick={() =>
                        dispense(e._id, prescriptionId)
                      }
                    >
                      Dispense
                    </button>
                  </td>

                  <td style={{ minWidth: 280 }}>
                    <WorkflowTimeline encounterId={e._id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div>No prescriptions pending</div>
      )}
    </div>
  );
}
