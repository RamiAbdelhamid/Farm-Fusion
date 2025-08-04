const express = require("express");
const router = express.Router();
const { createOrder } = require("../controller/orderController");
const path = require('path');  // Import path module

router.post("/checkout", createOrder);
// Serve PDF files
router.use('/pdfs', express.static(path.join(__dirname, '../pdfs')));

module.exports = router;
