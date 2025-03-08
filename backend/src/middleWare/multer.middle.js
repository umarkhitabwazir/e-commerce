import multer from "multer";



// Configure Multer storage based on environment
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('file',file)
    cb(null, '');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
})

export const upload = multer({
  storage
});
