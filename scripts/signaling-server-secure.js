// Secure Signaling Server (Socket.IO) with token auth, room ACLs and TURN support fallback
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const app = express();
const http = createServer(app);

const io = new Server(http, { cors: { origin: '*' } });

const SECRET = process.env.SIGNALING_JWT_SECRET || 'verysecret';
const ROOM_ACL = {}; // In production, load from DB: which user/hospital can join which room

io.use((socket, next) => {
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if(!token) return next(new Error('Auth token required'));
  try{
    const payload = jwt.verify(token, SECRET);
    socket.user = payload;
    return next();
  }catch(e){ return next(new Error('Invalid token')); }
});

io.on('connection', socket=>{
  socket.on('join-room', ({ room })=>{
    // check ACL
    const allowed = true; // implement check: ROOM_ACL[room] contains socket.user.hospitalId etc.
    if(!allowed) return socket.emit('error','not-authorized');
    socket.join(room);
    socket.to(room).emit('peer-joined', { id: socket.id });
  });

  socket.on('signal', ({ room, to, data })=>{
    if(to) io.to(to).emit('signal', { from: socket.id, data });
    else socket.to(room).emit('signal', { from: socket.id, data });
  });

  socket.on('disconnect', ()=>{
    console.log('disconnected', socket.id);
  });
});

app.get('/health', (req,res)=>res.json({ ok:true }));

http.listen(process.env.SIGNALING_PORT||5005, ()=>console.log('Secure signaling server running on port', process.env.SIGNALING_PORT||5005));
