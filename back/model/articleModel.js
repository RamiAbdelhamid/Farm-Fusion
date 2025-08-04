const mongoose = require("mongoose");







// Controller to add a new article
/****************************************************************************************/
/****************************************************************************************
 * @desc Add a new article
 * @route POST /api/article
 * @access Public
 * @body {title, titleAr, titleFr, body, bodyAr, bodyFr, author, imageUrl}
 * @returns {Object} {message, article}
 * /****************************************************************************************/
const articleSchema = new mongoose.Schema(
  {
    title: String,
    titleAr: String,
    titleFr: String,
    body: String,
    bodyAr: String,
    bodyFr: String,
    author: String,
    imageUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
