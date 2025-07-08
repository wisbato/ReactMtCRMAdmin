import { io as socketIOClient } from "socket.io-client";

const token = localStorage.getItem("token");

export const socket = socketIOClient("http://192.168.29.36:5005", {
  withCredentials: true, // This ensures cookies are sent
  autoConnect: false,
  transports: ["websocket"],
  auth: { token: token }, // Force WebSocket transport
  // Pass the token
});

export const connectSocket = () => {
  const token = localStorage.getItem("token");

  if (token) {
    socket.auth = { token: token };

    socket.connect();
  } else {
    console.warn("No token found for Socket.IO connection.");
  }
};

export const disconnectSocket = () => {
  socket.disconnect();
};
