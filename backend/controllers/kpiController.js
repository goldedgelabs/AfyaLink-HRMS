import { hospitalKPIs } from "../services/kpiService.js";

/**
 * KPI CONTROLLER
 * - Delegates to service layer
 * - No business logic
 * - Read-only
 */
export async function getHospitalKPIs(req, res, next) {
  try {
    await hospitalKPIs(req, res, next);
  } catch (err) {
    next(err);
  }
}
