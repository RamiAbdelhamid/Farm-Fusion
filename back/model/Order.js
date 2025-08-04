const mongoose = require("mongoose");






  //  Define the order schema
  // This schema defines the structure of the order data in the database
  // It includes fields for cart items, total amount, payment method, shipping address, name, phone number, location, postal code, and date
  // The cart items field is an array of objects, each containing name, price, and quantity
  // The total amount field is the total cost of the order
  // The payment method field is a string representing the payment method used
  // The shipping address field is a string representing the address where the order will be shipped
  // The name field is the name of the person placing the order
  // The phone number field is the contact number of the person placing the order
  // The location field is the location of the person placing the order
  // The postal code field is the postal code of the shipping address
  // The date field is a timestamp indicating when the order was placed
  //  * @returns {Object} {message, order}
  //  * /****************************************************************************************/
// /****************************************************************************************/

const orderSchema = new mongoose.Schema({
  cartItems: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: Number,
  paymentMethod: String,
  shippingAddress: String,
  name: String,
  phoneNumber: String,
  location: String,
  postalCode: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
