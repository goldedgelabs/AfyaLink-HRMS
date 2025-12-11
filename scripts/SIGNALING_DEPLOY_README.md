Signaling Server Deployment
===========================

1. Build & run with Docker Compose:
   docker-compose -f docker-compose.signaling.yml up --build -d

2. Configure TURN server (production):
   - Use a managed TURN (e.g., Twilio, xirsys) and set REACT_APP_TURN_URL, REACT_APP_TURN_USER, REACT_APP_TURN_PASS in frontend
   - Update signaling server to authenticate TURN requests as needed

3. Token issuance:
   - The server exposes POST /token to generate JWT tokens for clients (demo only). Integrate with your auth to sign tokens.

4. Security:
   - Use HTTPS (TLS) in production.
   - Secure JWT secret via environment variables or secrets manager.
