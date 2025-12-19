import Appointment from "../models/Appointment.js";
import { getIO } from "../utils/socket.js";

/* ======================================================
   HELPERS
====================================================== */
function assertOwnershipOrScope(user, appointment) {
  // SUPER_ADMIN bypass
  if (user.role === "SUPER_ADMIN") return true;

  // Patient → only own appointment
  if (
    user.role === "PATIENT" &&
    String(appointment.patient) !== user.id
  ) {
    return false;
  }

  // Doctor → assigned doctor only
  if (
    user.role === "DOCTOR" &&
    String(appointment.doctor) !== user.id
  ) {
    return false;
  }

  // Hospital admin → same hospital only
  if (
    user.role === "HOSPITAL_ADMIN" &&
    String(appointment.hospital) !== user.hospitalId
  ) {
    return false;
  }

  return true;
}

/* ======================================================
   CREATE APPOINTMENT
====================================================== */
export const createAppointment = async (req, res, next) => {
  try {
    const user = req.user;
    const { patient, doctor, hospital, scheduledAt, reason } = req.body;

    if (!patient || !scheduledAt) {
      return res
        .status(400)
        .json({ msg: "patient and scheduledAt are required" });
    }

    // 🔒 Patient can only create for self
    if (user.role === "PATIENT" && patient !== user.id) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    // 🔒 Hospital admin scoped
    if (
      user.role === "HOSPITAL_ADMIN" &&
      hospital !== user.hospitalId
    ) {
      return res.status(403).json({ msg: "Cross-hospital access denied" });
    }

    const appointment = await Appointment.create({
      patient,
      doctor,
      hospital,
      scheduledAt,
      reason,
      createdBy: user.id,
    });

    // 🔔 Realtime notify doctor
    try {
      if (doctor) {
        getIO()
          .to(String(doctor))
          .emit("appointmentCreated", appointment);
      }
    } catch (_) {}

    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
};

/* ======================================================
   GET APPOINTMENT
====================================================== */
export const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      "patient doctor hospital"
    );

    if (!appointment)
      return res.status(404).json({ msg: "Not found" });

    if (!assertOwnershipOrScope(req.user, appointment)) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

/* ======================================================
   LIST APPOINTMENTS (ROLE SCOPED)
====================================================== */
export const listAppointments = async (req, res, next) => {
  try {
    const user = req.user;
    const filter = {};

    if (user.role === "PATIENT") {
      filter.patient = user.id;
    }

    if (user.role === "DOCTOR") {
      filter.doctor = user.id;
    }

    if (user.role === "HOSPITAL_ADMIN") {
      filter.hospital = user.hospitalId;
    }

    const items = await Appointment.find(filter)
      .populate("patient doctor hospital")
      .limit(500);

    res.json(items);
  } catch (err) {
    next(err);
  }
};

/* ======================================================
   UPDATE APPOINTMENT
====================================================== */
export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ msg: "Not found" });

    if (!assertOwnershipOrScope(req.user, appointment)) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    try {
      getIO()
        .to(String(updated.patient))
        .emit("appointmentUpdated", updated);
    } catch (_) {}

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/* ======================================================
   DELETE APPOINTMENT (STRICT)
====================================================== */
export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ msg: "Not found" });

    // 🔥 Only Hospital Admin or Super Admin
    if (
      !["HOSPITAL_ADMIN", "SUPER_ADMIN"].includes(req.user.role)
    ) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    await appointment.deleteOne();

    try {
      getIO()
        .to(String(appointment.patient))
        .emit("appointmentDeleted", appointment);
    } catch (_) {}

    res.json({ msg: "Deleted" });
  } catch (err) {
    next(err);
  }
};
