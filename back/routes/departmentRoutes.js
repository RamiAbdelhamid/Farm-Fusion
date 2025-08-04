const express = require("express");
const {
  addDepartment,
  getDepartments,
  deleteDepartment,
} = require("../controller/departmentController");

const router = express.Router();

// Route to add a new department
router.post("/add", addDepartment);

// Route to get all departments
router.get("/", getDepartments);

// Route to delete a department
router.delete("/:id", deleteDepartment);






module.exports = router;
