import Encounter from "../models/Encounter.js";
import Transaction from "../models/Transaction.js";
import InsuranceAuthorization from "../models/InsuranceAuthorization.js";

/**
 * ADMIN — HOSPITAL KPI SNAPSHOT
 * 🔒 READ ONLY
 */
export async function hospitalKPIs(req, res, next) {
  try {
    /* ===========================
       ENCOUNTERS
    ============================ */
    const totalEncounters = await Encounter.countDocuments();

    const activeEncounters = await Encounter.countDocuments({
      "workflow.state": { $ne: "COMPLETED" },
    });

    const completedEncounters = await Encounter.countDocuments({
      "workflow.state": "COMPLETED",
    });

    /* ===========================
       INSURANCE — SHA
    ============================ */
    const insurancePending = await InsuranceAuthorization.countDocuments({
      provider: "SHA",
      status: "PENDING",
    });

    const insuranceApproved = await InsuranceAuthorization.countDocuments({
      provider: "SHA",
      status: "APPROVED",
    });

    const insuranceRejected = await InsuranceAuthorization.countDocuments({
      provider: "SHA",
      status: "REJECTED",
    });

    /* ===========================
       CLINICAL FLOW
    ============================ */
    const labPending = await Encounter.countDocuments({
      "workflow.state": "LAB_PENDING",
    });

    const pharmacyPending = await Encounter.countDocuments({
      "workflow.state": "PHARMACY_PENDING",
    });

    /* ===========================
       BILLING
    ============================ */
    const revenueAgg = await Transaction.aggregate([
      { $match: { "workflow.state": "PAID" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const pendingPayments = await Transaction.countDocuments({
      "workflow.state": "PAYMENT_PENDING",
    });

    /* ===========================
       RESPONSE
    ============================ */
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
        totalRevenue: revenueAgg[0]?.total || 0,
        pendingPayments,
      },
    });
  } catch (err) {
    next(err);
  }
}
