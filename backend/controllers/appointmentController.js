import Appointment from "../models/Appointment.js";
import { getIO } from "../utils/socket.js";

/* ======================================================
   CREATE APPOINTMENT
====================================================== */
export const createAppointment = async (req, res, next) => {
  try {
    const { patient, doctor, hospital, scheduledAt, reason } = req.body;

    if (!patient || !scheduledAt) {
      return res
        .status(400)
        .json({ msg: "patient and scheduledAt are required" });
    }

    const appointment = await Appointment.create({
      patient,
      doctor,
      hospital,
      scheduledAt,
      reason,
      createdBy: req.user.id,
    });

    // 🔐 ABAC CONTEXT (YES, EVEN ON CREATE)
    req.resource = {
      ownerId: String(appointment.patient),
      hospital: appointment.hospital,
      doctor: appointment.doctor,
    };

    // 🧾 Audit AFTER snapshot
    res.locals.after = appointment;

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
    const a = await Appointment.findById(req.params.id).populate(
      "patient doctor hospital"
    );

    if (!a) return res.status(404).json({ msg: "Not found" });

    // 🔐 ABAC CONTEXT (CRITICAL)
    req.resource = {
      ownerId: String(a.patient),
      hospital: a.hospital,
      doctor: a.doctor,
    };

    // 🧾 Audit BEFORE snapshot
    req.resourceSnapshot = a.toObject();

    res.json(a);
  } catch (err) {
    next(err);
  }
};

/* ======================================================
   LIST APPOINTMENTS
====================================================== */
export const listAppointments = async (req, res, next) => {
  try {
    const user = req.user;
    const filter = {};

    // 🔐 Scoped querying (performance + security)
    if (user.role === "Patient") filter.patient = user.id;
    if (user.role === "Doctor") filter.doctor = user.id;
    if (user.hospital) filter.hospital = user.hospital;

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
    const a = await Appointment.findById(req.params.id);
    if (!a) return res.status(404).json({ msg: "Not found" });

    // 🔐 ABAC CONTEXT
    req.resource = {
      ownerId: String(a.patient),
      hospital: a.hospital,
      doctor: a.doctor,
    };

    // 🧾 Audit BEFORE snapshot
    req.resourceSnapshot = a.toObject();

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // 🧾 Audit AFTER snapshot
    res.locals.after = updated;

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
   DELETE APPOINTMENT
====================================================== */
export const deleteAppointment = async (req, res, next) => {
  try {
    const a = await Appointment.findById(req.params.id);
    if (!a) return res.status(404).json({ msg: "Not found" });

    // 🔐 ABAC CONTEXT
    req.resource = {
      ownerId: String(a.patient),
      hospital: a.hospital,
      doctor: a.doctor,
    };

    // 🧾 Audit BEFORE snapshot
    req.resourceSnapshot = a.toObject();

    await a.deleteOne();

    // 🧾 Audit AFTER snapshot (null = deleted)
    res.locals.after = null;

    try {
      getIO()
        .to(String(a.patient))
        .emit("appointmentDeleted", a);
    } catch (_) {}

    res.json({ msg: "Deleted" });
  } catch (err) {
    next(err);
  }
};
