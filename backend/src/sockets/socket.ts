import { Server, Socket } from 'socket.io';
import http from 'node:http';

// This function will take our running HTTP server and attach Socket.io to it
export const initializeSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // For development, allow any frontend to connect. We will restrict this in production.
      methods: ["GET", "POST"]
    }
  });

  // Listen for new connections
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 A user connected (Socket ID: ${socket.id})`);

    // Listen for a specific event from a client
    socket.on('sendMessage', (messageData) => {
      // For now, if anyone sends a message, immediately broadcast it to everyone else
      io.emit('receiveMessage', messageData);
    });

    // Listen for when a user closes their browser tab
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected (Socket ID: ${socket.id})`);
    });
  });

  return io;
};