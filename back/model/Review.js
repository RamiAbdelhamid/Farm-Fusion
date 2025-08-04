// models/Review.js
const mongoose = require("mongoose");







// Define the review schema
// This schema defines the structure of the review data in the database
// It includes fields for product, user, rating, comment, userName, and userAvatar
// The product field is a reference to the Product model
// The user field is a reference to the User model
// The rating field is a number between 1 and 5
// The comment field is a string containing the review comment
// The userName field is the name of the user who wrote the review
// The userAvatar field is a string representing the URL of the user's avatar
// The timestamps option adds createdAt and updatedAt fields to the schema
//  * @returns {Object} {message, review}
//  * /****************************************************************************************/
// /****************************************************************************************/
const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
      default: "/images/default-avatar.png",
    },
  },
  { timestamps: true }
);

// Add a compound index to prevent multiple reviews from the same user for the same product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);
