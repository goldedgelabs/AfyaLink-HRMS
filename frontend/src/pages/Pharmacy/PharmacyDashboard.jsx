import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";

export default function PharmacyDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await apiFetch("/api/pharmacy/dashboard");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading pharmacy dashboard...</p>;

  return (
    <div className="dashboard">
      <h1>💊 Pharmacy Dashboard</h1>

      <div className="grid">
        <Card
          title="Pending Prescriptions"
          value={stats.pendingPrescriptions}
        />
        <Card
          title="Dispensed Today"
          value={stats.dispensedToday}
        />
        <Card
          title="Low Stock Items"
          value={stats.lowStock}
          danger
        />
        <Card
          title="Total Medicines"
          value={stats.totalMedicines}
        />
      </div>

      <div className="actions">
        <Action label="View Prescriptions" to="/pharmacy/prescriptions" />
        <Action label="Dispense Medicine" to="/pharmacy/dispense" />
        <Action label="Inventory" to="/pharmacy/inventory" />
        <Action label="Reports" to="/pharmacy/reports" />
      </div>

      <style>{`
        .dashboard {
          padding: 24px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-top: 24px;
        }
        .actions {
          margin-top: 32px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}

function Card({ title, value, danger }) {
  return (
    <div className={`card ${danger ? "danger" : ""}`}>
      <h3>{title}</h3>
      <strong>{value}</strong>

      <style>{`
        .card {
          background: #fff;
          padding: 20px;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
        }
        .card.danger strong {
          color: #dc2626;
        }
        strong {
          font-size: 28px;
        }
      `}</style>
    </div>
  );
}

function Action({ label, to }) {
  return (
    <a href={to} className="action">
      {label}

      <style>{`
        .action {
          padding: 12px 18px;
          background: #0ea5e9;
          color: white;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
        }
      `}</style>
    </a>
  );
}
