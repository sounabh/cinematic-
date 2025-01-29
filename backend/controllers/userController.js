import { validationResult } from "express-validator";
import User from "../models/userModel.js";
import {
  hashedPassword,
  genToken,
  comparePassword,
} from "../services/authServices.js";
import { cacheUser, getCachedUser, invalidateUserCache } from "../services/redisCacheServices.js";
import Movie from "../models/moviesSchema.js";


// Register a new user
const registerUser = async (req, res) => {
  // Validate input fields
  const errors = validationResult(req);

  // If there are validation errors, return them in the response
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extracting the fields from the request body
    const { username, email, password } = req.body;

    // Hash the password before saving it
    const SafePassword = await hashedPassword(password);

    // Check if the user already exists by email
    const getUser = await User.findOne({ email });

    // If user already exists, send an error response
    if (getUser) {
      return res.status(401).json({ message: "User is already registered" });
    }

    // Create a new user in the database
    const user = await User.create({ username, email, password: SafePassword });

    // Generate a token for the new user
    //const token = genToken(user._id);

    // Respond with success and the token
    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    // In case of error, send a 500 server error
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Login a user
const loginUser = async (req, res) => {
  // Validate input fields
  const errors = validationResult(req);

  // If there are validation errors, return them in the response
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extracting the fields from the request body
    const { email, password } = req.body;

    // console.log(email,password);

    // Find the user by email
    const user = await User.findOne({ email });

    //console.log(user);

    // If user does not exist, send an error response
    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "User is not registered" });
    }

    // Compare the password provided with the stored hashed password
    const isMatched = await comparePassword(password, user.password);

    // If password matches, generate a token and send the response
    if (isMatched) {
      //caxhed the user

      const cachedUser = await getCachedUser(user.id);

    //  console.log("chachedUser from login",cachedUser);

      if (cachedUser) {
        const token = genToken(user.id);

        return res.status(200).json({
          success: true,
          message: "User logged in successfully",
          user: {
            _id: user.id,
            username: user.username,
            email: user.email,
          },
          token,
        });
      } else {
        const token = genToken(user.id);
        invalidateUserCache(user.id)
        await cacheUser(user.id, user);
        return res.status(200).json({
          success: true,
          message: "User logged in successfully",
          user: {
            _id: user.id,
            username: user.username,
            email: user.email,
          },
          token,
        });
      }
    } else {
      // If password does not match, send an error response
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    // In case of error, send a 500 server error
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  // Validate input fields
  const errors = validationResult(req);

  // If there are validation errors, return them in the response
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    // Extracting the fields from the request body
    const { username, password, bio } = req.body;

    // Handle uploaded image using multer (if exists)
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Initialize variable for hashed password (if updated)
    let SafePassword;

    // Only hash the password if the user provided a new one
    if (password) {
      SafePassword = await hashedPassword(password);
    }

    // Prepare the update object with only non-null values
    const updateFields = {};

    if (username && username.trim() !== "")
      updateFields.username = username.trim();
    if (SafePassword) updateFields.password = SafePassword;
    if (imagePath) updateFields.userImage = imagePath;
    if (bio && bio.trim() !== "") updateFields.bio = bio.trim();

    // If no fields are provided for update, send a message
    if (Object.keys(updateFields).length === 0) {
      return res.status(200).json({
        success: true,
        message: "No valid fields to update",
      });
    }

    // Update the user's details in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate({
      path: "watchedMovies",
      model: Movie,
      localField: "watchedMovies",
      foreignField: "tmdbId",
      select: "tmdbId posterUrl title releaseDate"
    });

    // If the user is not found, send an error response
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

//console.log(updatedUser);


    //await invalidateUserCache(req.user.id);
     await cacheUser(req.user.id, updatedUser);

    // Respond with the updated user profile
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",   
      user: updatedUser,
    });
  } catch (error) {
    // In case of error, send a 500 server error
    console.error("Error updating profile:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  // Get the authenticated user from the request
  const user = req.user;
  // console.log(user);

  // console.log(user);

  // If no user is found, send a forbidden response
  if (!user) {
    return res
      .status(403)
      .json({ success: false, message: "Can't get profile" });
  }

  try {
    // Retrieve the user info from the database, including references to watched movies, reviews, liked movies, and lists

    // const cachedUserInfo = await getCachedUser(user.id);

    //console.log("c",cachedUserInfo);

    const cachedUser = await getCachedUser(user.id);
    //console.log(cachedUser);

    // console.log("cached user from profile route", cachedUser.watchedMovies[0]?.tmdbId);

    
    if (cachedUser.watchedMovies[0]?.tmdbId) {
      return res.status(200).json({ userInfo: cachedUser });
    }

    const userInfo = await User.findById(user.id).populate({
      path: "watchedMovies",
      model: Movie,
      localField: "watchedMovies",
      foreignField: "tmdbId",
      select: "tmdbId posterUrl title  releaseDate",
    });

    ////console.log("u",user);

    await cacheUser(user.id, userInfo);
    return res.status(200).json({ userInfo });
    //const cachedUser = await getCachedUser(user.id)

    // console.log(user._id);

    // Cache the result

    //console.log("u",userInfo);

    // Respond with the populated user profile data
    //return res.status(200).json({ userInfo });
  } catch (error) {
    // In case of error, send a 500 server error
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Export the functions for use in routes
export { registerUser, loginUser, updateProfile, getProfile };
