
# Deployment Notes

This file outlines steps to deploy AfyaLink-HRMS to production using Docker Compose or common hosts.

## Environment variables
- MONGO_URI
- JWT_SECRET
- REFRESH_SECRET
- NODE_ENV=production

## Docker (production)
1. Build images:
   docker-compose -f docker-compose.prod.yml build
2. Start services:
   docker-compose -f docker-compose.prod.yml up -d
3. Ensure ports 80 and 5000 are open and point DNS accordingly.

## Render/Vercel notes
- Frontend can be deployed to Vercel as a static site (build output /frontend/build).
- Backend should be deployed to a service supporting Node (Render/Heroku/DigitalOcean App Platform).

## NeuroEdge integration
Edit backend/ai/neuroedgeClient.js and implement actual calls to your NeuroEdge API. The aiService wrappers call those functions.

