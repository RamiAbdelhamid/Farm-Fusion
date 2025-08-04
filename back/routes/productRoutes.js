const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");


// Route to add a new product
router.post("/products", productController.addProduct);



// Route to get all products
router.get("/products", productController.getProducts);



// Route to get all products for a specific category
router.patch("/products/:id", productController.updateProduct);



// Route to get a single product by ID
router.get("/products/:id", productController.getProductById);



// Soft delete product by id
router.patch("/products/:id/soft-delete", productController.softDeleteProduct); 



module.exports = router;
