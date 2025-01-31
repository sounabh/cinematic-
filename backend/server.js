// server.js
import http from "http";
import app from "./index.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import RedisClient from "./services/redisService.js";

async function storeMessage(roomId, message, senderId) {
  const timestamp = Date.now();
  const messageData = JSON.stringify({
    message,
    timestamp,
    senderId
  });
  
  await RedisClient.lpush(`chat:${roomId}:messages`, messageData);
  await RedisClient.expire(`chat:${roomId}:messages`, 86400);
}

async function getMessages(roomId) {
  const messages = await RedisClient.lrange(`chat:${roomId}:messages`, 0, -1);
  return messages.map(msg => JSON.parse(msg)).reverse();
}

const server = http.createServer(app);
const port = process.env.PORT || 8000;

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://12angrymen.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(async(socket, next) => {
  try {
    const token = socket.handshake.auth.token || 
                 socket.handshake.headers.authorization?.split(' ')[1];
    
    const chatId = socket.handshake.query.chatId;
    
    if (!token) {
      return next(new Error('Authentication token missing'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new Error("Authentication is invalid"));
    }

    socket.sender = decoded;
    socket.roomId = chatId;
    
    next();
  } catch (error) {
    console.error("Socket authentication/validation error:", error);
    return next(new Error('Authentication or validation error'));
  }
});

io.on('connection', async (socket) => {
  socket.join(socket.roomId);

  try {
    const previousMessages = await getMessages(socket.roomId);
    socket.emit('previous-messages', previousMessages);
  } catch (error) {
    console.error('Error fetching previous messages:', error);
  }

  socket.on("chat-message", async (message) => {
    console.log("Server received message:", message);
    
    try {
      // Store the message with sender ID
      await storeMessage(socket.roomId, message, socket.sender.id);
      
      // Emit message with sender information
      socket.to(socket.roomId).emit("message", {
        message: message,
        senderId: socket.sender.id,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log("User disconnected from room:", socket.roomId);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
