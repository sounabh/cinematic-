import express from "express";
import upload from "../uploads/multer.js"; // Middleware for file uploads
import { registerUser, loginUser, updateProfile, getProfile } from "../controllers/userController.js";
import { body } from "express-validator"; // Validation middleware
import authMiddleware from "../middleware/authMiddleware.js"; // Authorization middleware
import { ToggleFollowUser, getReceiverProfile, getUser } from "../controllers/messageController.js";
import { getWatchedLikedMovies } from "../controllers/ratingController.js";




const router = express.Router();




router.route("/checktoken").post(authMiddleware,(req,res)=>{

if(req.user){

  return res.status(200)

}
else{
  return res.status(500)
}

})

// Route: Register a new user
router.route("/register").post(
  // Validation middleware for input data
  [
    body("username")
      .notEmpty().withMessage("Username is required")
      .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long")
      .trim(),

    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Please provide a valid email address")
      .normalizeEmail(),

    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],
  
  registerUser // Controller function for handling user registration
);




// Route: Log in a user
router.route("/login").post(
  // Validation middleware for login credentials
  [
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Please provide a valid email address")
      .normalizeEmail(),
    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],

  loginUser // Controller function for user login
);







// Route: Update current user profile
router.route("/profile").put(
  upload.single("imageFile"), // Handle image uploads using multer
  
  // Validation for optional fields
  [
    body("username")
      .optional({ checkFalsy: true }) // Only validate if field is provided
      .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long")
      .trim(),
    body("password")
      .optional({ checkFalsy: true })
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],
  
  authMiddleware, // Ensure the user is authenticated
  updateProfile // Controller function to update the profile
);




// Route: Get current user profile
router.route("/profile").get(
  authMiddleware, // Ensure the user is authenticated
  getProfile // Controller function to retrieve profile details
);




// Route: Get a specific user by userId
router.route("/profile/:userId").get(
  authMiddleware,
  getUser // Controller function to retrieve a specific user's profile
);



//when user hit this router follow logic from database will toggled
router.route("/profile/:userId/follow").post(authMiddleware,ToggleFollowUser)



router.route("/message/:chatId").get(authMiddleware,getReceiverProfile)





router.route("/lists").get(authMiddleware,getWatchedLikedMovies)

// Export the router
export default router;
