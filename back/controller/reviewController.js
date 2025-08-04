// controllers/reviewController.js
const Review = require("../model/Review");
const Product = require("../model/productModel");
const User = require("../model/user");
const mongoose = require("mongoose");






// Get all reviews for a product
/****************************************************************************************/
/****************************************************************************************
 * @desc Get all reviews for a product
 * @route GET /api/review/:productId
 * @access Public
 * @params {productId}
 * @returns {Object} {message, reviews}
 * ****************************************************************************************/
/****************************************************************************************/
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const reviews = await Review.find({ product: productId })
      .sort({ createdAt: -1 })
      .populate("user", "name avatar");

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
/****************************************************************************************/
/****************************************************************************************/







// Create a new review
/****************************************************************************************/
/****************************************************************************************
 * @desc Create a new review
 * @route POST /api/review/:productId
 * @access Private
 * @params {productId}
 * @body {rating, comment}
 * @returns {Object} {message, review}
 * ****************************************************************************************/
/****************************************************************************************/
exports.createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    // Get user details from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new review with user details
    // In the createReview function, update this part:
    const review = new Review({
      product: productId,
      user: userId,
      rating,
      comment,
      userName: user.name,
      userAvatar: user.profilePicture, // Make sure this matches your User model

      
    });
    console.log("User data:", {
      name: user.name,
      profilePicture: user.profilePicture,
    });

    await review.save();
    await updateProductRating(productId);

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
/****************************************************************************************/
/****************************************************************************************/

















// Update a review
/****************************************************************************************/
/****************************************************************************************
 * @desc Update a review
 * @route PUT /api/review/:reviewId
 * @access Private
 * @params {reviewId}
 * @body {rating, comment}
 * @returns {Object} {message, review}
 * ****************************************************************************************/
/****************************************************************************************/
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    // Find the review
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user owns this review
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    // Update product average rating
    await updateProductRating(review.product);

    res.status(200).json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
/****************************************************************************************/
/****************************************************************************************/











// Delete a review
/****************************************************************************************/
/****************************************************************************************
 * @desc Delete a review
 * @route DELETE /api/review/:reviewId
 * @access Private
 * @params {reviewId}
 * @returns {Object} {message}
 * ****************************************************************************************/
/****************************************************************************************/
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    // Find the review
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user owns this review or is an admin
    if (review.user.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const productId = review.product;

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    // Update product average rating
    await updateProductRating(productId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
/****************************************************************************************/
/****************************************************************************************/













// Helper function to update product's average rating
/****************************************************************************************/
/****************************************************************************************
 * @desc Update product's average rating
 * @params {productId}
 * @returns {void}
 * ****************************************************************************************/
/****************************************************************************************/
async function updateProductRating(productId) {
  try {
    const reviews = await Review.find({ product: productId });

    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        reviewCount: 0,
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);

    await Product.findByIdAndUpdate(productId, {
      averageRating: parseFloat(averageRating),
      reviewCount: reviews.length,
    });
  } catch (error) {
    console.error("Error updating product rating:", error);
    throw error;
  }
}
/****************************************************************************************/
/****************************************************************************************/











// Get happy clients count
/****************************************************************************************/
/****************************************************************************************
 * @desc Get happy clients count (rating >= 3)
 * @route GET /api/review/happy-clients
 * @access Public
 * @returns {Object} {success, count}
 * ****************************************************************************************/
/****************************************************************************************/
exports.getHappyClientsCount = async (req, res) => {
  try {
    const happyClients = await Review.distinct("user", { rating: { $gte: 4 } });
    res.json({
      success: true,
      count: happyClients.length,
    });
  } catch (error) {
    console.error("Error fetching happy clients:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
/****************************************************************************************/
/****************************************************************************************/