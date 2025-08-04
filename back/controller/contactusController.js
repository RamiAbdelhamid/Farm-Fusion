const Contact = require("../model/contactusModel");




// Controller to add a new contact
/****************************************************************************************/
/****************************************************************************************
 * @desc Add a new contact
 *  @route POST /api/contact
 *  @access Public
 *  @body {firstName, lastName, email, subject, message}
 * @returns {Object} {message, contact}
 /****************************************************************************************/
/****************************************************************************************/
const addContact = async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  try {
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      subject,
      message,
    });

    await newContact.save();
    res.status(201).json({
      message: "Your message has been sent successfully",
      contact: newContact,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
};
  /****************************************************************************************/
/****************************************************************************************/






// Controller to get all contact
/****************************************************************************************/
/****************************************************************************************
 * @desc Get all contact
 *  @route GET /api/contact
 *  @access Public
 * @returns {Object} {message, contact}
 /****************************************************************************************/
/****************************************************************************************/
const getContact = async (req, res) => {
  try {
    const contact = await Contact.find();
    res.status(200).json(contact);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};
/****************************************************************************************/
/****************************************************************************************/


//exporting the controllers
module.exports = { addContact, getContact };
