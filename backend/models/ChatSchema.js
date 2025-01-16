import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Create a schema for storing a chat message
const chatSchema = new Schema(
  {
    chatId: { 
      type: String, 
      required: true, 
    
    },
    senderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true // Reference to the sender's user document
    },
    receiverId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true // Reference to the receiver's user document
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Create a model based on the schema
const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
