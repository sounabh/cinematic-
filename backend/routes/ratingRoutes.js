import express from "express";
import {
  createRating,
  fetchRatings,
  likeMovieController,
  
  watchedMovieController,
  getInteractedMovieControllerCache
 
  
} from "../controllers/ratingController.js";
import { body } from "express-validator"; // Validation middleware
import authMiddleware from "../middleware/authMiddleware.js"; // Authentication middleware




const router = express.Router();




// Route: Create a review/rating for a movie
router.post(
  "/:filmId", // `filmId` identifies the movie for which the rating is being created

  // Validation middleware to ensure proper rating and review structure
  [
    body("rating")
      .notEmpty().withMessage("Rating is required")
      .isFloat({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
    
    body("review")
      .optional() // Review is optional
      .isLength({ max: 500 }).withMessage("Review must not exceed 500 characters")
      .trim(), // Remove extra spaces
  ],
  
  authMiddleware, // Protect the route to ensure only authenticated users can create ratings
  createRating // Controller to handle the creation of a rating
);




// Route: Get ratings for a specific movie
router.get(
  "/:filmId", // `filmId` identifies the movie whose ratings are being fetched
  fetchRatings // Controller to retrieve ratings for the movie
);




// Route: Like/unlike a movie
router.post(
  "/:filmId/like", // Endpoint for liking a movie
  authMiddleware, // Ensure the user is authenticated
  likeMovieController // Controller to handle like status
);

/*router.get(
  "/:filmId/like", // Endpoint for getting like status of a movie
  authMiddleware, // Ensure the user is authenticated
  getLikeMovieController // Controller to fetch the like status
);
*/


router.route("/:filmId/interactions").get(authMiddleware,getInteractedMovieControllerCache)

// Route: Mark/unmark a movie as watched

router.post(
  "/:filmId/watch", // Endpoint to mark a movie as watched
  authMiddleware, // Ensure the user is authenticated
  watchedMovieController // Controller to handle watch status
);

/*router.get(
  "/:filmId/watch", // Endpoint to get watched status of a movie
  authMiddleware, // Ensure the user is authenticated
  getWatchMovieController // Controller to fetch the watched status
);

*/


// Export the router
export default router;
