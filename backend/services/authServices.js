import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";




// Function to hash a password
const hashedPassword = async (password) => {
  // Generate a salted and hashed version of the password
  const encryptedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds for encryption strength
  return encryptedPassword; // Return the hashed password
};




// Function to generate a JWT token
const genToken = (id) => {
  // Sign the token with the user ID and a secret key
  const token = jsonwebtoken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Optional: Add expiration for token security
  });
  return token; // Return the signed token
};




// Function to compare plain text password with hashed password
const comparePassword = async (password, safePassword) => {
  // Use bcrypt to verify if the password matches the hashed password
  const isMatched = await bcrypt.compare(password, safePassword);
  return isMatched; // Return true if matched, otherwise false
};




// Export the utility functions
export { hashedPassword, genToken, comparePassword };
