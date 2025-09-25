import { Server } from 'socket.io';
let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected with socket ID:', socket.id);

    socket.on('join-room', (userId) => {
      socket.join(userId);
      console.log(`User with socket ID ${socket.id} joined room ${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected with socket ID:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};