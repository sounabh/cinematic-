import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";




// Recreate `__dirname` for ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




// Configure multer storage
const storage = multer.diskStorage({
  // Set the destination folder for uploaded files
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Save files to the "uploads" directory
  },

  // Set the filename to ensure uniqueness
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`; // Prefix filename with a timestamp
    cb(null, uniqueName); // Avoid overwriting files with the same name
  },
});




// Initialize multer with the configured storage
const upload = multer({ storage });




// Export the multer instance for use in routes
export default upload;
