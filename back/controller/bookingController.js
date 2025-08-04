const Booking = require("../model/bookingModel"); // استيراد نموذج الحجز



//createBooking
// This function creates a new booking for a user
// It checks if the user already has a booking and if the selected vet is available
// It saves the booking to the database and returns a success message
/****************************************************************************************
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Private
 * @param   {Object} req - The request object containing booking details
 * @param   {Object} res - The response object to send the result
 * @returns {Object} - The created booking object or an error message
 *  ****************************************************************************************/
/****************************************************************************************/

const createBooking = async (req, res) => {
  const { department, vet, date, emergency, reason, phoneNumber } = req.body;

  if (!vet || !date) {
    return res.status(400).json({ message: "Vet and date are required" });
  }

  try {
    const userId = req.user.id;

    // Check if the user has a prior booking (regardless of date or doctor)
    const userExistingBooking = await Booking.findOne({
      userId,
      completed: false,
      status: { $ne: "rejected" }, // Exclude rejected bookings
    });

    if (userExistingBooking) {
      return res.status(400).json({
        message: "You already have a booking. You cannot book again.",
      });
    }
    // Check if the vet is already booked on the selected date

    const existingVetBooking = await Booking.findOne({ vet, date });

    if (existingVetBooking) {
      return res.status(400).json({
        message: "This vet is already booked on the selected date.",
      });
    }

    const newBooking = new Booking({
      department,
      vet,
      date,
      emergency,
      reason,
      phoneNumber,
      userId,
    });

    await newBooking.save();
    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error saving booking",
      error: error.message,
    });
  }
};
/****************************************************************************************/
/****************************************************************************************/







// Get reserved dates for a specific vet
// This function retrieves all the dates that are already booked for a specific vet
// It returns an array of reserved dates
/****************************************************************************************
 * @desc    Get reserved dates for a specific vet
 * @route   GET /api/bookings/reserved-dates/:vetName
 * @access  Public
 * @param   {string} vetName - The name of the vet to check for reserved dates
 * @param   {Object} req - The request object
 * @param   {Object} res - The response object to send the result
 * @returns {Array} - An array of reserved dates for the specified vet
 * ****************************************************************************************/
/****************************************************************************************/
const getReservedDates = async (req, res) => {
  const vetName = req.params.vetName;

  try {
    const bookings = await Booking.find({ vet: vetName });

    const reservedDates = bookings.map((booking) => booking.date);
    res.json(reservedDates);
  } catch (error) {
    console.error("Error fetching reserved dates:", error);
    res.status(500).json({ message: "Error fetching reserved dates" });
  }
};
/****************************************************************************************/
/****************************************************************************************/









// Get all bookings 
// This function retrieves all bookings from the database
// It sorts the bookings by date in descending order
// It returns an array of all bookings
/****************************************************************************************
 * @desc    Get all bookings
 * @route   GET /api/bookings
 * @access  Private
 * @param   {Object} req - The request object
 * @param   {Object} res - The response object to send the result
 * @returns {Array} - An array of all bookings
 * ****************************************************************************************/
/****************************************************************************************/
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};
/****************************************************************************************/
/****************************************************************************************/











// Notify doctor about a booking
// This function notifies the doctor about a booking
// It updates the booking to mark it as notified
// It returns a success message
/****************************************************************************************
 * @desc    Notify doctor about a booking
 * @route   POST /api/bookings/notify/:id
 * @access  Private
 * @param   {string} id - The ID of the booking to notify the doctor about
 * @param   {Object} req - The request object
 * @param   {Object} res - The response object to send the result
 * @returns {Object} - The updated booking object or an error message
 * ****************************************************************************************/
/****************************************************************************************/
const notifyDoctor = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the booking to mark it as notified
    booking.notified = true;
    await booking.save();

    // In a real application, you might send an email or notification to the doctor here
    // For example:
    // await sendEmailToDoctor(booking.vet, booking);

    res.json({ message: "Doctor notified successfully", booking });
  } catch (error) {
    console.error("Error notifying doctor:", error);
    res.status(500).json({ message: "Error notifying doctor" });
  }
};
/****************************************************************************************/
/****************************************************************************************/











// Update booking status (approve/reject)
// This function updates the status of a booking
// It checks if the booking exists and updates its status
// It returns a success message
/****************************************************************************************
 *  @desc    Update booking status (approve/reject)
 *  @route   PUT /api/bookings/:id/status
 *  @access  Private
 *  @param   {string} id - The ID of the booking to update
 * @param   {Object} req - The request object containing the new status 
 * @param   {Object} res - The response object to send the result
 * @returns {Object} - The updated booking object or an error message
 * ****************************************************************************************/
/****************************************************************************************/
const updateBookingStatus = async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  // Validate status input
  if (!status || !["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the booking status
    booking.status = status;
    await booking.save();

    res.json({
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    console.error(`Error updating booking status:`, error);
    res.status(500).json({ message: "Error updating booking status" });
  }
};
/****************************************************************************************/
/****************************************************************************************/













// Mark booking as completed
// This function marks a booking as completed
// It checks if the booking exists and updates its completion status
// It returns a success message
/****************************************************************************************
 * @desc    Mark booking as completed
 * @route   PUT /api/bookings/:id/complete
 * @access  Private
 * @param   {string} id - The ID of the booking to mark as completed
 * @param   {Object} req - The request object containing the completion status
 * @param   {Object} res - The response object to send the result
 * @returns {Object} - The updated booking object or an error message
 * ****************************************************************************************/
/****************************************************************************************/
const completeBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking completion status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Error updating booking completion status:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating booking completion status",
    });
  }
};

/****************************************************************************************/
/****************************************************************************************/












// Add this in the bookingController.js file
// Get user bookings
// This function retrieves all bookings for a specific user
// It checks if the user is authenticated and fetches their bookings
// It supports pagination and returns the bookings in a paginated format
/****************************************************************************************
 * @desc    Get user bookings
 * @route   GET /api/bookings/user
 * @access  Private
 * @param   {Object} req - The request object containing pagination parameters
 * @param   {Object} res - The response object to send the result
 * @returns {Object} - The paginated list of user bookings or an error message
 * ****************************************************************************************/
/****************************************************************************************/
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id; // User ID from authenticated token

    // Pagination parameters with defaults
    const page = parseInt(req.query.page) || 1; // Current page, default to 1
    const limit = parseInt(req.query.limit) || 10; // Items per page, default to 10
    const skipIndex = (page - 1) * limit; // Calculate skip index

    // Find total number of bookings for this user
    const totalBookings = await Booking.countDocuments({
      userId,
      completed: true,
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalBookings / limit);

    // Fetch paginated bookings
    const bookings = await Booking.find({ userId, completed: true })
      .sort({ date: -1 })
      .skip(skipIndex)
      .limit(limit);

    res.status(200).json({
      bookings,
      currentPage: page,
      totalPages,
      totalBookings,
      pageSize: limit,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};
/****************************************************************************************/
/****************************************************************************************/




// Export all functions for use in routes
module.exports = {
  createBooking,
  getReservedDates,
  getAllBookings,
  notifyDoctor,
  updateBookingStatus,
  completeBooking,
  getUserBookings,
};
