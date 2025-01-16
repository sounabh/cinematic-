import { validationResult } from "express-validator";
import Ratings from "../models/ratingsModel.js";
import Movie from "../models/moviesSchema.js";
import User from "../models/userModel.js";
import {
  cacheUser,
  getCachedUser,
  invalidateUserCache,
} from "../services/redisCacheServices.js";

// Create a new rating for a movie
const createRating = async (req, res) => {
  try {
    // Validation check
    const errors = validationResult(req);

    // If there are validation errors, return a response with status 400
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Destructure data from the request body and parameters
    const user = req.user;
    const { rating, review } = req.body;
    const { filmId } = req.params;

    // Check for existing rating by this user for this movie
    const existingRating = await Ratings.findOne({
      user: user._id,
      movieId: filmId,
    });

    // If an existing rating is found, delete it
    if (existingRating) {
      // Remove the rating reference from user's ratings array
      await User.findByIdAndUpdate(user._id, {
        $pull: { reviews: existingRating._id },
      });

      // Delete the existing rating
      await Ratings.findByIdAndDelete(existingRating._id);
    }

    // Create a new rating entry in the database
    const newRating = await Ratings.create({
      user: user._id,
      movieId: filmId,
      rating,
      review,
    });

    // Add the new rating reference to user's ratings array
    await User.findByIdAndUpdate(user._id, {
      $push: { reviews: newRating._id },
    });

    const populatedRating = await Ratings.findById(newRating._id)
      .populate("user", "username userImage") // Specify the fields to include
      .exec();

    // Return a success response with the created rating details
    return res.status(201).json({
      success: true,
      message: "Rating created successfully",
      result: populatedRating,
    });
  } catch (error) {
    // If there is an error, send a 500 response with the error message
    console.error("Create rating error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding the rating",
    });
  }
};

// Fetch ratings for a specific movie
const fetchRatings = async (req, res) => {
  try {
    const { filmId } = req.params;

    // Fetch ratings for the specific film and populate user information
    const ratings = await Ratings.find({ movieId: filmId })
      .populate("user", "username userImage") // Adjust fields as needed
      .exec();

    // If no ratings are found, return a response with status 200
    if (!ratings.length) {
      return res.status(200).json({
        success: true,
        message: "No ratings found for the specified film",
      });
    }

    // Return the fetched ratings
    return res.status(200).json({
      success: true,
      message: "Ratings fetched successfully",
      data: ratings,
    });
  } catch (error) {
    // If there is an error, send a 500 response with the error message
    console.error("Fetch ratings error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching ratings",
    });
  }
};

