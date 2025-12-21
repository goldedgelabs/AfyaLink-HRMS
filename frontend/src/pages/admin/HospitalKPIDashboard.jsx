import React, { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import { useAuth } from "../../utils/auth";

export default function HospitalKPIDashboard() {
  const { user } = useAuth();

  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "admin") {
      loadKPIs();
    }
  }, [user]);

  async function loadKPIs() {
    try {
      const res = await apiFetch("/api/kpis/hospital");
      if (!res.ok) throw new Error();
      setKpis(await res.json());
    } catch {
      setError("Failed to load hospital KPIs");
    } finally {
      setLoading(false);
    }
  }

  if (!user) return <div>Please log in</div>;
  if (user.role !== "admin") return <div>Access denied</div>;
  if (loading) return <div>Loading KPIs…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!kpis) return null;

  return (
    <div className="card premium-card">
      <h2>🏥 Hospital KPI Dashboard</h2>

      {/* =============================
          ENCOUNTERS
      ============================== */}
      <section className="kpi-section">
        <h3>Encounters</h3>
        <div className="kpi-grid">
          <Kpi label="Total" value={kpis.encounters.total} />
          <Kpi label="Active" value={kpis.encounters.active} />
          <Kpi label="Completed" value={kpis.encounters.completed} />
        </div>
      </section>

      {/* =============================
          INSURANCE — SHA
      ============================== */}
      <section className="kpi-section">
        <h3>Insurance ({kpis.insurance.provider})</h3>
        <div className="kpi-grid">
          <Kpi label="Pending" value={kpis.insurance.pending} />
          <Kpi label="Approved" value={kpis.insurance.approved} />
          <Kpi label="Rejected" value={kpis.insurance.rejected} />
        </div>
      </section>

      {/* =============================
          CLINICAL FLOW
      ============================== */}
      <section className="kpi-section">
        <h3>Clinical Flow</h3>
        <div className="kpi-grid">
          <Kpi label="Lab Pending" value={kpis.flow.labPending} />
          <Kpi label="Pharmacy Pending" value={kpis.flow.pharmacyPending} />
        </div>
      </section>

      {/* =============================
          BILLING
      ============================== */}
      <section className="kpi-section">
        <h3>Billing</h3>
        <div className="kpi-grid">
          <Kpi
            label="Total Revenue"
            value={`KES ${kpis.billing.totalRevenue.toLocaleString()}`}
          />
          <Kpi label="Pending Payments" value={kpis.billing.pendingPayments} />
        </div>
      </section>
    </div>
  );
}

/* ===============================
   SMALL KPI CARD
=============================== */
function Kpi({ label, value }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
    </div>
  );
}
