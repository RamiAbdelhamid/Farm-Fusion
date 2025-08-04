const Vet = require("../model/Vet");

// Controller to add a new veterinarian
/****************************************************************************************/
/****************************************************************************************
 * @desc Add a new veterinarian
 * @route POST /api/vet
 * @access Public
 * @body {name, nameAr, department, experience, rating, reviewCount, specializations, specializationsAr}
 * @returns {Object} {message, vet}
 * /****************************************************************************************/
/****************************************************************************************/
const addVet = async (req, res) => {
  const {
    name,
    nameAr,
    department,
    experience,
    rating,
    reviewCount,
    specializations,
    specializationsAr,
  } = req.body;

  try {
    const newVet = new Vet({
      name,
      nameAr,
      department,
      experience,
      rating,
      reviewCount,
      specializations,
      specializationsAr,
    });

    await newVet.save();
    res.status(201).json({ message: "Vet added successfully", vet: newVet });
  } catch (error) {
    res.status(500).json({ message: "Error adding vet", error: error.message });
  }
};
/****************************************************************************************/
/****************************************************************************************/










// Controller to get all veterinarians
/****************************************************************************************/
/****************************************************************************************
 * @desc Get all veterinarians
 * @route GET /api/vet
 * @access Public
 * @returns {Object} {message, vets}
 * /****************************************************************************************/
/****************************************************************************************/
const getVets = async (req, res) => {
  try {
    const vets = await Vet.find({ isDeleted: { $ne: true } });
    res.status(200).json(vets);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching vets",
      error: error.message,
    });
  }
};
/****************************************************************************************/
/****************************************************************************************/












// Controller to get veterinarians by department
/****************************************************************************************/
/****************************************************************************************
 * @desc Get veterinarians by department
 * @route GET /api/vet/department/:departmentId
 * @access Public
 * @param {String} departmentId - ID of the department
 * @returns {Object} {message, vets}
 * /****************************************************************************************/
/****************************************************************************************/
const getVetsByDepartment = async (req, res) => {
  const { departmentId } = req.params;

  try {
    const vets = await Vet.find({
      department: departmentId,
      isDeleted: { $ne: true },
    });

    res.status(200).json(vets);
  } catch (error) {
    console.error("Error fetching vets:", error);
    res.status(500).json({
      message: "Error fetching vets",
      error: error.message,
    });
  }
};
/****************************************************************************************/
/****************************************************************************************/












// Controller to soft delete a veterinarian
/****************************************************************************************/
/****************************************************************************************
 * @desc Soft delete a veterinarian
 * @route DELETE /api/vet/:vetName
 * @access Public
 * @param {String} vetName - Name of the veterinarian to delete
 * @returns {Object} {message}
 * /****************************************************************************************/
/****************************************************************************************/
const deleteVet = async (req, res) => {
  try {
    const { vetName } = req.params;

    const result = await Vet.updateOne(
      { name: vetName },
      { $set: { isDeleted: true } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Veterinarian ${vetName} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Veterinarian ${vetName} marked as deleted`,
    });
  } catch (error) {
    console.error("Error soft deleting vet:", error);
    res.status(500).json({
      success: false,
      message: "Error soft deleting veterinarian",
    });
  }
};
/****************************************************************************************/
/****************************************************************************************/









// Export the controller functions
module.exports = {
  addVet,
  getVets,
  getVetsByDepartment,
  deleteVet,
};
