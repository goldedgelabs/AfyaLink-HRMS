# AfyaLink HRMS - Deployment & Production Checklist

Generated: 2025-12-11T06:26:02.724441 UTC

## Quick start (Docker Compose)
1. Copy `.env.example` to `.env` and fill values.
2. Build and run (production):
   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```
3. Backend will be available on port 4000, frontend on port 80 (configurable).

## Required environment variables
See `.env.production.example` for the full list.
- MONGO_URI
- JWT_SECRET
- REFRESH_SECRET
- NODE_ENV=production
- (Payment & notification API keys not included in repo)

## Security checklist (must do before production)
- Replace placeholder secrets with real API keys in environment variables (do NOT commit keys).
- Ensure HTTPS is enabled (use a reverse proxy like Nginx or a platform that terminates TLS).
- Set `secure=true` on cookies and ensure SameSite rules are appropriate.
- Rotate any leaked keys and remove them from repository history if committed previously.

## Notes
- This release includes AI placeholders; connect NeuroEdge or your AI provider in `/backend/ai/neuroedgeClient.js`.
- Payments & notifications are skeletons; integrate real provider SDKs and test webhooks.
- Run `npm run lint` and `npm run format` in both frontend and backend before pushing to CI.
