"use client";

import socket from "socket.io-client";

let socketInstance = null;

export const socketInitialize = (chatId, token) => {
  if (socketInstance) return socketInstance;

  if (!token) {
    console.error("No auth token found");
    return null;
  }

  socketInstance = socket(process.env.NEXT_PUBLIC_BACKEND_SERVER_URL || "http://localhost:5000", {
    auth: { token },
    query: { chatId },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    withCredentials: true,
  });

  socketInstance.on("connect", () => {
    console.log("Socket connected:", socketInstance.id);
  });

  socketInstance.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socketInstance;
};

export const getSocketInstance = () => {
  if (!socketInstance) {
    console.error("Socket not initialized. Call socketInitialize first.");
  }
  return socketInstance;
};

export const receivedMessage = (event, callback) => {
  if (!socketInstance) {
    console.error("Socket not initialized in receivedMessage");
    return;
  }

  socketInstance.on(event, (data) => {
    console.log(`Received ${event}:`, data);
    callback(data);
  });
};

export const sendMessage = (event, message) => {
  const socket = getSocketInstance();
  if (!socket) {
    console.error("Socket instance not found");
    return;
  }

  console.log(`Sending ${event}:`, message);
  socket.emit(event, message);
};
