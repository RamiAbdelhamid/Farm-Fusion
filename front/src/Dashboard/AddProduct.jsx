import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const AddProduct = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  
  const [productData, setProductData] = useState({
    name: "",
    nameAr: "",
    nameFr: "",
    description: "",
    descriptionAr: "",
    descriptionFr: "",
    price: "",
    category: "",
    categoryAr: "",
    categoryFr: "",
    details: "",
    detailsAr: "",
    detailsFr: "",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      setProductData((prevData) => ({
        ...prevData,
        image: files[0],
      }));
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleSubmitConfirmation = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("nameAr", productData.nameAr);
    formData.append("nameFr", productData.nameFr);
    formData.append("description", productData.description);
    formData.append("descriptionAr", productData.descriptionAr);
    formData.append("descriptionFr", productData.descriptionFr);
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("categoryAr", productData.categoryAr);
    formData.append("categoryFr", productData.categoryFr);
    formData.append("details", productData.details);
    formData.append("detailsAr", productData.detailsAr);
    formData.append("detailsFr", productData.detailsFr);
    formData.append("image", productData.image);
    
    try {
      const response = await axios.post(
        "http://localhost:5000/api/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      showToast(t(response.data.message) || t("productAddedSuccess"));
      setProductData({
        name: "",
        nameAr: "",
        nameFr: "",
        description: "",
        descriptionAr: "",
        descriptionFr: "",
        price: "",
        category: "",
        categoryAr: "",
        categoryFr: "",
        details: "",
        detailsAr: "",
        detailsFr: "",
        image: null,
      });
    } catch (error) {
      showToast(t("errorAddingProduct") + error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get input direction based on language
  const getInputDir = (lang) => {
    return lang === "ar" ? "rtl" : "ltr";
  };

  // Render fields for the selected language
  const renderLanguageFields = () => {
    switch (selectedLanguage) {
      case "en":
        return (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("productName")}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={productData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("category")}
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={productData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("description")}
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={productData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label
                htmlFor="details"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("details")}
              </label>
              <textarea
                id="details"
                name="details"
                rows="3"
                value={productData.details}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
        );
      case "ar":
        return (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="nameAr"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("productName")}
              </label>
              <input
                type="text"
                id="nameAr"
                name="nameAr"
                value={productData.nameAr}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
                dir="rtl"
              />
            </div>

            <div>
              <label
                htmlFor="categoryAr"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("category")}
              </label>
              <input
                type="text"
                id="categoryAr"
                name="categoryAr"
                value={productData.categoryAr}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
                dir="rtl"
              />
            </div>

            <div>
              <label
                htmlFor="descriptionAr"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("description")}
              </label>
              <textarea
                id="descriptionAr"
                name="descriptionAr"
                rows="3"
                value={productData.descriptionAr}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
                dir="rtl"
              />
            </div>

            <div>
              <label
                htmlFor="detailsAr"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("details")}
              </label>
              <textarea
                id="detailsAr"
                name="detailsAr"
                rows="3"
                value={productData.detailsAr}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
                dir="rtl"
              />
            </div>
          </div>
        );
      case "fr":
        return (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="nameFr"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("productName")}
              </label>
              <input
                type="text"
                id="nameFr"
                name="nameFr"
                value={productData.nameFr}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label
                htmlFor="categoryFr"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("category")}
              </label>
              <input
                type="text"
                id="categoryFr"
                name="categoryFr"
                value={productData.categoryFr}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label
                htmlFor="descriptionFr"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("description")}
              </label>
              <textarea
                id="descriptionFr"
                name="descriptionFr"
                rows="3"
                value={productData.descriptionFr}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label
                htmlFor="detailsFr"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("details")}
              </label>
              <textarea
                id="detailsFr"
                name="detailsFr"
                rows="3"
                value={productData.detailsFr}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Show progress for each language's content completion
  const getLanguageCompletion = (lang) => {
    let completed = 0;
    let total = 4; // name, category, description, details
    
    if (lang === "en") {
      if (productData.name) completed++;
      if (productData.category) completed++;
      if (productData.description) completed++;
      if (productData.details) completed++;
    } else if (lang === "ar") {
      if (productData.nameAr) completed++;
      if (productData.categoryAr) completed++;
      if (productData.descriptionAr) completed++;
      if (productData.detailsAr) completed++;
    } else if (lang === "fr") {
      if (productData.nameFr) completed++;
      if (productData.categoryFr) completed++;
      if (productData.descriptionFr) completed++;
      if (productData.detailsFr) completed++;
    }
    
    return Math.round((completed / total) * 100);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 border border-green-100 relative"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg flex items-center space-x-2 animate-fade-in-down ${
            toast.type === "error"
              ? "bg-red-100 text-red-800 border-l-4 border-red-500"
              : "bg-green-100 text-green-800 border-l-4 border-green-500"
          }`}
        >
          <div
            className={`p-1 rounded-full ${
              toast.type === "error" ? "bg-red-200" : "bg-green-200"
            }`}
          >
            {toast.type === "error" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
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
            )}
          </div>
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {t("confirmProductAddition")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("confirmAddProductMessage")}
            </p>

            <div
              className={`flex gap-2 ${
                isRTL ? "justify-start" : "justify-end"
              }`}
            >
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("submitting")}...
                  </span>
                ) : (
                  t("confirm")
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`flex items-center mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <div className="w-2 h-8 bg-green-600 rounded mr-3"></div>
        <h2 className="text-2xl font-semibold text-gray-800">
          {t("addNewProduct")}
        </h2>
      </div>

      <form onSubmit={handleSubmitConfirmation} className="space-y-5">
        {/* Common fields section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("price")}
            </label>
            <div className="relative">
              <input
                type="number"
                id="price"
                name="price"
                value={productData.price}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                {t("currency")}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("uploadImage")}
            </label>
            <div className="flex items-center">
              <label className="w-full flex flex-col items-center px-4 py-2 bg-white text-green-600 rounded-lg border border-green-300 cursor-pointer hover:bg-green-50 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="mt-1 text-sm leading-normal">
                  {productData.image ? productData.image.name : t("selectImage")}
                </span>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  className="hidden"
                  required={!productData.image}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Language selector tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setSelectedLanguage("en")}
              className={`py-2 px-4 rounded-t-md transition-colors ${
                selectedLanguage === "en"
                  ? "bg-green-100 border border-b-0 border-gray-200 text-green-700 font-medium"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{t("english")}</span>
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="relative w-4 h-4 bg-gray-200 rounded-full">
                    <div 
                      className="absolute top-0 left-0 h-full rounded-full bg-green-500" 
                      style={{ width: `${getLanguageCompletion("en")}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setSelectedLanguage("fr")}
              className={`py-2 px-4 rounded-t-md transition-colors ${
                selectedLanguage === "fr"
                  ? "bg-green-100 border border-b-0 border-gray-200 text-green-700 font-medium"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{t("french")}</span>
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="relative w-4 h-4 bg-gray-200 rounded-full">
                    <div 
                      className="absolute top-0 left-0 h-full rounded-full bg-green-500" 
                      style={{ width: `${getLanguageCompletion("fr")}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setSelectedLanguage("ar")}
              className={`py-2 px-4 rounded-t-md transition-colors ${
                selectedLanguage === "ar"
                  ? "bg-green-100 border border-b-0 border-gray-200 text-green-700 font-medium"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{t("arabic")}</span>
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="relative w-4 h-4 bg-gray-200 rounded-full">
                    <div 
                      className="absolute top-0 left-0 h-full rounded-full bg-green-500" 
                      style={{ width: `${getLanguageCompletion("ar")}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Language-specific fields */}
        <div className="p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-medium mb-4">
            {t("contentIn")} {selectedLanguage === "en" ? t("english") : selectedLanguage === "fr" ? t("french") : t("arabic")}
          </h3>
          {renderLanguageFields()}
        </div>

        {/* Progress overview */}
        <div className="p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-medium mb-3">{t("completionStatus")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{t("english")}</span>
                <span className="text-sm text-gray-500">{getLanguageCompletion("en")}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${getLanguageCompletion("en")}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{t("french")}</span>
                <span className="text-sm text-gray-500">{getLanguageCompletion("fr")}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${getLanguageCompletion("fr")}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{t("arabic")}</span>
                <span className="text-sm text-gray-500">{getLanguageCompletion("ar")}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${getLanguageCompletion("ar")}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className={isRTL ? "text-left" : "text-right"}>
          <button
            type="submit"
            className={`px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors ${
              (getLanguageCompletion("en") === 100 && 
               getLanguageCompletion("fr") === 100 && 
               getLanguageCompletion("ar") === 100 && 
               productData.price && 
               productData.image) ? "" : "opacity-70 cursor-not-allowed"
            }`}
            disabled={!(getLanguageCompletion("en") === 100 && 
                      getLanguageCompletion("fr") === 100 && 
                      getLanguageCompletion("ar") === 100 && 
                      productData.price && 
                      productData.image)}
          >
            {t("addProduct")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;