const express = require("express");
const { addContact, getContact } = require("../controller/contactusController");
const router = express.Router();
const verifyToken  = require("../middleware/authMiddleware");

// Route to add a new department
router.post("/add", verifyToken, addContact);

// Route to get all departments
router.get("/", verifyToken, getContact);

module.exports = router;
