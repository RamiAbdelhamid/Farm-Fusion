const Order = require("../model/Order");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");







// Controller to create a new order
/****************************************************************************************/
/****************************************************************************************
 * @desc Create a new order
 * @route POST /api/order
 * @access Public
 * @body {cartItems, totalAmount, paymentMethod, shippingAddress, name, phoneNumber, location, postalCode, cardNumber, cardExpiry, cardCVV, paypalEmail}
 * @returns {Object} {message, order}
 * /****************************************************************************************/
/****************************************************************************************/
// Ensure the directory for PDFs exists
const pdfDir = path.join(__dirname, "../pdfs");
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir);
}
const createOrder = async (req, res) => {
  try {
    const {
      cartItems,
      totalAmount,
      paymentMethod,
      shippingAddress,
      name,
      phoneNumber,
      location,
      postalCode,
      cardNumber,
      cardExpiry,
      cardCVV,
      paypalEmail,
    } = req.body;

    const newOrder = new Order({
      cartItems,
      totalAmount,
      paymentMethod,
      shippingAddress,
      name,
      phoneNumber,
      location,
      postalCode,
      cardNumber,
      cardExpiry,
      cardCVV,
      paypalEmail,
    });

    await newOrder.save();

    // Generate PDF
    const doc = new PDFDocument();
    const pdfPath = path.join(pdfDir, `order_${newOrder._id}.pdf`); // Use the pdfDir path

    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(12).text(`Order ID: ${newOrder._id}`);
    doc.text(`Name: ${newOrder.name}`);
    doc.text(`Phone Number: ${newOrder.phoneNumber}`);
    doc.text(`Shipping Address: ${newOrder.shippingAddress}`);
    doc.text(`Total: ${newOrder.totalAmount} JD`);
    doc.text("Items:");
    newOrder.cartItems.forEach((item) => {
      doc.text(
        `- ${item.name} x${item.quantity} = ${item.price * item.quantity} JD`
      );
    });

    doc.end();

    // Return the PDF URL
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      pdfUrl: `/pdfs/order_${newOrder._id}.pdf`,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
  }
};
/****************************************************************************************/
/****************************************************************************************/

module.exports = { createOrder };
