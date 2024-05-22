import { io } from 'socket.io-client';

export const socket = io(`http://localhost/`, {
  port: 8000,
  path: '/socket',
  reconnectionAttempts: 10,
});