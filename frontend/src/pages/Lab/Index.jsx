import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";

export default function Lab() {
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLabQueue();
  }, []);

  async function loadLabQueue() {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/lab/queue");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEncounters(data);
    } catch {
      setError("Failed to load lab queue");
    } finally {
      setLoading(false);
    }
  }

  async function completeLab(encounterId) {
    try {
      const res = await apiFetch("/api/lab/complete", {
        method: "POST",
        body: JSON.stringify({ encounterId }),
      });

      if (!res.ok) throw new Error();

      loadLabQueue();
    } catch {
      alert("Lab completion failed");
    }
  }

  return (
    <div className="card premium-card">
      <h2>Lab Queue</h2>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : encounters.length === 0 ? (
        <div>No lab work pending</div>
      ) : (
        <table className="table premium-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Test</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {encounters.map((e) => (
              <tr key={e._id}>
                <td>{e.patient?.name}</td>
                <td>{e.labTest}</td>
                <td>
                  <button
                    className="button gradient-green"
                    onClick={() => completeLab(e._id)}
                  >
                    Complete Lab
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
