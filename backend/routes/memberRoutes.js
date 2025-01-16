import express from "express";


import { body } from "express-validator";
import { getChats, searchUser} from "../controllers/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js"


const router = express.Router();






// any member search route 
router.route("/search").post(
  [
    body("username")
      .notEmpty().withMessage("Username is required")
      .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long")
      
  ],
  authMiddleware,
  searchUser
);


router.route("/chats").get(
  
  authMiddleware,
  getChats
);









export default router;
