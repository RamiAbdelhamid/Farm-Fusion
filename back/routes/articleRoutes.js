const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getAllArticles,
  addArticle,
} = require("../controller/articleController");




// Set up multer for file uploads
/****************************************************************************************/
/****************************************************************************************/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/articles");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
/****************************************************************************************/
/****************************************************************************************/

// initialize multer with the storage configuration
const upload = multer({ storage });



// Route to get all articles
router.get("/", getAllArticles);

// Route to add a new article
router.post("/", upload.single("image"), addArticle);





module.exports = router;
