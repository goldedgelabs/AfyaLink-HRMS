import AuditLog from "../models/AuditLog.js";

/* ======================================================
   AUDIT MIDDLEWARE
====================================================== */
export const audit = (action, resource) => {
  return async (req, res, next) => {
    const before = req.resourceSnapshot || null;

    res.on("finish", async () => {
      if (res.statusCode >= 400) return;

      try {
        await AuditLog.create({
          actorId: req.user?.id,
          role: req.user?.role,
          action,
          resource,
          resourceId: req.params?.id,
          before,
          after: req.body,
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        });
      } catch (err) {
        console.error("Audit failed:", err.message);
      }
    });

    next();
  };
};
