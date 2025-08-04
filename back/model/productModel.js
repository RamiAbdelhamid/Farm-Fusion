const mongoose = require("mongoose");



  // Define the product schema
  // This schema defines the structure of the product data in the database
  // It includes fields for name, description, price, category, details, image, isDeleted status, average rating, review count, and language-specific fields
  // The name field is the name of the product
  // The description field is a brief description of the product
  // The price field is the cost of the product
  // The category field is the category to which the product belongs
  // The details field is a detailed description of the product
  // The image field is the URL of the product image
  // The isDeleted field indicates whether the product is deleted or not
  // The average rating field is the average rating of the product
  // The review count field is the number of reviews for the product
  // The nameAr field is the Arabic name of the product
  // The descriptionAr field is the Arabic description of the product
  // The detailsAr field is the Arabic details of the product
  // The categoryAr field is the Arabic category of the product
  // The nameFr field is the French name of the product
  // The descriptionFr field is the French description of the product
  // The detailsFr field is the French details of the product
  // The categoryFr field is the French category of the product
  //  * @returns {Object} {message, product}
  //  * /****************************************************************************************/
// /****************************************************************************************/
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameAr: { type: String, required: true }, // ✅ جديد

  description: { type: String, required: true },
  descriptionAr: { type: String, required: true }, // ✅ جديد

  price: { type: Number, required: true },

  category: { type: String, required: true },
  categoryAr: { type: String, required: true }, // ✅ جديد

  details: { type: String, required: true },
  detailsAr: { type: String, required: true }, // ✅ جديد

  image: { type: String, required: true },

  isDeleted: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  nameFr: String,
  descriptionFr: String,
  detailsFr: String,
  categoryFr: String,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
