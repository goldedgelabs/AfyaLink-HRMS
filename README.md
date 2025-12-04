# AfyaLink HRMS 2.0 - Complete
This package contains a full MERN-stack Hospital Record Management System scaffold:
- Backend: Node.js + Express + MongoDB (ESM modules), Socket.io, JWT auth, role-based access
- Frontend: React with role-based pages, Socket.io client, premium UI components
- AI utilities: simple predictive and anomaly-detection helpers

## Run locally
### Backend
- cd backend
- copy `.env.example` to `.env` and set MONGO_URI and JWT_SECRET
- npm install
- npm run dev

### Frontend
- cd frontend
- npm install
- npm start

Project generated programmatically. This is a deployable scaffold. Expand controllers and frontend forms as needed.


## Extended features added
- Enhanced financial workflows: payments, insurance claim submission, reconciliation
- Full transfer lifecycle: request, approve, reject, complete, audit logs
- Frontend CRUD for patients and notifications wired to socket events
- Dockerfiles and docker-compose for local containerized development
- GitHub Actions CI skeleton and Render/Vercel deploy templates

## How to run with Docker
- docker-compose up --build


## New features added
- Full CRUD UIs for Appointments, Lab Tests, Financials with forms and socket notifications.
- RBAC admin UI to manage roles.
- Demo seeding script: `node backend/seed.js` (creates sample hospital, users, patient).
- Advanced AI endpoints and ML scaffolding: `/api/ai/slot`, `/api/ai/risk`, `/api/ml/train`, `/api/ml/:modelId/predict`.
- Tests: Jest + Supertest skeleton in `backend/tests/` using mongodb-memory-server.



## Running backend tests
In backend: `npm ci && npm test` (Jest + mongodb-memory-server are used)
