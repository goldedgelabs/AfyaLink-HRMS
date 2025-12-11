import crdtRoutes from "./routes/crdtRoutes.js";
app.use("/api/crdt", crdtRoutes);
import dlqScheduler from './services/dlqScheduler.js';
import attachWebSocketServer from './wsServer.js';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';
import { initSocket } from './utils/socket.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const FRONTEND = process.env.FRONTEND_URL || "*";

const start = async () => {
  try {
    // Connect database
    await connectDB();

    // Create HTTP Express server
    const server = http.createServer(app);

    // Setup WebSocket server
    const io = new IOServer(server, {
      cors: {
        origin: FRONTEND,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
      }
    });

    // Initialize socket handlers
    initSocket(io);

    // Start backend server
    server.listen(PORT, () => {
      console.log(`\n🚀 AfyaLink HRMS backend running on port ${PORT}`);
      console.log(`🌐 Allowed Frontend Origin: ${FRONTEND}\n`);
    });

  } catch (err) {
    console.error("❌ Failed to start server", err);
    process.exit(1);
  }
};

start();
