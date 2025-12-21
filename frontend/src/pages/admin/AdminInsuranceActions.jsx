import React, { useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import WorkflowTimeline from "../../components/workflow/WorkflowTimeline";

/**
 * ADMIN INSURANCE ACTIONS
 * 🔒 Admin only
 * 🧾 Justification required
 * 🔁 Workflow authoritative
 */
export default function AdminInsuranceActions({ encounter }) {
  const [justification, setJustification] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  if (!encounter?.workflow) return null;

  const allowed =
    encounter.workflow.allowedTransitions || [];

  const canApprove = allowed.includes("INSURANCE_APPROVED");
  const canReject = allowed.includes("INSURANCE_REJECTED");

  async function approve() {
    if (!justification.trim()) {
      setMsg("Justification is required");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await apiFetch(
        "/api/insurance/admin/approve",
        {
          method: "POST",
          body: {
            encounterId: encounter._id,
            justification,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg("Insurance approved successfully");
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function reject() {
    if (!

