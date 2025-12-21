import axios from "axios";

const NHIF_BASE_URL = process.env.NHIF_BASE_URL;
const NHIF_API_KEY = process.env.NHIF_API_KEY;

export async function requestNhifPreAuth({ encounter, amount }) {
  const res = await axios.post(
    `${NHIF_BASE_URL}/preauth`,
    {
      encounterId: encounter._id,
      patientId: encounter.patient,
      amount,
    },
    {
      headers: {
        Authorization: `Bearer ${NHIF_API_KEY}`,
      },
    }
  );

  return res.data; // { status, reference }
}
