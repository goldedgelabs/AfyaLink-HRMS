import Encounter from "../models/Encounter.js";
import Transaction from "../models/Transaction.js";

export async function getHospitalKPIs() {
  const totalEncounters = await Encounter.countDocuments();

  const completedEncounters = await Encounter.countDocuments({
    status: "COMPLETED",
  });

  const revenue = await Transaction.aggregate([
    { $match: { status: "success" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return {
    totalEncounters,
    completedEncounters,
    completionRate:
      (completedEncounters / Math.max(totalEncounters, 1)) * 100,
    revenue: revenue[0]?.total || 0,
  };
}
