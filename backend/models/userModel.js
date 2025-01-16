import mongoose from 'mongoose';

// Define User Schema
const UserSchema = new mongoose.Schema({

  // Username field
  username: {
    type: String,
    required: [true, 'Username is required'], // Validation error message
    trim: true, // Removes leading/trailing spaces
    minlength: [3, 'Username must be at least 3 characters long'], // Minimum length
  },

  // Email field
  email: {
    type: String,
    required: [true, 'Email is required'], // Validation error message
   
    trim: true, // Removes leading/trailing spaces
    lowercase: true, // Converts email to lowercase
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address' // Validation error message for invalid format
    ],
  },

  // Password field
  password: {
    type: String,
    required: [true, 'Password is required'], // Validation error message
    minlength: [6, 'Password must be at least 6 characters long'], // Minimum length
  },

  // User profile image
  userImage: {
    type: String, // Stores URL or path to the image
    required: false, // Optional
  },

  // Bio field
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters'], // Maximum length
    default: '', // Default to an empty string
  },

  // Array of users this user is following
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References User model
    }
  ],

  // Array of users following this user
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References User model
    }
  ],

  // Array of reviews written by the user
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ratings', // References Ratings model
    }
  ],

  // Array of liked movies
  likedMovies: [
    {
      type: String, // Use String for custom identifiers like `tmdbId`
      ref: 'Movie', // Reference the `Movie` model
    },
  ],
  watchedMovies: [
    {
      type: String, // Same as above
      ref: 'Movie',
    },
  ],

  // Array of lists created by the user
 
}, 
{
  timestamps: true // Automatically add `createdAt` and `updatedAt` timestamps
});

// Create User model
const User = mongoose.model('User', UserSchema);

// Export User model
export default User;
