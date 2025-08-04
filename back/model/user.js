const mongoose = require("mongoose");
const Schema = mongoose.Schema;





// Define the user schema
// This schema defines the structure of the user data in the database
// It includes fields for email, password, googleId, role, name, profilePicture, status, and createdAt
// The email field is the user's email address
// The password field is the user's password
// The googleId field is the user's Google ID
// The role field is a string representing the user's role (veterinarian, user, or admin)
// The name field is the user's name
// The profilePicture field is a string representing the URL of the user's profile picture
// The status field is a string representing the user's status (pending, approved, rejected, or user)
// The createdAt field is a timestamp indicating when the user was created
//  * @returns {Object} {message, user}
//  * /****************************************************************************************/
// /****************************************************************************************/
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  role: {
    type: String,
    enum: ["veterinarian", "user", "admin"], // Note: singular "veterinarian"
    default: "user",
  },
  name: { type: String, required: true },
  profilePicture: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "user"],
    default: "pending",
  },

  createdAt: { type: Date, default: Date.now },
  isSuspended: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
