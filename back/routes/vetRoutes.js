const express = require("express");
const {
  addVet,
  getVets,
  getVetsByDepartment,
deleteVet,
} = require("../controller/vetController");

const router = express.Router();

// Route to add a new veterinarian
router.post("/add", addVet);

// Route to get all veterinarians
router.get("/", getVets);

// Route to get vets by department
router.get("/by-department/:departmentId", getVetsByDepartment);

// Add this new route for deleting vets
router.patch("/:vetName", deleteVet);


module.exports = router;
