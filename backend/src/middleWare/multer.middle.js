import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define upload path for development
const uploadPath = path.resolve("D:/public"); // Fix Windows path


  // ✅ Create folder if it doesn't exist
  if (!fs.existsSync(uploadPath)) {
    console.log("Creating public folder...");
    try {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log("Folder created successfully.");
    } catch (error) {
      console.error("Error creating folder:", error.message);
    }
  } else {
    console.log("Public folder already exists.");
  }


// Configure Multer storage based on environment
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
})

export const upload = multer({
  storage
});
