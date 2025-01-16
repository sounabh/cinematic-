import mongoose from "mongoose";
import User from "../models/userModel.js";
import Chat from "../models/ChatSchema.js";



export const connectDb = async () => {

await mongoose.connect(process.env.MONGODB_URI)
//console.log("Database connected succesfully");


//console.log( await Chat.collection.indexes());
/*Chat.collection.dropIndex('chatId_1', (err) => {
    if (err) {
      console.log('Error dropping index:', err);
    } else {
      console.log('Index dropped successfully');
    }
  });
*/


}