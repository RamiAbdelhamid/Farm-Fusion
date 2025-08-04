const mongoose = require("mongoose");




// Define the contact schema
// This schema defines the structure of the contact data in the database
// It includes fields for first name, last name, email, subject, and message
// The first name, last name, email, subject, and message fields are required
//  * @returns {Object} {message, contact}
//  * /****************************************************************************************/
// /****************************************************************************************/
const ContactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
});

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
