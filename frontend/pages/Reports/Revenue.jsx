import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";

export default function RevenueReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    apiFetch("/api/reports/revenue?start=2025-01-01&end=2025-12-31")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="card">
      <h2>Revenue Summary</h2>
      {data.map(r => (
        <div key={r._id}>
          {r._id}: <b>{r.total}</b>
        </div>
      ))}
    </div>
  );
}
