import React from "react";

const COLORS = {
  ENCOUNTER_STARTED: "#3b82f6",
  DIAGNOSED: "#6366f1",
  LAB_ORDERED: "#f59e0b",
  LAB_COMPLETED: "#10b981",
  PRESCRIPTION_CREATED: "#8b5cf6",
  DISPENSED: "#22c55e",
  PAID: "#16a34a",
};

export default function WorkflowBadge({ state }) {
  if (!state) return null;

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        background: COLORS[state] || "#6b7280",
        color: "white",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {state.replaceAll("_", " ")}
    </span>
  );
}
