"use client";

import socket from "socket.io-client"; // Import 'io' from 'socket.io-client'
import useUserStore from "./userStore";




let socketInstance = null; // Store the socket instance globally

export const socketInitialize = (chatId,token) => {
  
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

  return socketInstance;
};


export const getSocketInstance = () => {
  if (!socketInstance) {
      //console.error("Socket not initialized. Call socketInitialize first.");
  }
  return socketInstance;
}

export const receivedMessage = (e, cb) => {

  if (!socketInstance) {
    console.log("Socket not initialized in receivedMessage");
    return;
  }
  //console.log("Setting up message listener");

  socketInstance.on(e, (receivedData) => {

    //console.log("Message received:", receivedData);

    cb(receivedData);
  });
};


export const sendMessage = (e, data) => {
  const socket = getSocketInstance()
  //console.log(socket);
  
  //console.log("Sending message:", data);
 // console.log(e);
  
  socket.emit(e, data);
};
