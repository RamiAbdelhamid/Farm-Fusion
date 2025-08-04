import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";




const Footer = () => {
  const { t, i18n } = useTranslation();
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const socialLinks = [
    { name: "Twitter", icon: "🐦", color: "bg-blue-400" },
    { name: "Facebook", icon: "👥", color: "bg-blue-600" },
    { name: "Instagram", icon: "📸", color: "bg-pink-500" },
    { name: "WhatsApp", icon: "💬", color: "bg-green-500" },
  ];

  const quickLinks = [
    { name: t("footer.home"), path: "/" },
    { name: t("footer.shop"), path: "/shop" },
    { name: t("footer.contact"), path: "/contact" },
    { name: t("footer.about"), path: "/about" },
  ];
  
  const usefulLinks = [
    { name: t("footer.createAccount"), path: "/signup" },
    { name: t("footer.terms"), path: "/terms" },
    { name: t("footer.privacy"), path: "/privacy" },
    { name: t("footer.faq"), path: "/faq" },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setIsSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
  };

  const isRTL = i18n.language === "ar";

  return (
    <footer
      className="bg-gradient-to-b from-green-800 to-green-900 text-white relative"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-green-400 via-yellow-300 to-green-400"></div>

      {/* Farm-themed decorative elements */}
      <div className="absolute top-0 left-0 w-full overflow-hidden h-8 opacity-20">
        <div className="w-full flex justify-around">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className="text-xl animate-bounce"
              style={{
                animationDuration: `${1 + (i % 3)}s`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {["🌱", "🌿", "🍃", "🌾", "🌲"][i % 5]}
            </span>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="md:col-span-2 space-y-4">
            <div
              className={`flex items-center ${
                isRTL ? "space-x-reverse" : "space-x-3"
              } mb-4`}
            >
              <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="text-2xl font-bold">{t("footer.brandName")}</h3>
            </div>

            <p className="text-green-100 mb-6 max-w-md">
              {t("footer.brandDescription")}
            </p>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-green-700 pb-2">
              {t("footer.quickLinksTitle")}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li
                  key={link.name}
                  className={`transform hover:${
                    isRTL ? "-translate-x-2" : "translate-x-2"
                  } transition-transform duration-200`}
                >
                  <Link
                    to={link.path}
                    className="text-green-200 hover:text-white flex items-center"
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <span className={isRTL ? "ml-2" : "mr-2"}>🌱</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-green-700 pb-2">
              {t("footer.usefulLinksTitle")}
            </h4>
            <ul className="space-y-2">
              {usefulLinks.map((link, index) => (
                <li
                  key={link.name}
                  className={`transform hover:${
                    isRTL ? "-translate-x-2" : "translate-x-2"
                  } transition-transform duration-200`}
                >
                  <Link
                    to={link.path}
                    className="text-green-200 hover:text-white flex items-center"
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <span className={isRTL ? "ml-2" : "mr-2"}>🌿</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>


        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-green-700 text-center">
          <p className="text-green-300">
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