// Like or unlike a movie
const likeMovieController = async (req, res) => {
  try {
    const { filmId } = req.params; // TMDB movie ID
    const userId = req.user.id; // From auth middleware

    const tmdbId = req.body.tmdbId || filmId;

    // Find if the movie exists in our database
    let movie = await Movie.findOne({ tmdbId: filmId });

    // If movie doesn't exist, create it with the data from TMDB
    if (!movie) {
      movie = await Movie.create({
        tmdbId,
        title: req.body.title,
        description: req.body.description,
        releaseDate: req.body.releaseDate,
        genre: req.body.genre,
        duration: req.body.duration,
        posterUrl: req.body.posterUrl,
        likedBy: [],
        watchedBy: [],
        listId: [],
      });
    }

    // Check if the user has already liked the movie
    const isAlreadyLiked = movie.likedBy.includes(userId);

    //console.log(isAlreadyLiked);

    if (isAlreadyLiked) {
      // Unlike: Remove the user from likedBy array
      await Movie.findByIdAndUpdate(
        movie.id,
        { $pull: { likedBy: userId } },
        { new: true }
      );

      // Remove the movie from the user's liked list
      const setUser1 = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { likedMovies: tmdbId },
        },
        { new: true }
      );

      const setUser = await setUser1.populate({
        path: "watchedMovies",
        model: Movie,
        localField: "watchedMovies",
        foreignField: "tmdbId",
        select: "tmdbId posterUrl title  releaseDate",
      });

      //console.log(setUser);

      const result = await cacheUser(setUser.id, setUser);
      //console.log(result);

      return res.status(200).json({
        success: true,
        message: "Movie unliked successfully",
        isLiked: false,
      });
    } else {
      // Like: Add the user to likedBy array
      await Movie.findByIdAndUpdate(
        movie._id,
        { $addToSet: { likedBy: userId } },
        { new: true }
      );

      // Add the movie to the user's liked movies list
      const setUser1 = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { likedMovies: tmdbId },
        },
        { new: true }
      );

      const setUser = await setUser1.populate({
        path: "watchedMovies",
        model: Movie,
        localField: "watchedMovies",
        foreignField: "tmdbId",
        select: "tmdbId posterUrl title  releaseDate",
      });

      const result = await cacheUser(setUser.id, setUser);
      // console.log("r",result);

      return res.status(200).json({
        success: true,
        message: "Movie liked successfully",
        isLiked: true,
      });
    }
  } catch (error) {
    console.error("Error in toggleMovieLike:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Mark a movie as watched or unwatched
const watchedMovieController = async (req, res) => {
  try {
    const { filmId } = req.params; // TMDB movie ID
    const userId = req.user.id; // From auth middleware

    const tmdbId = req.body.tmdbId || filmId;

    // Find if the movie exists in our database
    let movie = await Movie.findOne({ tmdbId: filmId });

    // If movie doesn't exist, create it with the data from TMDB
    if (!movie) {
      movie = await Movie.create({
        tmdbId,
        title: req.body.title,
        description: req.body.description,
        releaseDate: req.body.releaseDate,
        genre: req.body.genre,
        duration: req.body.duration,
        posterUrl: req.body.posterUrl,
        likedBy: [],
        watchedBy: [],
        listId: [],
      });
    }

    // Check if the user has already watched the movie
    const isAlreadyWatched = movie.watchedBy.includes(userId);

    if (isAlreadyWatched) {
      // Remove user from watchedBy array
      await Movie.findByIdAndUpdate(
        movie._id,
        { $pull: { watchedBy: userId } },
        { new: true }
      );

      // Remove the movie from the user's watched list
      const setUser1 = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { watchedMovies: tmdbId },
        },
        { new: true }
      );

      const setUser = await setUser1.populate({
        path: "watchedMovies",
        model: Movie,
        localField: "watchedMovies",
        foreignField: "tmdbId",
        select: "tmdbId posterUrl title  releaseDate",
      });
      //await invalidateUserCache()

      const result = await cacheUser(setUser.id, setUser);
      // console.log("r",result);

      return res.status(200).json({
        success: true,
        message: "Movie unwatched successfully",
        isWatched: false,
      });
    } else {
      // Add user to watchedBy array
      await Movie.findByIdAndUpdate(
        movie.id,
        { $addToSet: { watchedBy: userId } },
        { new: true }
      );

      // Add the movie to the user's watched movies list
      const setUser1 = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { watchedMovies: tmdbId },
        },
        { new: true }
      );
      //await invalidateUserCache()
      //console.log(setUser.id);
      //console.log(setUser);

      const setUser = await setUser1.populate({
        path: "watchedMovies",
        model: Movie,
        localField: "watchedMovies",
        foreignField: "tmdbId",
        select: "tmdbId posterUrl title  releaseDate",
      });

      const result = await cacheUser(setUser.id, setUser);
      // console.log("r",result);

      return res.status(200).json({
        success: true,
        message: "Movie watched successfully",
        isWatched: true,
      });
    }
  } catch (error) {
    console.error("Error in toggleMovieWatch:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// Get like status of a movie for the current useraa
/*const getLikeMovieController = async (req, res) => {
    try {
        const { filmId } = req.params;
        const userId = req.user._id;

        const movie = await Movie.findOne({ tmdbId: filmId });

        // If movie doesn't exist, it's not liked by the user
        if (!movie) {
            return res.status(200).json({
                success: true,
                isLiked: false
            });
        }

        // Check if user has liked the movie
        const isLiked = movie.likedBy.includes(userId);

        return res.status(200).json({
            success: true,
            isLiked
        });

    } catch (error) {
        console.error('Error in getLikeStatus:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error
        });
    }
};

// Get watch status of a movie for the current user
const getWatchMovieController = async (req, res) => {
    try {
        const { filmId } = req.params;
        const userId = req.user._id;

        const movie = await Movie.findOne({ tmdbId: filmId });

        // If movie doesn't exist, it's not watched by the user
        if (!movie) {
            return res.status(200).json({
                success: true,
                isWatched: false
            });
        }

        // Check if user has watched the movie
        const isWatched = movie.watchedBy.includes(userId);

        return res.status(200).json({
            success: true,
            isWatched
        });

    } catch (error) {
        console.error('Error in getWatchStatus:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

*/

const getInteractedMovieControllerCache = async (req, res) => {
  try {
    const { filmId } = req.params;
    const userId = req.user.id;

    const movie = await Movie.findOne({ tmdbId: filmId });

    // If movie doesn't exist, it's not liked by the user
    if (!movie) {
      return res.status(200).json({
        success: true,
        isLiked: false,
        isWatched: false,
      });
    }

    const userInteraction = await getCachedUser(userId);

    //console.log("cache of interatiob",userInteraction);

    // Check if user has liked the movie
    const isLiked = userInteraction.likedMovies.includes(filmId);
    const isWatched = userInteraction.watchedMovies.some(
      (movie) => movie.tmdbId === filmId
    );

    return res.status(200).json({
      success: true,
      isLiked,
      isWatched,
    });
  } catch (error) {
    console.error("Error in getLikeStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const getWatchedLikedMovies = async (req, res) => {
  try {
    // Extract user from request
    const user = req.user;

    // Check if user exists
    if (!user || !user.id) {
      return res
        .status(400)
        .json({ error: "User not authenticated or user ID missing" });
    }

    const cachedUser = await getCachedUser(user.id);
    //console.log(cachedUser);

    if (cachedUser.watchedMovies[0].tmdbId) {
      //console.log("cache");

      return res.status(200).json({
        watchedMovies: cachedUser.watchedMovies,
        likedMovies: cachedUser.likedMovies,
      });
    }

    // Fetch the user and populate watched and liked movies
    const getuser = await User.findById(user.id).populate({
      path: "likedMovies watchedMovies",
      model: Movie,
      // Match the tmdbId field with the stored string ID
      localField: "likedMovies watchedMovies",
      foreignField: "tmdbId",
    });

    // Check if user is found
    if (!getuser) {
      return res.status(404).json({ error: "User not found" });
    }

    //console.log(getuser);

    // Send the response with user data
    return res.status(200).json({
      watchedMovies: getuser.watchedMovies,
      likedMovies: getuser.likedMovies,
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching watched and liked movies:", error);

    // Send an error response
    return res.status(500).json({ error: "An internal server error occurred" });
  }
};

export {
  fetchRatings,
  createRating,
  likeMovieController,
  watchedMovieController,
  getWatchedLikedMovies,
  getInteractedMovieControllerCache,
};
