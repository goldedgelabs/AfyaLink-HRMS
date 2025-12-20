import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";

export default function PharmacyDashboard() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  async function loadPrescriptions() {
    setLoading(true);
    try {
      const res = await apiFetch("/api/pharmacy/pending");
      if (!res.ok) throw new Error();

      setItems(await res.json());
    } catch {
      setError("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  }

  async function dispense(encounterId, prescriptionId) {
    if (!confirm("Confirm dispense?")) return;

    try {
      const res = await apiFetch("/api/pharmacy/dispense", {
        method: "POST",
        body: JSON.stringify({
          encounterId,
          prescriptionId,
        }),
      });

      if (!res.ok) throw new Error();

      loadPrescriptions();
    } catch {
      alert("Dispense failed — workflow rejected");
    }
  }

  return (
    <div className="card premium-card">
      <h2>Pharmacy</h2>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table premium-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Medication</th>
              <th>Encounter</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((p) => (
                <tr key={p._id}>
                  <td>{p.patient?.name}</td>
                  <td>
                    {p.medications.map((m, i) => (
                      <div key={i}>
                        {m.name} ({m.dosage})
                      </div>
                    ))}
                  </td>
                  <td>{p.encounter}</td>
                  <td>
                    <button
                      className="button gradient-green"
                      onClick={() =>
                        dispense(p.encounter, p._id)
                      }
                    >
                      Dispense
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No pending prescriptions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
