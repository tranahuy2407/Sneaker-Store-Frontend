import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});


export const joinAdminRoom = () => {
  socket.emit("join_admin");
};

export const joinOrderRoom = (orderId) => {
  socket.emit("join_order", orderId);
};
