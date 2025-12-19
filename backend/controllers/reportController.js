import Report from "../models/Report.js";
import { io } from "../server.js";

/* ======================================================
   GET ALL REPORTS (Hospital / Super Admin)
====================================================== */
export const getReports = async (req, res) => {
  try {
    const filter = {
      hospital: req.user.hospital, // 🏥 TENANT ISOLATION
    };

    const reports = await Report.find(filter)
      .populate("patient createdBy")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   GET MY REPORTS (Doctor / Patient)
====================================================== */
export const getMyReports = async (req, res) => {
  try {
    const baseFilter = {
      hospital: req.user.hospital, // 🏥 TENANT ISOLATION
    };

    let roleFilter = {};

    if (req.user.role === "Doctor") {
      roleFilter.createdBy = req.user._id;
    }

    if (req.user.role === "Patient") {
      roleFilter.patient = req.user._id;
    }

    const reports = await Report.find({
      ...baseFilter,
      ...roleFilter,
    })
      .populate("patient createdBy")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   CREATE REPORT
====================================================== */
export const createReport = async (req, res) => {
  try {
    const report = await Report.create({
      ...req.body,
      createdBy: req.user._id,
      hospital: req.user.hospital, // 🏥 LOCK TO TENANT
    });

    // 🔔 Scoped realtime notification (hospital room)
    io.to(`hospital:${req.user.hospital}`).emit("notification", {
      type: "REPORT_CREATED",
      message: "New medical report created",
      reportId: report._id,
    });

    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   UPDATE REPORT
====================================================== */
export const updateReport = async (req, res) => {
  try {
    const report = await Report.findOneAndUpdate(
      {
        _id: req.params.id,
        hospital: req.user.hospital, // 🏥 TENANT GUARD
      },
      req.body,
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    io.to(`hospital:${req.user.hospital}`).emit("notification", {
      type: "REPORT_UPDATED",
      message: "Medical report updated",
      reportId: report._id,
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   DELETE REPORT
====================================================== */
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({
      _id: req.params.id,
      hospital: req.user.hospital, // 🏥 TENANT GUARD
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    io.to(`hospital:${req.user.hospital}`).emit("notification", {
      type: "REPORT_DELETED",
      message: "Medical report deleted",
      reportId: report._id,
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
