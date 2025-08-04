const mongoose = require("mongoose");





// Define the booking schema
// This schema defines the structure of the booking data in the database
// It includes fields for userId, vetId, date, time, status, and createdAt
// The userId field is the ID of the user who made the booking
// The vetId field is the ID of the veterinarian for the booking
// The date field is the date of the booking
// The time field is the time of the booking
// The status field is the status of the booking (pending, approved, or rejected)
// The createdAt field is the timestamp when the booking was created
//  * @returns {Object} {message, veterinarians}
//  * /****************************************************************************************/
// /****************************************************************************************/
const vetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // English name
    nameAr: { type: String, required: true }, // Arabic name
    department: { type: String, required: true }, // department ID
    experience: { type: Number, required: true },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    specializations: { type: [String], required: true }, // English
    specializationsAr: { type: [String], required: true }, // Arabic
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Vet = mongoose.model("Vet", vetSchema);

module.exports = Vet;
