import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Leaf, FileText, User, Image, Check, X, Upload } from "lucide-react";





const AddFarmArticle = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const [formData, setFormData] = useState({
    title: {
      en: "",
      ar: "",
      fr: "",
    },
    body: {
      en: "",
      ar: "",
      fr: "",
    },
    author: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "author") {
      setFormData({ ...formData, author: value });
    } else {
      // For title and body fields, update the nested object
      const fieldName = name.replace(`${selectedLanguage}-`, "");
      setFormData({
        ...formData,
        [fieldName]: {
          ...formData[fieldName],
          [selectedLanguage]: value,
        },
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
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

    const data = new FormData();
    data.append("title", formData.title.en);
    data.append("body", formData.body.en);
    data.append("author", formData.author);
    data.append("titleAr", formData.title.ar);
    data.append("bodyAr", formData.body.ar);
    data.append("titleFr", formData.title.fr);
    data.append("bodyFr", formData.body.fr);

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      const response = await axios.post(
        "https://farm-fusion-srt9.onrender.com/api/articles",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showToast(t("articleAddedSuccess"));
      setFormData({
        title: {
          en: "",
          ar: "",
          fr: "",
        },
        body: {
          en: "",
          ar: "",
          fr: "",
        },
        author: "",
      });
      setImageFile(null);
      setPreview(null);
    } catch (error) {
      showToast(t("errorAddingArticle") + error.message, "error");
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
    const placeholders = {
      en: {
        title: "Enter article title",
        body: "Write your article content here...",
      },
      ar: {
        title: "أدخل عنوان المقال",
        body: "اكتب محتوى المقالة هنا...",
      },
      fr: {
        title: "Entrez le titre de l'article",
        body: "Écrivez le contenu de votre article ici...",
      },
    };

    return (
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label
            htmlFor={`${selectedLanguage}-title`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("articleTitle")}
          </label>
          <input
            type="text"
            id={`${selectedLanguage}-title`}
            name={`${selectedLanguage}-title`}
            value={formData.title[selectedLanguage]}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder={placeholders[selectedLanguage].title}
            required
            dir={getInputDir(selectedLanguage)}
          />
        </div>

        <div>
          <label
            htmlFor={`${selectedLanguage}-body`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("articleContent")}
          </label>
          <textarea
            id={`${selectedLanguage}-body`}
            name={`${selectedLanguage}-body`}
            rows="10"
            value={formData.body[selectedLanguage]}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder={placeholders[selectedLanguage].body}
            required
            dir={getInputDir(selectedLanguage)}
          />
        </div>
      </div>
    );
  };

  // Show progress for each language's content completion
  const getLanguageCompletion = (lang) => {
    let completed = 0;
    let total = 2; // title and body

    if (formData.title[lang]) completed++;
    if (formData.body[lang]) completed++;

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
              <X className="h-5 w-5" />
            ) : (
              <Check className="h-5 w-5" />
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
              {t("confirmArticleAddition")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("confirmAddArticleMessage")}
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
          {t("addNewArticle")}
        </h2>
      </div>

      <form onSubmit={handleSubmitConfirmation} className="space-y-5">
        {/* Common fields section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("author")}
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("featuredImage")}
            </label>
            <div className="flex items-center">
              <label className="w-full flex flex-col items-center px-4 py-2 bg-white text-green-600 rounded-lg border border-green-300 cursor-pointer hover:bg-green-50 transition-colors">
                {preview ? (
                  <div className="flex items-center">
                    <Image className="h-6 w-6 mr-2" />
                    <span className="text-sm">
                      {imageFile ? imageFile.name : t("imageSelected")}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Upload className="h-6 w-6 mr-2" />
                    <span className="text-sm">{t("selectImage")}</span>
                  </div>
                )}
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  required={!preview}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Image preview */}
        {preview && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {t("imagePreview")}
            </h3>
            <div className="relative max-w-xs">
              <img
                src={preview}
                alt="Preview"
                className="rounded-md border border-gray-300"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Language selector tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleLanguageChange("en")}
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
              onClick={() => handleLanguageChange("fr")}
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
              onClick={() => handleLanguageChange("ar")}
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
            {t("contentIn")}{" "}
            {selectedLanguage === "en"
              ? t("english")
              : selectedLanguage === "fr"
              ? t("french")
              : t("arabic")}
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
                <span className="text-sm text-gray-500">
                  {getLanguageCompletion("en")}%
                </span>
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
                <span className="text-sm text-gray-500">
                  {getLanguageCompletion("fr")}%
                </span>
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
                <span className="text-sm text-gray-500">
                  {getLanguageCompletion("ar")}%
                </span>
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
              getLanguageCompletion("en") === 100 &&
              getLanguageCompletion("fr") === 100 &&
              getLanguageCompletion("ar") === 100 &&
              formData.author &&
              preview
                ? ""
                : "opacity-70 cursor-not-allowed"
            }`}
            disabled={
              !(
                getLanguageCompletion("en") === 100 &&
                getLanguageCompletion("fr") === 100 &&
                getLanguageCompletion("ar") === 100 &&
                formData.author &&
                preview
              )
            }
          >
            {t("addArticle")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFarmArticle;
