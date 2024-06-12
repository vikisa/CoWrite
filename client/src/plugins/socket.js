import { io } from 'socket.io-client';

export const socket = io(process.env.APP_BASE_URL, {
  path: '/socket/',
  reconnectionAttempts: 10,
});