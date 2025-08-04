import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  ChevronDown,
  Calendar,
  Tag,
  BookOpen,
} from "lucide-react";

const HealthGuide = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: "all",
    sortBy: "newest",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const modalRef = useRef(null);
  const getLocalizedText = (article, key) => {
    const lang = i18n.language;
    if (lang === "ar" && article[`${key}Ar`]) return article[`${key}Ar`];
    if (lang === "fr" && article[`${key}Fr`]) return article[`${key}Fr`];
    return article[key];
  };
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/articles?page=${currentPage}&limit=${articlesPerPage}`
        );
        const data = await res.json();
        setArticles(data.articles);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Failed to fetch articles", err);
      }
    };

    fetchArticles();
  }, [currentPage, articlesPerPage]);

  useEffect(() => {
    const filtered = articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.tags &&
          article.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      const matchesCategory =
        selectedCategory === "all" || article.category === selectedCategory;

      let matchesDateFilter = true;
      if (advancedFilters.dateRange !== "all") {
        const articleDate = new Date(article.createdAt);
        const currentDate = new Date();

        switch (advancedFilters.dateRange) {
          case "week":
            const weekAgo = new Date();
            weekAgo.setDate(currentDate.getDate() - 7);
            matchesDateFilter = articleDate >= weekAgo;
            break;
          case "month":
            const monthAgo = new Date();
            monthAgo.setMonth(currentDate.getMonth() - 1);
            matchesDateFilter = articleDate >= monthAgo;
            break;
          case "year":
            const yearAgo = new Date();
            yearAgo.setFullYear(currentDate.getFullYear() - 1);
            matchesDateFilter = articleDate >= yearAgo;
            break;
          default:
            matchesDateFilter = true;
        }
      }

      return matchesSearch && matchesCategory && matchesDateFilter;
    });

    // Apply sorting
    const sortedArticles = [...filtered].sort((a, b) => {
      switch (advancedFilters.sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "a-z":
          return a.title.localeCompare(b.title);
        case "z-a":
          return b.title.localeCompare(a.title);
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredArticles(sortedArticles);
  }, [searchTerm, selectedCategory, advancedFilters, articles]);

  // Article Detail Modal
  const ArticleDetailModal = ({ article, onClose }) => {
    if (!article) return null;
    // Function to handle clicks outside the modal
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [onClose]);
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div
          ref={modalRef}
          className={`bg-white/90 backdrop-blur-lg rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl animate-fadeInUp ${i18n.language === "ar" ? "text-right" : "text-left"}`}
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-red-500 hover:text-red-700 cursor-pointer bg-white/80 rounded-full p-2 shadow-lg transition-all"
          >
            <XCircle size={36} />
          </button>
          <div className="flex flex-col md:flex-row items-start mb-8 gap-8">
            <img
              src={`http://localhost:5000${article.imageUrl}`}
              alt={article.title}
              className="w-full md:w-2/5 rounded-2xl mb-4 md:mb-0 object-cover h-64 shadow-lg"
            />
            <div>
              <h2 className="text-3xl font-extrabold text-green-800 mb-3">
                {getLocalizedText(article, "title")}
              </h2>
              <div className="flex items-center mb-2 text-gray-600 gap-2">
                <Calendar size={18} className="text-green-600" />
                <span>
                  {new Date(article.createdAt).toLocaleDateString(i18n.language)}
                </span>
              </div>
              <div className="flex items-center mb-4 text-gray-600 gap-2">
                <BookOpen size={18} className="text-green-600" />
                <span>
                  {t("by")} {article.author || t("unknownAuthor")}
                </span>
              </div>
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 shadow"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-green-700 mb-4">
              {t("articleContent")}
            </h3>
            <div className="text-gray-700 space-y-4 text-lg">
              {getLocalizedText(article, "body")
                .split(/\n{1,2}/)
                .map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>
          {article.references && article.references.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-green-700 mb-3">
                {t("references")}
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {article.references.map((reference, index) => (
                  <li key={index} className="text-gray-700">
                    {reference}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-green-700 mb-3">
                {t("relatedArticles")}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {article.relatedArticles.map((relatedArticle, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 hover:bg-green-50 shadow-sm animate-fadeInUp"
                  >
                    <h4 className="font-semibold text-green-800 mb-1">
                      {i18n.language === "ar" && relatedArticle.titleAr
                        ? relatedArticle.titleAr
                        : relatedArticle.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {i18n.language === "ar" && relatedArticle.descriptionAr
                        ? relatedArticle.descriptionAr
                        : relatedArticle.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleAdvancedFilterChange = (filterName, value) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const ArticleCard = ({ article }) => (
    <div
      className="bg-white/90 backdrop-blur-md border border-green-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-[1.03] hover:brightness-105 transition-all cursor-pointer animate-fadeInUp"
      onClick={() => setSelectedArticle(article)}
    >
      <div className="h-48 overflow-hidden">
        <img
          src={`http://localhost:5000${article.imageUrl}`}
          alt={article.title}
          className="w-full h-full object-cover object-center transition-all duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-green-800">
            {getLocalizedText(article, "title")}
          </h3>
        </div>
        <p className="text-gray-600 italic mb-2 flex items-center gap-1">
          <Calendar size={16} />
          {new Date(article.createdAt).toLocaleDateString(i18n.language)}
        </p>
        <p className="text-gray-700 mb-3">
          {(i18n.language === "ar" && article.bodyAr
            ? article.bodyAr
            : article.body
          ).slice(0, 100)}
          ...
        </p>
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded-full shadow"
              >
                {tag}
              </span>
            ))}
            {article.tags.length > 2 && (
              <span className="px-3 py-1 text-xs bg-gray-50 text-gray-700 rounded-full shadow">
                +{article.tags.length - 2}
              </span>
            )}
          </div>
        )}
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            {t("by")} {article.author || t("unknown")}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedArticle(article);
            }}
            className="text-green-600 hover:text-green-800 font-semibold flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 hover:bg-green-100 transition-all shadow"
          >
            {t("readMore")} <ChevronDown className="ml-1" size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`max-w-6xl mx-auto p-8 md:p-12 bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl animate-fadeIn ${
        i18n.language === "ar" ? "text-right" : "text-left"
      }`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-3">
          {t("agriculturalHealthPlatform")}
        </h1>
        <p className="text-gray-600 text-lg">{t("healthPlatformDescription")}</p>
      </header>
      <div className="bg-white/90 backdrop-blur-md border border-green-100 rounded-2xl p-6 mb-8 shadow-md animate-fadeInUp">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className={`w-full ${i18n.language === "ar" ? "pr-12 pl-4" : "pl-12 pr-4"} py-3 rounded-full shadow focus:ring-2 focus:ring-green-500 focus:border-transparent border border-green-100 bg-white text-lg transition-all`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {i18n.language === "ar" && (
              <Search className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400`} />
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-green-50 hover:bg-green-100 px-5 py-3 rounded-full shadow font-semibold text-green-700 transition-all"
            >
              <Filter size={20} />
              <span>{t("filters")}</span>
            </button>
          </div>
        </div>
        {showFilters && (
          <div className="bg-green-50 p-6 rounded-2xl mb-4 animate-fadeInUp">
            <h3 className="font-semibold text-green-700 mb-4 text-lg">
              {t("advancedFilters")}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  {t("dateRange")}
                </label>
                <select
                  className="w-full border border-green-100 rounded-full px-4 py-3 text-lg shadow focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={advancedFilters.dateRange}
                  onChange={(e) => handleAdvancedFilterChange("dateRange", e.target.value)}
                >
                  <option value="all">{t("allTime")}</option>
                  <option value="week">{t("pastWeek")}</option>
                  <option value="month">{t("pastMonth")}</option>
                  <option value="year">{t("pastYear")}</option>
                </select>
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  {t("sortBy")}
                </label>
                <select
                  className="w-full border border-green-100 rounded-full px-4 py-3 text-lg shadow focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={advancedFilters.sortBy}
                  onChange={(e) => handleAdvancedFilterChange("sortBy", e.target.value)}
                >
                  <option value="newest">{t("newestFirst")}</option>
                  <option value="oldest">{t("oldestFirst")}</option>
                  <option value="a-z">{t("aToZ")}</option>
                  <option value="z-a">{t("zToA")}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-green-800">
            {t("agriculturalHealthArticles")}
          </h2>
          <span className="text-gray-600 text-lg">
            {t("showingArticles", { count: filteredArticles.length })}
          </span>
        </div>
        {filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-green-50 rounded-2xl animate-fadeInUp">
            <AlertCircle className="mx-auto text-green-200 mb-4" size={56} />
            <h3 className="text-2xl font-bold text-gray-700">
              {t("noArticlesFound")}
            </h3>
            <p className="text-gray-500 mt-2 text-lg">{t("adjustSearchFilters")}</p>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-6 py-3 bg-green-600 text-white rounded-full font-bold shadow hover:bg-green-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed text-lg"
        >
          {t("prev")}
        </button>
        <span className="flex items-center px-6 text-gray-700 text-lg font-semibold">
          {t("pageInfo", { current: currentPage, total: totalPages })}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-6 py-3 bg-green-600 text-white rounded-full font-bold shadow hover:bg-green-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed text-lg"
        >
          {t("next")}
        </button>
      </div>
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
};

export default HealthGuide;