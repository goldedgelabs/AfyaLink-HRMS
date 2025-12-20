import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";

/**
 * PHARMACY DASHBOARD — WORKFLOW ENFORCED
 * - Inventory + billing protected
 * - Backend is single source of truth
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
        body: JSON.stringify({
          encounterId,
          prescriptionId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Dispense failed");
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
        <div style={{ color: "red", marginBottom: 12 }}>{msg}</div>
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
            </tr>
          </thead>
          <tbody>
            {queue.map((e) => (
              <tr key={e._id}>
                <td>{e.patient?.name}</td>
                <td>{e.prescriptions?.length || 0}</td>
                <td>{e.state}</td>
                <td>
                  <button
                    className="button gradient-green"
                    disabled={e.state !== "PRESCRIPTION_READY"}
                    onClick={() =>
                      dispense(e._id, e.prescriptions?.[0])
                    }
                  >
                    Dispense
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No prescriptions pending</div>
      )}
    </div>
  );
}
