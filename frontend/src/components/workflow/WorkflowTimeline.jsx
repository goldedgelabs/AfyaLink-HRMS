import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";

/**
 * WORKFLOW TIMELINE — READ ONLY
 * Doctor / Admin visibility
 */

export default function WorkflowTimeline({ encounterId }) {
  const [events, setEvents] = useState([]);
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
      if (!res.ok) throw new Error();

      setEvents(await res.json());
    } catch {
      setErr("Failed to load workflow timeline");
    } finally {
      setLoading(false);
    }
  }

  if (!encounterId) return null;

  return (
    <div className="card premium-card">
      <h3>Workflow Timeline</h3>

      {loading && <div>Loading timeline…</div>}
      {err && <div style={{ color: "red" }}>{err}</div>}

      {!loading && !events.length && (
        <div>No workflow history available</div>
      )}

      {!loading && events.length > 0 && (
        <ul className="timeline">
          {events.map((e) => (
            <li key={e._id} className="timeline-item">
              <div className="timeline-dot" />

              <div className="timeline-content">
                <strong>{e.state}</strong>

                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  {new Date(e.at).toLocaleString()}
                </div>

                <div style={{ fontSize: 13 }}>
                  By: {e.actor?.name} ({e.actor?.role})
                </div>

                {e.note && (
                  <div className="timeline-note">
                    {e.note}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
