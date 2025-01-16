import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import userRouter from "./routes/userRoutes.js";
import ratingRouter from "./routes/ratingRoutes.js";
import memberRouter from "./routes/memberRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authMiddleware from "./middleware/authMiddleware.js";




// Recreate `__dirname` for ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




// Initialize express app
const app = express();




// Load environment variables
dotenv.config();




// Connect to the database
connectDb();




// Set up CORS to allow requests from the frontend
const allowedOrigins = [
  'https://12angrymen.vercel.app', 
    'http://localhost:3000' // //  frontend
   // Ngrok frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or CURL requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies or authorization headers
  })
);



// Middleware for logging HTTP requests
//app.use(morgan("dev"));




// Middleware for parsing JSON and URL-encoded data
app.use(express.json()); // Parse incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data




// Middleware for parsing cookies
app.use(cookieParser());




// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




// Define application routes
app.use("/",userRouter);         // Routes for user-related operations
app.use("/films", ratingRouter); // Routes for film ratings
app.use("/members", memberRouter); // Routes for member-related operations




// Export the express app for use in other modules
export default app;
