import { io } from 'socket.io-client';

export const socket = io('https://evacuaid-alert-system-183904188610.asia-south1.run.app/', {
  reconnectionDelayMax: 10000,
});
