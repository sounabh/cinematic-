import http from "http";
import app from "./index.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import RedisClient from "./services/redisService.js";








async function storeMessage(roomId, message,senderId) {
  const timestamp = Date.now();
  const messageData = JSON.stringify({
    message,
    timestamp,
    senderId
  });
  
  // Store message in a Redis list with room ID as key
  await RedisClient.lpush(`chat:${roomId}:messages`, messageData);
  
  // Set expiration for messages (24 hours = 86400 seconds)
  await RedisClient.expire(`chat:${roomId}:messages`, 86400);
}

// Helper function to get messages from Redis
async function getMessages(roomId) {
  // Get all messages for the room from the last 24 hours
  const messages = await RedisClient.lrange(`chat:${roomId}:messages`, 0, -1);
  
  return messages.map(msg => JSON.parse(msg)).reverse();
}

















// Create an HTTP server from the Express app
const server = http.createServer(app);


// Define the port for the server to listen on
const port = process.env.PORT || 8000;


// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "12angrymen.vercel.app", // Allow requests from this origin (frontend URL)
    methods: ["GET", "POST"],        // Allow only GET and POST HTTP methods
    credentials: true,               // Enable credentials (e.g., cookies or headers)
  },
});


// Middleware for Socket.IO authentication and project validation
io.use(async(socket, next) => {
  try {
    // Retrieve the token from either handshake auth or headers
    const token = socket.handshake.auth.token || 
                 socket.handshake.headers.authorization?.split(' ')[1];

               // console.log("t",token);
                
    
    // Get user ID and project ID from query parameters
    const chatId = socket.handshake.query.chatId;
    

    // Check if token exists
    if (!token) {
      return next(new Error('Authentication token missing'));
    }


    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new Error("Authentication is invalid"));
    }



  

    // Validate if project ID is a valid MongoDB ObjectId using mongoose.Types.ObjectId
    /*if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new Error('Invalid User ID format'));
    }
*/

    

    // Attach user data and IDs to socket object
    socket.sender = decoded; //basically sender
  //  socket.receiver = await User.findById(userId)
  socket.roomId =  chatId 
    


    // Proceed with connection
    next();

  } catch (error) {
    console.error("Socket authentication/validation error:", error);
    return next(new Error('Authentication or validation error'));
  }
});



// Handle socket connections and events
io.on('connection', async (socket) => {

 // console.log(socket.sender.id);
  
 // console.log("Joined room:", socket.roomId);
  
  socket.join(socket.roomId);

  // Send previous messages when user connects
  try {
    const previousMessages = await getMessages(socket.roomId);
    socket.emit('previous-messages', previousMessages);
  } catch (error) {
    console.error('Error fetching previous messages:', error);
  }

  socket.on("chat-message", async (data) => {
   // console.log("Server received message:", data.newMessage);
    
    // Store message in Redis
    try {
        await storeMessage(socket.roomId, data.newMessage, socket.sender.id);
    } catch (error) {
      console.error('Error storing message in Redis:', error);
    }
    
    socket.to(socket.roomId).emit("message", data.newMessage);
  });

  socket.on('disconnect', () => {
    console.log("User disconnected from room:", socket.id);
  });
});



server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});