import { io } from 'socket.io-client';

// Get the SOCKET_URL from environment variables
const socketUrl = process.env.SOCKET_URL || 'https://socket-server-p7f5.onrender.com';

export const socket = io(socketUrl, {
  transports: ['websocket', 'polling'],
});
