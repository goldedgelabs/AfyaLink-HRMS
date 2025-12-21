import InsuranceAuthorization from "../models/InsuranceAuthorization.js";
import Encounter from "../models/Encounter.js";
import { requestNhifPreAuth } from "../services/nhifService.js";

export async function requestNhifAuthorization(req, res) {
  const { encounterId } = req.body;

  const encounter = await Encounter.findById(encounterId);
  if (!encounter) {
    return res.status(404).json({ error: "Encounter not found" });
  }

  const nhif = await requestNhifPreAuth({
    encounter,
    amount: encounter.totalAmount,
  });

  const auth = await InsuranceAuthorization.create({
    encounter: encounterId,
    provider: "NHIF",
    status: nhif.status,
    reference: nhif.reference,
  });

  res.json(auth);
}
