const Product = require("../model/productModel");
const multer = require("multer");







// Setup Multer storage
// multer is a middleware for handling multipart/form-data, which is used for uploading files
// It stores the uploaded files in a specified directory and generates a unique filename for each file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname); // Generate a unique filename
  },
});
/****************************************************************************************/
/****************************************************************************************/







// Create a multer instance with the defined storage
const upload = multer({ storage: storage });
/****************************************************************************************/
/****************************************************************************************/













// Add a new product with image upload
/****************************************************************************************/
/****************************************************************************************
 * @desc Add a new product
 * @route POST /api/product
 * @access Public
 * @body {name, nameAr, nameFr, description, descriptionAr, descriptionFr, price, category, categoryAr, categoryFr, details, detailsAr, detailsFr}
 * @returns {Object} {message, product}
 * /****************************************************************************************/
/****************************************************************************************/
exports.addProduct = [
  upload.single("image"), // Middleware to handle the file upload
  async (req, res) => {
    try {
      const {
        name,
        nameAr,
        nameFr, 
        description,
        descriptionAr,
        descriptionFr, 
        price,
        category,
        categoryAr,
        categoryFr, 
        details,
        detailsAr,
        detailsFr, 
      } = req.body;
      
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      const newProduct = new Product({
        name,
        nameAr,
        nameFr, 
        description,
        descriptionAr,
        descriptionFr, 
        price,
        category,
        categoryAr,
        categoryFr, 
        details,
        detailsAr,
        detailsFr, 
        image,
      });
      // Save the new product to the database
      await newProduct.save();
      res.status(201).json({
        message: "Product added successfully",
        product: newProduct,
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to add product", error: err });
    }
  },
];
/****************************************************************************************/
/****************************************************************************************/















// Get all products
/****************************************************************************************/
/****************************************************************************************
 * @desc Get all products
 * @route GET /api/product
 * @access Public
 * @returns {Object} {message, products}
 * /****************************************************************************************/
/****************************************************************************************/
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err });
  }
};
/****************************************************************************************/
/****************************************************************************************/











// Update an existing product with image upload (optional)
/****************************************************************************************/
/****************************************************************************************
 * @desc Update a product
 *  @route PUT /api/product/:id
 *  @access Public
 * @body {name, nameAr, nameFr, description, descriptionAr, descriptionFr, price, category, categoryAr, categoryFr, details, detailsAr, detailsFr}
 * @returns {Object} {message, product}
 * ****************************************************************************************/
/****************************************************************************************/
exports.updateProduct = [
  upload.single("image"), // Middleware to handle the file upload (optional)
  async (req, res) => {
    try {
      const { id } = req.params; // Get the product id from the URL parameter
      const {
        name,
        nameAr,
        nameFr, 
        description,
        descriptionAr,
        descriptionFr, 
        price,
        category,
        categoryAr,
        categoryFr, 
        details,
        detailsAr,
        detailsFr, 
      } = req.body;
      
      let image = req.file ? `/uploads/${req.file.filename}` : null;

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          name,
          nameAr,
          nameFr, 
          description,
          descriptionAr,
          descriptionFr, 
          price,
          category,
          categoryAr,
          categoryFr, 
          details,
          detailsAr,
          detailsFr, 
          ...(image && { image }),
        },
        { new: true }
      );
            if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to update product", error: err });
    }
  },
];
/****************************************************************************************/
/****************************************************************************************/












// Soft delete: Mark a product as "deleted"
/****************************************************************************************/
/****************************************************************************************
 * @desc Soft delete a product
 * @route DELETE /api/product/:id
 * @access Public
 * @param {string} id - The ID of the product to delete
 * @returns {Object} {message, product}
 * /****************************************************************************************/
/****************************************************************************************/
exports.softDeleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true }, // Set isDeleted to true
      { new: true } // Return the updated product
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product marked as deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product", error });
  }
};
/****************************************************************************************/
/****************************************************************************************/













// Get a single product by ID
/****************************************************************************************/
/****************************************************************************************
 * @desc Get a product by ID
 * @route GET /api/product/:id
 * @access Public
 * @param {string} id - The ID of the product to fetch
 * @returns {Object} {message, product}
 * /****************************************************************************************/
/****************************************************************************************/
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({
      _id: product._id,
      name: product.name,
      nameAr: product.nameAr,
      nameFr: product.nameFr, // ✅
      description: product.description,
      descriptionAr: product.descriptionAr,
      descriptionFr: product.descriptionFr, // ✅
      details: product.details,
      detailsAr: product.detailsAr,
      detailsFr: product.detailsFr, // ✅
      price: product.price,
      image: product.image,
      category: product.category,
      categoryAr: product.categoryAr,
      categoryFr: product.categoryFr, // ✅
    });
    
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/****************************************************************************************/
/****************************************************************************************/
