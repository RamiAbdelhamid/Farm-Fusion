
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  Send,
  ArrowUp,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
} from "lucide-react";
import Swal from "sweetalert2";

const ContactUs = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      message: t("chatWelcomeMessage"),
    },
  ]);
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/contact/add",
        formData,
        {
          withCredentials: true,
        }
      );

      Swal.fire({
        title: t("thankYou"),
        text: t("contactSuccessMessage"),
        icon: "success",
        confirmButtonText: t("great"),
        confirmButtonColor: "#16a34a",
      });

      setSuccess(response.data.message);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      Swal.fire({
        title: t("loginRequired"),
        text: t("loginPrompt"),
        icon: "warning",
        confirmButtonText: t("login"),
        confirmButtonColor: "#16a34a",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });

      setError(t("contactErrorMessage"));
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    setChatMessages([
      ...chatMessages,
      { sender: "user", message: userMessage },
    ]);

    setTimeout(() => {
      let botResponse = t("defaultBotResponse");

      const lowerCaseMsg = userMessage.toLowerCase();
      if (
        lowerCaseMsg.includes("livestock") ||
        lowerCaseMsg.includes("animal")
      ) {
        botResponse = t("livestockBotResponse");
      } else if (
        lowerCaseMsg.includes("crop") ||
        lowerCaseMsg.includes("plant") ||
        lowerCaseMsg.includes("harvest")
      ) {
        botResponse = t("cropBotResponse");
      } else if (
        lowerCaseMsg.includes("hours") ||
        lowerCaseMsg.includes("open")
      ) {
        botResponse = t("hoursBotResponse");
      } else if (
        lowerCaseMsg.includes("price") ||
        lowerCaseMsg.includes("cost") ||
        lowerCaseMsg.includes("fee")
      ) {
        botResponse = t("pricingBotResponse");
      } else if (
        lowerCaseMsg.includes("location") ||
        lowerCaseMsg.includes("address") ||
        lowerCaseMsg.includes("where")
      ) {
        botResponse = t("locationBotResponse");
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", message: botResponse },
      ]);
    }, 1000);

    setUserMessage("");
  };

  const showWhatsAppAlert = () => {
    Swal.fire({
      title: t("whatsappTitle"),
      text: t("whatsappPrompt"),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("openWhatsApp"),
      cancelButtonText: t("notNow"),
      confirmButtonColor: "#16a34a",
    }).then((result) => {
      if (result.isConfirmed) {
        window.open("https://wa.me/+962785956180", "_blank");
      }
    });
  };

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLanguage);
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLanguage;
  };

  return (
    <div
      className="bg-green-50 min-h-screen"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto p-6">
   

        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            {t("contactTitle")}
          </h1>
          <p
            className={`text-lg text-green-700 max-w-2xl mx-auto ${
              i18n.language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t("contactSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-green-800 mb-6 flex items-center">
              <Mail className="mr-2" size={24} /> {t("contactFormTitle")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("firstNameLabel")}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("lastNameLabel")}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("emailLabel")}
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("subjectLabel")}
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">{t("selectTopic")}</option>
                  <option value="Livestock Care">{t("livestockOption")}</option>
                  <option value="Crop Management">{t("cropOption")}</option>
                  <option value="Equipment">{t("equipmentOption")}</option>
                  <option value="Pricing">{t("pricingOption")}</option>
                  <option value="Other">{t("otherOption")}</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("messageLabel")}
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  placeholder={t("messagePlaceholder")}
                ></textarea>
              </div>

              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-600">{success}</p>}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <span>{t("sending")}</span>
                  ) : (
                    <>
                      <Send size={20} />
                      {t("sendButton")}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={showWhatsAppAlert}
                  className="flex-1 bg-green-50 border-2 border-green-600 text-green-700 py-3 px-6 rounded-lg hover:bg-green-100 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.6 6.32A8.4 8.4 0 0 0 12.08 4 8.5 8.5 0 0 0 4 12.5a8.42 8.42 0 0 0 1.27 4.5L4 21l4.14-1.09a8.5 8.5 0 0 0 3.94.99h.31A8.5 8.5 0 0 0 20.5 12.5a8.4 8.4 0 0 0-2.9-6.18zM12.08 19.7h-.28a7.06 7.06 0 0 1-3.6-1l-.25-.15-2.66.7.71-2.6-.16-.26a7.05 7.05 0 0 1-1.14-3.86 7.08 7.08 0 0 1 7.08-7.08c1.9 0 3.67.73 5 2.07a7 7 0 0 1 2.08 5.02 7.08 7.08 0 0 1-7.08 7.08zm3.9-5.28c-.21-.11-1.25-.62-1.45-.69-.2-.07-.34-.1-.48.1-.14.2-.54.69-.67.83-.12.14-.25.15-.46.05a5.8 5.8 0 0 1-2.9-2.54c-.22-.38.22-.35.62-1.16.07-.14.03-.25-.02-.36s-.48-1.16-.66-1.59c-.17-.41-.35-.36-.48-.36-.12 0-.26-.02-.4-.02a.77.77 0 0 0-.56.26 2.35 2.35 0 0 0-.73 1.74c0 1.03.75 2.02.86 2.16.1.14 1.47 2.25 3.57 3.16.5.21.89.34 1.19.44.5.16.96.14 1.32.08.4-.06 1.25-.5 1.42-1 .18-.48.18-.9.13-.99-.05-.08-.19-.14-.4-.24z" />
                  </svg>
                  {t("whatsappButton")}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">
              {t("contactInfoTitle")}
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="text-green-600 mt-1 mr-3" size={22} />
                <div>
                  <h3 className="font-medium text-gray-800">
                    {t("locationTitle")}
                  </h3>
                  <p className="text-gray-600">{t("locationAddress")}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="text-green-600 mt-1 mr-3" size={22} />
                <div>
                  <h3 className="font-medium text-gray-800">
                    {t("phoneTitle")}
                  </h3>
                  <p className="text-gray-600">{t("phoneNumber")}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="text-green-600 mt-1 mr-3" size={22} />
                <div>
                  <h3 className="font-medium text-gray-800">
                    {t("emailTitle")}
                  </h3>
                  <p className="text-gray-600">{t("emailAddress")}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">
                  {t("businessHoursTitle")}
                </h3>
                <ul className="text-gray-600 space-y-1">
                  <li className="flex justify-between">
                    <span>{t("weekdaysLabel")}:</span>
                    <span>{t("weekdaysHours")}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>{t("saturdayLabel")}:</span>
                    <span>{t("saturdayHours")}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>{t("sundayLabel")}:</span>
                    <span>{t("sundayHours")}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">
                  {t("servicesTitle")}
                </h3>
                <ul className="text-gray-600 list-disc pl-5 space-y-1">
                  <li>{t("service1")}</li>
                  <li>{t("service2")}</li>
                  <li>{t("service3")}</li>
                  <li>{t("service4")}</li>
                  <li>{t("service5")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Google Map Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-green-800 mb-6 flex items-center">
            <MapPin className="mr-2" size={24} /> {t("findUsTitle")}
          </h2>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.3895895885753!2d36.08776962490851!3d32.05870992034881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151b65cd4d8f17e1%3A0x30e86b8a97e4ac7d!2sOrange%20Digital%20Village%20Zarqa!5e0!3m2!1sar!2sjo!4v1742754671002!5m2!1sar!2sjo"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t("mapTitle")}
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>

  

     
    </div>
  );
};

export default ContactUs;