Updated: Peer-to-peer sync & signaling

- Run signaling server: node scripts/signaling-server-secure.js (or use docker-compose.signaling.yml)
- Tokens: generate JWTs with payload { sub: '<userId>', role: 'IntegrationsOfficer' } signed by SIGNALING_JWT_SECRET
- Client: use CrdtPeer in frontend/lib/afya-crdt-webrtc.js to join room and exchange Automerge changes via DataChannel
- E2E test: node scripts/e2e_crdt_test.js (requires server running on http://localhost:4000)
