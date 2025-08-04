const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const plantDiseaseController = require('../controller/plantDiseaseController');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// POST /api/plant-disease-detect
router.post('/', upload.single('image'), plantDiseaseController.detectDisease);

module.exports = router; 