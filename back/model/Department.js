const mongoose = require("mongoose");












// Define the department schema
// This schema defines the structure of the department data in the database
// It includes fields for id, name, nameAr, and icon
// The id field is a unique identifier for the department
// The name field is the English name of the department
// The nameAr field is the Arabic name of the department
// The icon field is a string representing the icon of the department
//  * @returns {Object} {message, department}
//  * /****************************************************************************************/
// /****************************************************************************************/
const departmentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true }, // English name
    nameAr: { type: String, required: true }, // Arabic name
    icon: { type: String, default: "🐾" },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
