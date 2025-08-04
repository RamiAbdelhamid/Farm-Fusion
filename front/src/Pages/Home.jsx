import Navbar from "../Component/Shared/Navbar";
import CategoryCards from "../Component/HomeComponent/Category";
import ThymeCrop from "../Component/HomeComponent/ThymeCrop";
import ChickenSection from "../Component/HomeComponent/ChickenSection";
import Carousel from "../Component/HomeComponent/Carousel";
import Footer from "../Component/Shared/Footer";
import { useRef } from "react";
import PartnerAnimation from "./PartnerAnimation";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const categorySectionRef = useRef(null);

  return (
    <div className="min-h-screen bg-gray-50" dir={t('dir')}>
      <div ref={categorySectionRef} id="category-section">
        {/* Hero Section with Carousel */}
        <section className="relative">
          <Carousel />
        </section>
      </div>

      {/* Categories Section with improved spacing */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">{t('homepage.categories.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('homepage.categories.description')}
          </p>
        </div>
        <CategoryCards />
      </section>

      {/* Featured Products - Thyme Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
              {t('homepage.featured.tag')}
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mt-2">
              {t('homepage.featured.title')}
            </h2>
          </div>
          <ThymeCrop />
        </div>
      </section>

      {/* Chicken Farming Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
            {t('homepage.poultry.tag')}
          </span>
          <h2 className="text-4xl font-bold text-gray-800 mt-2">
            {t('homepage.poultry.title')}
          </h2>
        </div>
        <ChickenSection />
      </section>

      {/* Seasonal Farming Calendar */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
              {t('homepage.calendar.tag')}
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mt-2">
              {t('homepage.calendar.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              {t('homepage.calendar.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Spring */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
              <h3 className="text-xl font-bold text-green-600 mb-3">{t('seasons.spring')}</h3>
              <ul className="space-y-2 text-gray-700">
                {t('homepage.calendar.spring_items', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Summer */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
              <h3 className="text-xl font-bold text-green-600 mb-3">{t('seasons.summer')}</h3>
              <ul className="space-y-2 text-gray-700">
                {t('homepage.calendar.summer_items', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Fall */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
              <h3 className="text-xl font-bold text-green-600 mb-3">{t('seasons.fall')}</h3>
              <ul className="space-y-2 text-gray-700">
                {t('homepage.calendar.fall_items', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Winter */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
              <h3 className="text-xl font-bold text-green-600 mb-3">{t('seasons.winter')}</h3>
              <ul className="space-y-2 text-gray-700">
                {t('homepage.calendar.winter_items', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mt-2">
            {t('homepage.services.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            {t('homepage.services.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/Shop">
            <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 5h12a2 2 0 002-2V7H5.4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t('homepage.services.shop.title')}</h3>
              <p className="text-gray-600">
                {t('homepage.services.shop.description')}
              </p>
            </div>
          </Link>

          <Link to="/HealthGuide">
            <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 4c-2.21 0-4 1.79-4 4v2h8v-2c0-2.21-1.79-4-4-4zm0-10C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {t('homepage.services.health.title')}
              </h3>
              <p className="text-gray-600">
                {t('homepage.services.health.description')}
              </p>
            </div>
          </Link>

          <Link to="/veterinarians">
            <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {t('homepage.services.vet.title')}
              </h3>
              <p className="text-gray-600">
                {t('homepage.services.vet.description')}
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Partners & Suppliers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10"></div>
          <div className="relative h-[800px] perspective-[1500px] mx-auto max-w-7xl">
            <PartnerAnimation />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">{t('homepage.cta.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('homepage.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/veterinarians">
              <button className="px-8 py-3 bg-white text-green-700 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all cursor-pointer">
                {t('homepage.cta.vet_button')}
              </button>
            </a>
            <a href="/shop">
              <button className="px-8 py-3 bg-transparent border-2 border-white rounded-lg font-bold text-lg hover:bg-green-600 transition-all cursor-pointer">
                {t('homepage.cta.products_button')}
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;