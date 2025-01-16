import Movie from "../models/moviesSchema.js";
import User from "../models/userModel.js";
import { validationResult } from "express-validator";
import { cacheUser, getCachedUser } from "../services/redisCacheServices.js";
import Chat from "../models/ChatSchema.js";

//searchUser a specific user
const searchUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  try {
    // Check for validation errors

    const { username } = req.body;

    const user = req.user;

    if (username === user.username) {
      return res.status(401).json({
        success: false,
        message: "cant find your own account",
      });
    }

    // Find all users with the same username
    const users = await User.find({
      username: {
        $regex: new RegExp(`^${username}$`, "i"), // Case insensitive exact match
      },
    });
    //console.log(users);

    // Check if we found any users
    if (users.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No users found with this username",
      });
    }

    // Check if we found multiple users
    if (users.length > 1) {
      return res.status(200).json({
        success: true,
        message: "Multiple users found with the same username",
        count: users.length,
        users: users,
      });
    }

    // If only one user found
    return res.status(200).json({
      success: true,
      message: "One user found",
      count: users.length,
      users: users,
    });
  } catch (error) {
    console.error("Error in searchUser controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    //const authUser = req.user;
    //console.log("U",userId);

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const cahchedUser = await getCachedUser(userId);
    //console.log(cahchedUser);

    if (cahchedUser.watchedMovies[0]?.tmdbId) {
      return res.status(200).json({
        success: true,
        message: "User found successfully",
        data: cahchedUser,
      });
    }
    // Find user by ID
    const user = await User.findById(userId).populate({
      path: "watchedMovies",
      model: Movie,
      localField: "watchedMovies",
      foreignField: "tmdbId",
      select: "tmdbId posterUrl title description releaseDate",
    });

    //console.log("us",user);

    // If user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await cacheUser(user.id, user);

    // Return user data if found
    return res.status(200).json({
      success: true,
      message: "User found successfully",
      data: user,
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Handle other errors
    console.error("Error in getUser controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getReceiverProfile = async (req, res) => {
  try {
    // 1. Extract sender from authenticated request and IDs from params
    const sender = req.user; // Assumes middleware attaches authenticated user to req.user
    const chatId = req.params.chatId; // Example: '6782659e38a10a80cc2c3c2e_67827a69ca5f30763444cf8c'

    // 2. Split the `chatId` into two IDs
    const ids = chatId.split("_"); // ['6782659e38a10a80cc2c3c2e', '67827a69ca5f30763444cf8c']

    // 3. Validate inputs
    if (!ids || ids.length !== 2) {
      return res
        .status(400)
        .json({ error: "Invalid chat ID format. Provide a valid chat ID." });
    }

    if (!sender || !sender._id) {
      return res.status(401).json({ error: "Unauthorized. Sender not found." });
    }

    // 4. Determine the receiver's ID
    const senderId = sender._id.toString();

    let receiverId;

    if (ids.includes(senderId)) {
      receiverId = ids.find((id) => id !== senderId);
    } else {
      return res
        .status(400)
        .json({ error: "Sender ID does not match any provided IDs." });
    }

    // 5. Fetch the receiver's profile
    const receiver = await User.findById(receiverId);

    // 6. Validate receiver existence
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found." });
    }
   // console.log(req.user._id);

    // 7. Check if the chat already exists
    const existingChat = await Chat.findOne({ senderId: senderId });

  //  console.log(existingChat?.senderId.toString() === req.user._id.toString());

    // 8. If chat exists, return it, else create a new one
    if (
      existingChat &&
      existingChat.senderId.toString() === req.user._id.toString()
    ) {
      return res.status(200).json({ sender, receiver, chat: existingChat });

    } else {
      const chatCreation = await Chat.create({
        chatId: chatId,
        senderId: sender._id, // Use sender._id for consistency
        receiverId: receiver._id, // Ensure receiverId is properly set
      });
      //console.log("Chat created:", chatCreation);
      return res.status(201).json({ sender, receiver, chat: chatCreation });
    }
  } catch (error) {
    // 9. Handle unexpected errors
    console.error("Error in getReceiverProfile:", error);
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
};

const ToggleFollowUser = async (req, res) => {
  try {
    const userToToggle = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id); // fom our auth middleware

    if (!userToToggle || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current user is already following the target user
    const isFollowing = currentUser.following.includes(userToToggle.id);

    if (isFollowing) {
      // Unfollow the user
      const selfupdation = await User.findByIdAndUpdate(
        currentUser.id,
        {
          $pull: { following: userToToggle.id },
          $inc: { followingCount: -1 },
        },
        { new: true }
      );

      await cacheUser(currentUser.id, selfupdation);

      const userupdation = await User.findByIdAndUpdate(
        userToToggle.id,
        {
          $pull: { followers: currentUser.id },
          $inc: { followersCount: -1 },
        },
        { new: true }
      );

      await cacheUser(userToToggle.id, userupdation);

      return res.json({ message: "Successfully unfollowed user" });
    } else {
      // Follow the user
      const updation = await User.findByIdAndUpdate(
        currentUser.id,
        {
          $push: { following: userToToggle.id },
          $inc: { followingCount: 1 },
        },
        { new: true }
      );

      await cacheUser(currentUser.id, updation);

      const userupdation = await User.findByIdAndUpdate(
        userToToggle.id,
        {
          $push: { followers: currentUser.id },
          $inc: { followersCount: 1 },
        },
        { new: true }
      );

      await cacheUser(userToToggle.id, userupdation);

      return res.json({ message: "Successfully followed user" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getChats = async (req, res) => {
  try {
    const senderId = req.user._id;
    // console.log("Sender ID from request:", senderId);

    // Ensure senderId is in the correct format (ObjectId)

    // Fetch chats and populate receiver's username and userImage
    const chats = await Chat.find({ senderId: senderId }).populate(
      "receiverId",
      "username userImage"
    ); // Populate receiver's details

    //console.log("Chats fetched with populated receiver data:", chats);

    if (!chats || chats.length === 0) {
      return res.status(200).json({ message: "No chats found", chats: [] });
    } else {
      return res.status(200).json({ chats });
    }
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
export { searchUser, getUser, getReceiverProfile, ToggleFollowUser, getChats };
