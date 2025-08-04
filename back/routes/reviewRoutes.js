// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controller/reviewController");
const verifyToken = require("..//middleware/authMiddleware");

// Get all reviews for a product
router.get("/product/:productId", reviewController.getProductReviews);

// Create a new review (requires authentication)
router.post("/product/:productId", verifyToken, reviewController.createReview);

// Update a review (requires authentication)
router.put("/:reviewId", verifyToken, reviewController.updateReview);

// Delete a review (requires authentication)
router.delete("/:reviewId", verifyToken, reviewController.deleteReview);

// Get the average rating for a product
router.get("/happy-clients", reviewController.getHappyClientsCount);


module.exports = router;
