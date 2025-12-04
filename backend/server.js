import http from 'http';
import { Server as IOServer } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';
import { initSocket } from './utils/socket.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  const server = http.createServer(app);
  const io = new IOServer(server, { cors: { origin: process.env.FRONTEND_URL || '*', credentials: true } });
  initSocket(io);
  server.listen(PORT, () => console.log(`AfyaLink HRMS backend listening on ${PORT}`));
};

start().catch(err => {
  console.error('Failed to start server', err);
  process.exit(1);
});
