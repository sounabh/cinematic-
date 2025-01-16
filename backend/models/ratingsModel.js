import mongoose from "mongoose";

// Rating Schema
const ratingSchema = new mongoose.Schema(
  {
    // Reference to the user who submitted the rating
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links to the User model
      required: true, // User is mandatory for a rating
    },

    // Movie identifier
    movieId: {
      type: String, // Stores the movie ID (can be from an external API)
      required: true, // Movie ID is mandatory
    },

    // Rating value
    rating: {
      type: Number,
      required: true, // Rating is mandatory
      min: 1, // Minimum rating value
      max: 5, // Maximum rating value
    },

    // Optional review text
    review: {
      type: String, // Text content of the review
      maxLength: 500, // Limit review length to 500 characters
    },

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

// Ensure a user can only rate a specific movie once
ratingSchema.index({ user: 1, movieId: 1 }, { unique: true });

// Create and export the Ratings model
const Ratings = mongoose.model('Ratings', ratingSchema);
export default Ratings;
