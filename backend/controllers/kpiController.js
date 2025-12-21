import Encounter from "../models/Encounter.js";
import Transaction from "../models/Transaction.js";

/**
 * HOSPITAL KPI DASHBOARD
 * 🔒 Admin only
 * 📊 Read-only aggregation
 */

export async function hospitalKPIs(req, res) {
  try {
    /* ===============================
       ENCOUNTER STATS
    =============================== */
    const totalEncounters = await Encounter.countDocuments();

    const activeEncounters = await Encounter.countDocuments({
      "workflow.state": { $nin: ["COMPLETED", "CANCELLED"] },
    });

    const completedEncounters = await Encounter.countDocuments({
      "workflow.state": "COMPLETED",
    });

    /* ===============================
       INSURANCE (SHA) KPIs
    =============================== */
    const insurancePending = await Encounter.countDocuments({
      "insurance.provider": "SHA",
      "insurance.status": "PENDING",
    });

    const insuranceApproved = await Encounter.countDocuments({
      "insurance.provider": "SHA",
      "insurance.status": "APPROVED",
    });

    const insuranceRejected = await Encounter.countDocuments({
      "insurance.provider": "SHA",
      "insurance.status": "REJECTED",
    });

    /* ===============================
       LAB & PHARMACY FLOW
    =============================== */
    const labPending = await Encounter.countDocuments({
      "workflow.state": "LAB_PENDING",
    });

    const pharmacyPending = await Encounter.countDocuments({
      "workflow.state": "PRESCRIPTION_READY",
    });

    /* ===============================
       BILLING / REVENUE
    =============================== */
    const totalRevenueAgg = await Transaction.aggregate([
      { $match: { "workflow.state": "PAID" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue =
      totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;

    const pendingPayments = await Transaction.countDocuments({
      "workflow.state": { $ne: "PAID" },
    });

    /* ===============================
       RESPONSE
    =============================== */
    res.json({
      encounters: {
        total: totalEncounters,
        active: activeEncounters,
        completed: completedEncounters,
      },

      insurance: {
        provider: "SHA",
        pending: insurancePending,
        approved: insuranceApproved,
        rejected: insuranceRejected,
      },

      flow: {
        labPending,
        pharmacyPending,
      },

      billing: {
        totalRevenue,
        pendingPayments,
      },
    });
  } catch (err) {
    console.error("KPI ERROR:", err);
    res.status(500).json({ error: "Failed to load KPIs" });
  }
}
