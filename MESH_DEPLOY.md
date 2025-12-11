Deploying Signaling + TURN (coturn) for AfyaLink Mesh
---------------------------------------------------

1. Build signaling server image:
   docker build -t afyalink-signaling -f scripts/Dockerfile.signaling scripts/

2. Run coturn (TURN) with credentials in env:
   docker run -d --name coturn -p 3478:3478 -p 3478:3478/udp -e REALM=afyalink.local -e USER=$TURN_USER -e PASS=$TURN_PASS instrumentisto/coturn

3. Run signaling server:
   docker run -d --name signaling -p 5005:5005 -e SIGNALING_JWT_SECRET=xxx afyalink-signaling

4. Configure clients to use TURN server:
   iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'turn:YOUR_TURN_IP:3478', username: 'turnuser', credential: 'turnpass' }]
