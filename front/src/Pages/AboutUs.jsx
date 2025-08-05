
import React, { useState, useEffect } from "react";
import TotalProducts from "../Component/TotalProducts";
import TotalBookings from "../Component/TotalBookings";
import TotalVet from "../Component/Vet";
import AddVeterinarians from "./../Dashboard/AddVeterinarians";
import { useTranslation } from "react-i18next";

const AboutUs = () => {
  const { t, i18n } = useTranslation();
  const [happyClientsCount, setHappyClientsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHappyClients = async () => {
      try {
        const response = await fetch(
          "https://farm-fusion-srt9.onrender.com/api/reviews/happy-clients"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setHappyClientsCount(data.count);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHappyClients();
  }, []);

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLanguage);
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLanguage;
  };

  if (loading) return <div className="text-center py-8">{t("loading")}</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        {t("error")}: {error}
      </div>
    );

  return (
    <section
      className={`py-16 bg-gradient-to-b from-green-50 to-green-100 ${
        i18n.language === "ar" ? "font-arabic" : "font-sans"
      }`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4">
    

        {/* Header Text */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <h5 className="text-green-600 font-medium mb-2 tracking-wider uppercase text-sm">
              {t("aboutTitle")}
            </h5>
            <h2 className="font-bold text-4xl mb-6 text-gray-800">
              {t("whoWeAre")}
            </h2>
            <p
              className={`text-gray-600 mb-8 leading-relaxed ${
                i18n.language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t("description")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h5 className="text-green-700 font-semibold mb-4">
                  {t("ourServices")}
                </h5>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✔</span>
                    <span>{t("agriculture")}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✔</span>
                    <span>{t("animal")}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✔</span>
                    <span>{t("equipment")}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✔</span>
                    <span>{t("consulting")}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="text-green-700 font-semibold mb-4">
                  {t("ourVision")}
                </h5>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✔</span>
                    <span>{t("global")}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✔</span>
                    <span>{t("leadership")}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✔</span>
                    <span>{t("innovation")}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2">
            <div className="relative">
              <div
                className={`absolute w-24 h-24 bg-green-200 rounded-lg -z-10 ${
                  i18n.language === "ar" ? "-top-4 -right-4" : "-top-4 -left-4"
                }`}
              ></div>
              <div
                className={`absolute w-24 h-24 bg-green-200 rounded-lg -z-10 ${
                  i18n.language === "ar"
                    ? "-bottom-4 -left-4"
                    : "-bottom-4 -right-4"
                }`}
              ></div>
              <img
                src="farmfusion7-scaled.webp"
                alt={t("teamImageAlt")}
                className="w-full h-auto rounded-lg shadow-xl object-cover border-4 border-green-100"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-3xl font-bold text-gray-800">
                {happyClientsCount}
              </h2>
              <p className="text-gray-500">{t("happyClients")}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-3xl font-bold text-gray-800">
                <TotalProducts />
              </h2>
              <p className="text-gray-500">{t("products")}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-3xl font-bold text-gray-800">
                <TotalBookings />
              </h2>
              <p className="text-gray-500">{t("bookings")}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-3xl font-bold text-gray-800">
                <TotalVet />
              </h2>
              <p className="text-gray-500">{t("vets")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;