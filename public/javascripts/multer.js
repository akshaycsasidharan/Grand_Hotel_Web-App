const multer = require("multer");

// handle storage using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images/sign-images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_" + file.originalname);
    },
  });
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
  });
  

module.exports = {
  upload,
  
};