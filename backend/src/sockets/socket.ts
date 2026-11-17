import { Server, Socket } from 'socket.io';
import http from 'node:http';
import jwt from 'jsonwebtoken';

let io: Server;

// In-memory map: key = userId, value = socket.id
const userSocketMap: Record<string, string> = {};

export const getReceiverSocketId = (receiverId: string): string | undefined => {
  return userSocketMap[receiverId];
};

export const initializeSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // --- 1. SOCKET AUTHENTICATION MIDDLEWARE ---
  io.use((socket: Socket, next) => {
    // Look for token in auth payload or headers
    const token = socket.handshake.auth.token || socket.handshake.headers['authorization'];

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    // Clean token if sent as "Bearer <token>"
    const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;

    try {
      const decoded = jwt.verify(tokenString, process.env.JWT_SECRET as string) as { userId: string };
      // Securely bind the verified userId directly to the socket instance
      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  // --- 2. CONNECTION HANDLER ---
  io.on('connection', (socket: Socket) => {
    // Read the securely verified userId from socket.data
    const userId: string = socket.data.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
      console.log(`🔒 Authenticated user connected: ${userId} -> Socket: ${socket.id}`);
    }

    // Broadcast current online user IDs
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('requestOnlineUsers', () => {
      socket.emit('getOnlineUsers', Object.keys(userSocketMap));
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: Socket ${socket.id}`);
      if (userId) {
        delete userSocketMap[userId];
      }
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
};