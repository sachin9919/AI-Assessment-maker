import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import config from './index';

let io: SocketIOServer | null = null;

export const initSocket = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.frontendUrl || 'http://localhost:3000',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Allow clients to join a room specific to an assignment ID
    socket.on('join_assignment', (assignmentId: string) => {
      socket.join(assignmentId);
      console.log(`[Socket] Client ${socket.id} joined room: ${assignmentId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io has not been initialized yet');
  }
  return io;
};
