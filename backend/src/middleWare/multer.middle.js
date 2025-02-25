import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const uploadPath = path.join("D:\public");
console.log("Calculated Upload Path:", uploadPath);
console.log('fs.existsSync(uploadPath)',fs.existsSync(uploadPath))
// ✅ Create folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  console.log("Creating public folder...");
  try {
    fs.mkdirSync(uploadPath, { recursive: true });  // Create folder and any necessary parent directories
    console.log("Folder created successfully.");
  } catch (error) {
    console.error("Error creating folder:", error.message);  // Log error if folder creation fails
  }
} else {
  console.log("Public folder already exists.");
}

const storage = multer.diskStorage(
    {
    destination: function (req, file, cb) {
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
              
      cb(null, file.originalname)
    }
  }
)
  
export const upload = multer({storage})



// import multer from "multer";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// // Fix for ES Module (`__dirname` alternative)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Define the correct path to the `public/` folder (outside `src/`)
// const uploadPath = path.join(__dirname, "../../public"); // Adjust to point to `backend/public`

// console.log("Calculated Upload Path:", uploadPath);  // Log the path to verify

// // ✅ Create folder if it doesn't exist
// if (!fs.existsSync(uploadPath)) {
//   console.log("Creating public folder...");
//   try {
//     fs.mkdirSync(uploadPath, { recursive: true });  // Create folder and any necessary parent directories
//     console.log("Folder created successfully.");
//   } catch (error) {
//     console.error("Error creating folder:", error.message);  // Log error if folder creation fails
//   }
// } else {
//   console.log("Public folder already exists.");
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadPath); // Correct path to store files in `backend/public/`
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); // Retain original file name
//   }
// });

// export const upload = multer({ storage });
