// Simple signaling server for WebRTC offers/answers via socket.io
import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';

const app = express();
const http = createServer(app);
const io = new Server(http, { cors: { origin: '*' } });

io.on('connection', socket => {
  console.log('socket connected', socket.id);
  socket.on('join-room', (room) => {
    socket.join(room);
    socket.to(room).emit('peer-joined', { id: socket.id });
  });
  socket.on('signal', ({ room, to, data }) => {
    if(to) io.to(to).emit('signal', { from: socket.id, data });
    else socket.to(room).emit('signal', { from: socket.id, data });
  });
  socket.on('disconnect', ()=> console.log('socket disconnected', socket.id));
});

http.listen(process.env.SIGNALING_PORT || 5005, ()=> console.log('Signaling server running on port', process.env.SIGNALING_PORT || 5005));
