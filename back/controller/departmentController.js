const Department = require("../model/Department");






// Controller to add a new department 
/****************************************************************************************/
/****************************************************************************************
 * @desc Add a new department
 * @route POST /api/department
 * @access Public
 *  @body {id, name, nameAr, icon}
 * @returns {Object} {message, department}
 * /****************************************************************************************/
/****************************************************************************************/
const addDepartment = async (req, res) => {
  const { id, name, nameAr, icon } = req.body;

  try {
    const newDepartment = new Department({
      id,
      name,
      nameAr,
      icon,
    });

    await newDepartment.save();
    res.status(201).json({
      message: "Department added successfully",
      department: newDepartment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding department",
      error: error.message,
    });
  }
};
/****************************************************************************************/
/****************************************************************************************/









// Controller to get all departments
/****************************************************************************************/
/****************************************************************************************
 * @desc Get all departments
 * @route GET /api/department
 * @access Public
 * @returns {Object} {message, departments}
 * /****************************************************************************************/
/****************************************************************************************/
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching departments",
      error: error.message,
    });
  }
};
/****************************************************************************************/
/****************************************************************************************/












// Controller to delete a department
/****************************************************************************************/
/****************************************************************************************
 * @desc Delete a department
 * @route DELETE /api/department/:id
 * @access Public
 * @param {string} id - The ID of the department to delete
 * @returns {Object} {message, department}
 * /****************************************************************************************/
/****************************************************************************************/
const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await Department.findOneAndDelete({ id });
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({
      message: "Department deleted successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting department",
      error: error.message,
    });
  }
};
/****************************************************************************************/
/****************************************************************************************/





// Exporting the controller functions
module.exports = {
  addDepartment,
  getDepartments,
  deleteDepartment,
};
