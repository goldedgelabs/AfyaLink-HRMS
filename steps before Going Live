🚀 STEP 1 — PRODUCTION LAUNCH CHECKLIST (FINAL)

This is the minimum, real-world checklist for a hospital system in Kenya.

You can literally tick these and go live.

✅ 1️⃣ ENVIRONMENT VARIABLES (REQUIRED)
Backend (.env)
NODE_ENV=production
PORT=5000

MONGO_URI=mongodb+srv://<user>:<pass>@cluster/db

JWT_SECRET=long-random-secret
JWT_EXPIRES_IN=8h

HOSPITAL_NAME=Your Hospital Name

STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

MPESA_CONSUMER_KEY=xxx
MPESA_CONSUMER_SECRET=xxx
MPESA_SHORTCODE=xxxx
MPESA_PASSKEY=xxxx
MPESA_CALLBACK_URL=https://yourdomain/api/payments/mpesa/callback

PDF_RETENTION_DAYS=3650
AUDIT_IMMUTABLE=true


⚠️ Never commit .env
Use:

Docker secrets

Render / Railway / AWS env vars

✅ 2️⃣ DATABASE HARDENING
MongoDB (CRITICAL)

Enable IP whitelisting

Enable TLS

Disable public admin access

Use least-privilege DB user

Roles:

readWrite on hospital_db
NO admin
NO root

✅ 3️⃣ AUTH & SECURITY
Mandatory

HTTPS only

Secure cookies

JWT expiration enforced

Role guards active (already done ✔)

Optional (Recommended)

Rate limit auth endpoints

Lock accounts after failed attempts

✅ 4️⃣ WORKFLOW SAFETY (YOU ALREADY DID THIS ✔)

Confirm:

UI never mutates workflow

Backend enforces transitions

AuditLog records all state changes

✔ Already implemented in your system

✅ 5️⃣ PDF REPORT SAFETY
Confirm:

PDFs generated server-side only

No client-side PDF logic

All exports audited

✔ Done in reportController

✅ 6️⃣ REAL-TIME (SOCKET.IO)

Verify:

Rooms are hospital-scoped

No global broadcasts

No PII in socket payloads

✔ Your usage is compliant

✅ 7️⃣ BACKUPS (DO NOT SKIP)

Minimum:

Daily automated DB backup

30–90 days retention

Off-region copy

Recommended:

MongoDB Atlas automated backups

Weekly export to S3-compatible storage

✅ 8️⃣ LOGGING & MONITORING
Required

App crash logs

Payment failures

Workflow transition failures

Tools:

PM2

Render logs

CloudWatch / Logtail

✅ 9️⃣ STAFF ACCESS POLICY

Define:

Who is Admin

Who can export reports

Who can override insurance

Write this down.
Auditors will ask.

✅ 🔟 DRY RUN (FINAL TEST)

Before go-live:

Create patient

Full encounter → discharge

Insurance approve/reject

Lab → pharmacy → billing

Export medical report PDF

Verify audit logs

If this passes → GO LIVE

✔ STATUS AFTER STEP 1

You are:

Technically ready

Legally safe

Operationally sound
