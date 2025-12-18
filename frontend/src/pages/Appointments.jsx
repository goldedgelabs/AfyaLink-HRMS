import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/auth";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    date: "",
    reason: "",
  });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setErr("");
    try {
      const [aRes, pRes, uRes] = await Promise.all([
        apiFetch("/api/appointments"),
        apiFetch("/api/patients"),
        apiFetch("/api/auth/users"),
      ]);

      if (!aRes.ok || !pRes.ok || !uRes.ok) {
        throw new Error();
      }

      const appointmentsData = await aRes.json();
      const patientsData = await pRes.json();
      const usersData = await uRes.json();

      setAppointments(appointmentsData);
      setPatients(patientsData);
      setDoctors(usersData.filter((u) => u.role === "doctor"));
    } catch {
      setErr("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = editing
        ? await apiFetch(`/api/appointments/${editing}`, {
            method: "PUT",
            body: JSON.stringify(form),
          })
        : await apiFetch("/api/appointments", {
            method: "POST",
            body: JSON.stringify(form),
          });

      if (!res.ok) throw new Error();

      setForm({ patient: "", doctor: "", date: "", reason: "" });
      setEditing(null);
      loadAll();
    } catch {
      setErr("Failed to save appointment");
    }
  };

  const startEdit = (a) => {
    setEditing(a._id);
    setForm({
      patient: a.patient?._id || "",
      doctor: a.doctor?._id || "",
      date: a.date?.substring(0, 16) || "",
      reason: a.reason || "",
    });
  };

  return (
    <div className="card premium-card">
      <h2>Appointments</h2>

      {err && <div style={{ color: "red", marginBottom: 12 }}>{err}</div>}

      {/* ===== FORM ===== */}
      <form onSubmit={submit} className="card appointment-form">
        <h3>{editing ? "Update Appointment" : "Create Appointment"}</h3>

        <label>Patient</label>
        <select
          value={form.patient}
          onChange={(e) => setForm({ ...form, patient: e.target.value })}
          required
        >
          <option value="">-- Select Patient --</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <label>Doctor</label>
        <select
          value={form.doctor}
          onChange={(e) => setForm({ ...form, doctor: e.target.value })}
          required
        >
          <option value="">-- Select Doctor --</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

        <label>Date & Time</label>
        <input
          type="datetime-local"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />

        <label>Reason</label>
        <input
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          required
        />

        <div className="form-buttons">
          <button className="button gradient-blue" type="submit">
            {editing ? "Update" : "Create"}
          </button>

          {editing && (
            <button
              className="button cancel-btn"
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({
                  patient: "",
                  doctor: "",
                  date: "",
                  reason: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ===== LIST ===== */}
      {loading ? (
        <div className="premium-card" style={{ textAlign: "center" }}>
          Loading...
        </div>
      ) : (
        <table className="table premium-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((a) => (
                <tr key={a._id}>
                  <td>{a.patient?.name}</td>
                  <td>{a.doctor?.name}</td>
                  <td>{new Date(a.date).toLocaleString()}</td>
                  <td>{a.reason}</td>
                  <td>
                    <button
                      className="button gradient-purple"
                      onClick={() => startEdit(a)}
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
