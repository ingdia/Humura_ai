import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../constants/config';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket || !socket.connected) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/** Deterministic room ID — same regardless of who calls it */
export const getRoomId = (id1: number, id2: number): string =>
  `conversation_${Math.min(id1, id2)}_${Math.max(id1, id2)}`;
