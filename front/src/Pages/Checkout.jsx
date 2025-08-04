
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const Checkout = () => {
  const { t, i18n } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    setCartItems(savedCart ? JSON.parse(savedCart) : []);
  }, []);

  // Regex validation
  const validatePhoneNumber = (number) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(number);
  };

  const validatePostalCode = (code) => {
    const regex = /^[0-9]{5}$/;
    return regex.test(code);
  };

  const handleCheckout = async () => {
    if (
      !shippingAddress ||
      !paymentMethod ||
      !name ||
      !phoneNumber ||
      !location ||
      !postalCode
    ) {
      Swal.fire(t("checkoutt.error"), t("checkoutt.fill_all_details"), "error");
      return;
    }

    // Validate phone number and postal code using regex
    if (!validatePhoneNumber(phoneNumber)) {
      Swal.fire(
        t("checkoutt.invalid_phone"),
        t("checkoutt.valid_phone_message"),
        "error"
      );
      return;
    }

    if (!validatePostalCode(postalCode)) {
      Swal.fire(
        t("checkoutt.invalid_postal"),
        t("checkoutt.valid_postal_message"),
        "error"
      );
      return;
    }

    // Validate payment details based on method
    if (
      (paymentMethod === "visa" || paymentMethod === "stripe") &&
      (!cardNumber || !cardExpiry || !cardCVV)
    ) {
      Swal.fire(t("checkoutt.error"), t("checkoutt.fill_card_details"), "error");
      return;
    }

    if (paymentMethod === "paypal" && !paypalEmail) {
      Swal.fire(t("checkoutt.error"), t("checkoutt.paypal_email"), "error");
      return;
    }

    const orderData = {
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
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/checkoutt",
        orderData
      );
      if (response.data.success) {
        setPaymentSuccess(true);
        setPdfUrl(response.data.pdfUrl);

        // Show SweetAlert success message
        Swal.fire({
          title: t("checkoutt.order_confirmed"),
          text: t("checkoutt.thank_you"),
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // Clear the cart and redirect to the homepage
          localStorage.removeItem("cartItems");
          navigate("/"); // Redirect to the homepage
        });
      }
    } catch (error) {
      console.error("Error during checkoutt:", error);
      Swal.fire({
        title: t("checkoutt.payment_failed"),
        text: t("checkoutt.payment_error"),
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const totalAmount = cartItems
    .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
    .toFixed(2);

  // Payment method icons - would typically use actual image paths
  const paymentIcons = {
    stripe: "/images/stripe-logo.png",
    paypal: "/images/paypal-logo.png",
    visa: "/images/visa-logo.png",
    click: "/images/click-logo.png",
  };

  return (
    <div
      className="max-w-4xl mx-auto p-4 bg-green-50"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-green-800">
        {t("checkoutt.secure_checkoutt")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Customer Info */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-4 border-t-4 border-green-600">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-green-700">
              {t("checkoutt.customer_info")}
            </h2>

            {/* Name */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                {t("checkoutt.full_name")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200 focus:border-green-500"
                placeholder={t("checkoutt.enter_full_name")}
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                {t("checkoutt.phone_number")}
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200 focus:border-green-500"
                placeholder={t("checkoutt.enter_phone")}
              />
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                {t("checkoutt.location")}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200 focus:border-green-500"
                placeholder={t("checkoutt.enter_location")}
              />
            </div>

            {/* Postal Code */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                {t("checkoutt.postal_code")}
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200 focus:border-green-500"
                placeholder={t("checkoutt.enter_postal")}
              />
            </div>

            {/* Shipping Address */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                {t("checkoutt.shipping_address")}
              </label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200 focus:border-green-500"
                placeholder={t("checkoutt.enter_shipping")}
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Payment and Cart */}
        <div>
          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-4 border-t-4 border-green-600">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-green-700">
              {t("checkoutt.payment_method")}
            </h2>

            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Payment Method Options with Images */}
                <div
                  className={`flex flex-col items-center border rounded-lg p-3 cursor-pointer ${
                    paymentMethod === "stripe"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("stripe")}
                >
                  <div className="h-25 w-40 flex items-center justify-center mb-2">
                    <img
                      src="../../src/assets/pic/stripe.gif"
                      alt="Stripe"
                      className="max-h-full"
                    />
                  </div>
                </div>

                <div
                  className={`flex flex-col items-center border rounded-lg p-3 cursor-pointer ${
                    paymentMethod === "paypal"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("paypal")}
                >
                  <div className="h-25 w-40 flex items-center justify-center mb-2">
                    <img
                      src="../../src/assets/pic/payy.gif"
                      alt="PayPal"
                      className="max-h-full"
                    />
                  </div>
                </div>

                <div
                  className={`flex flex-col items-center border rounded-lg p-3 cursor-pointer ${
                    paymentMethod === "visa"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("visa")}
                >
                  <div className="h-25 w-40 flex items-center justify-center mb-2">
                    <img
                      src="../../src/assets/pic/visa.jpeg"
                      alt="Visa"
                      className="max-h-full"
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {t("checkoutt.visa_card")}
                  </span>
                </div>

                <div
                  className={`flex flex-col items-center border rounded-lg p-3 cursor-pointer ${
                    paymentMethod === "click"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("click")}
                >
                  <div className="h-25 w-40 flex items-center justify-center mb-2">
                    <img
                      src="../../src/assets/pic/click.gif"
                      alt="Click"
                      className="max-h-full"
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {t("checkoutt.click_payment")}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            {(paymentMethod === "visa" || paymentMethod === "stripe") && (
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="mb-4">
                  <label className="block mb-1 font-medium">
                    {t("checkoutt.card_number")}
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      {t("checkoutt.expiry_date")}
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      {t("checkoutt.cvv")}
                    </label>
                    <input
                      type="text"
                      value={cardCVV}
                      onChange={(e) => setCardCVV(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "paypal" && (
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="mb-4">
                  <label className="block mb-1 font-medium">
                    {t("checkoutt.paypal_email")}
                  </label>
                  <input
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "click" && (
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <p className="text-center text-gray-700">
                  {t("checkoutt.click_redirect")}
                </p>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-4 border-t-4 border-green-600">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-green-700">
              {t("checkoutt.order_summary")}
            </h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-500">{t("checkoutt.empty_cart")}</p>
            ) : (
              <div>
                <ul className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <li
                      key={item._id}
                      className="flex justify-between items-center border-b pb-3"
                    >
                      <div className="flex items-center">
                        {item.image && (
                          <div className="w-12 h-12 mr-3 bg-gray-100 rounded overflow-hidden">
                            <img
                              src={`http://localhost:5000${item.image}`}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-green-800">
                            {item.name}
                          </p>
                          {item.category && (
                            <p className="text-xs text-gray-500">
                              {item.category}
                            </p>
                          )}
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-600">
                              {t("checkoutt.qty")}: {item.quantity}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{item.price} JD</p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-600">
                            {(item.price * item.quantity).toFixed(2)} JD{" "}
                            {t("checkoutt.total")}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t pt-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">
                      {t("checkoutt.subtotal")}:
                    </span>
                    <span>{totalAmount} JD</span>
                  </div>

                  <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                    <span className="text-green-800">
                      {t("checkoutt.total")}:
                    </span>
                    <span className="text-green-800">
                      {parseFloat(totalAmount).toFixed(2)} JD
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleCheckout}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-md transition duration-200 flex items-center justify-center"
            disabled={cartItems.length === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            {t("checkoutt.complete_purchase")}
          </button>
        </div>
      </div>

      {paymentSuccess && (
        <div className="mt-6 text-center p-6 bg-green-100 rounded-lg border border-green-300">
          <div className="text-green-600 text-5xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">
            {t("checkoutt.success_title")}
          </h3>
          <p className="text-green-700 mb-4">{t("checkoutt.success_message")}</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;