import mongoose from "mongoose";

const { Schema } = mongoose;

// Define Movie Schema
const movieSchema = new Schema(
  {
    // The unique identifier for the movie from TMDB (The Movie Database)
    tmdbId: {
      type: String,
      required: true, // TMDB ID is mandatory
    },

    // Title of the movie
    title: {
      type: String,
      required: true, // Movie title is mandatory
      trim: true, // Remove extra whitespace
    },

    // Description or summary of the movie
    description: {
      type: String,
      required: true, // Description is mandatory
    },

    // Movie release date
    releaseDate: {
      type: Date,
      required: true, // Release date is mandatory
    },

    // Movie genres (e.g., Action, Comedy)
    genre: [
      {
        type: String,
        required: true, // At least one genre is mandatory
      },
    ],

    // Duration of the movie in minutes
    duration: {
      type: Number,
      required: true, // Duration is mandatory
    },

    // URL for the movie poster
    posterUrl: {
      type: String, // Optional field for storing the poster image URL
    },

  

    // Users who have watched this movie
    watchedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the User model
      },
    ],

    // Users who liked this movie
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the User model
      },
    ],

    // Lists this movie belongs to
   

    // Timestamps for record creation and updates
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set to the current date/time
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Automatically set to the current date/time
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

// Create and export the Movie model
const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
