import React from "react";
import { useTranslation } from "react-i18next";




// This component renders a section about chicken farming with images, text, and a call-to-action button.
const ThymeCrop = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 px-4 lg:px-8 py-12">
      {/* Image Section */}
      <div className="w-full lg:w-1/2 flex justify-center order-2 lg:order-1">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full bg-green-200 rounded-xl z-0"></div>
          <img
            src="زعتر.jpg"
            alt={t('homepagee.featured.thyme_image_alt')}
            className="rounded-xl shadow-lg w-full max-w-lg object-cover z-10 relative"
          />
          <div className="absolute -bottom-6 -right-6 bg-green-700 text-white p-4 rounded-lg shadow-lg z-20">
            <span className="block text-xl font-bold">{t('homepagee.featured.organic_badge')}</span>
            <span className="text-sm">{t('homepagee.featured.grown_naturally')}</span>
          </div>
        </div>
      </div>

      {/* Text and Content */}
      <div className="w-full lg:w-1/2 order-1 lg:order-2">
        <div className="flex items-center space-x-2 mb-2">
          <div className="h-1 w-16 bg-green-600"></div>
          <span className="text-green-600 font-medium">{t('homepage.featured.tag')}</span>
        </div>
        
        <h2 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-500 mb-10">
          {t('homepagee.featured.section_title')}
        </h2>

        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          {t('homepagee.featured.description_paragraph1')}
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          {t('homepagee.featured.description_paragraph2')}
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-start space-x-2">
            <div className="mt-1 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">{t('homepagee.featured.benefits.organic.title')}</h4>
              <p className="text-sm text-gray-600">
                {t('homepagee.featured.benefits.organic.description')}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="mt-1 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">{t('homepagee.featured.benefits.flavor.title')}</h4>
              <p className="text-sm text-gray-600">
                {t('homepagee.featured.benefits.flavor.description')}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="mt-1 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">{t('homepagee.featured.benefits.health.title')}</h4>
              <p className="text-sm text-gray-600">
                {t('homepagee.featured.benefits.health.description')}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="mt-1 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">{t('homepagee.featured.benefits.sustainable.title')}</h4>
              <p className="text-sm text-gray-600">
                {t('homepagee.featured.benefits.sustainable.description')}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4">
          <a href="/Shop?category=Seeds" className="w-full lg:w-auto">
            <button className="px-6 py-3 text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 font-medium cursor-pointer">
              {t('homepagee.featured.cta_button')}
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThymeCrop;