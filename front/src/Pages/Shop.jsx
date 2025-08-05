/********************************************************************************************************* */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  Search,
  ShoppingCart,
  X,
  Plus,
  Eye,
  MapPin,
  Minus,
  Trash2,
  Loader2,
  Filter,
  Pill,
  ArrowRight,
  Info,
  Star,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../Component/ui/hover-card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../Component/Shared/CartContext";
import { Heart as HeartOutline, Heart as HeartFilled } from "lucide-react";
import { useWishlist } from "../Component/Shared/WishlistContext";

const Shop = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";
  const [products, setProducts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [progress, setProgress] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);

  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    cartTotal,
    showCart,
    setShowCart,
  } = useCart();

  const getLocalizedText = (item, key) => {
    const lang = i18n.language;
    if (lang === "ar" && item[`${key}Ar`]) return item[`${key}Ar`];
    if (lang === "fr" && item[`${key}Fr`]) return item[`${key}Fr`];
    return item[key]; // fallback: English
  };
  
  const navigate = useNavigate();

  const getCategoryIcon = (category) => {
    const categoryLC = category.toLowerCase();
    if (categoryLC.includes("vaccine") || categoryLC.includes("vacc")) {
      return <Pill className="w-4 h-4" />;
    } else if (
      categoryLC.includes("medication") ||
      categoryLC.includes("med")
    ) {
      return <Package className="w-4 h-4" />;
    } else {
      return <Info className="w-4 h-4" />;
    }
  };

  const handleCategoryChange = (category) => {
    if (category === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setCurrentPage(1);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    let timer;
    const fetchProducts = async () => {
      setLoading(true);
      setProgress(0);
      // start a timer that bumps progress until we’re done:
      timer = setInterval(() => {
        setProgress((p) => Math.min(p + Math.random() * 10, 95));
      }, 200);
  
      try {
        const { data } = await axios.get(
          "https://farm-fusion-srt9.onrender.com/api/products"
        );
        clearInterval(timer);
        setProgress(100);
        setProducts(data);
      } catch (err) {
        clearInterval(timer);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
    return () => clearInterval(timer);
  }, []);
  

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    const isNotDeleted = product.isDeleted === false;
    return matchesSearch && matchesCategory && isNotDeleted;
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-green-600" />
          <p className="mt-4 text-lg text-gray-600">{t("loadingProducts")}</p>
          <p className="mt-2 text-xl font-bold text-green-700">{progress}%</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-6xl mx-auto p-4 md:p-6 relative bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search
            className={`absolute ${
              isRTL ? "right-3" : "left-3"
            } top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5`}
          />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={`w-full ${
              isRTL ? "pr-12" : "pl-12"
            } py-3 rounded-full shadow focus:ring-2 focus:ring-green-500 focus:border-transparent border border-green-100 bg-white text-lg transition-all`}
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowCart(true)}
            className="relative flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-lg hover:bg-green-50 transition-all border border-green-100"
          >
            <ShoppingCart className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-semibold">{t("cart")}</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      <div
        className={`flex flex-col ${
          isRTL ? "md:flex-row-reverse" : "md:flex-row"
        } gap-8`}
      >
        {/* Product List */}
        <div className="flex-1 order-1 md:order-none">
          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentProducts.map((product, idx) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl overflow-hidden border border-green-100 shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:brightness-105 transition-all relative animate-fadeInUp"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={`https://farm-fusion-srt9.onrender.com${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover object-center transition-all duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <button
                        className="absolute top-3 left-3 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white shadow"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                      >
                        {isInWishlist(product._id) ? (
                          <HeartFilled className="w-5 h-5 text-red-500 fill-red-500" />
                        ) : (
                          <HeartOutline className="w-5 h-5 text-gray-700" />
                        )}
                      </button>
                      <div className="absolute bottom-3 right-3 bg-green-600 text-white font-bold px-3 py-1 rounded-full text-base shadow">
                        {product.price} {t("currency")}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-xl text-gray-800 mb-1 line-clamp-1">
                        {getLocalizedText(product, "name")}
                      </h3>
                      <p className="text-gray-600 text-base mb-3 line-clamp-2">
                        {getLocalizedText(product, "description")}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => addToCart(product)}
                          className="flex-1 bg-green-600 text-white py-2 rounded-full hover:bg-green-700 flex items-center justify-center gap-2 text-base font-semibold shadow transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          {t("addToCart")}
                        </button>
                        <button
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="px-4 py-2 border rounded-full hover:bg-green-50 transition-all flex items-center justify-center shadow"
                          title={t("viewDetails")}
                        >
                          <Eye className="w-5 h-5 text-green-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-full border font-semibold transition-all shadow ${
                        currentPage === 1
                          ? "text-gray-400 border-gray-200 cursor-not-allowed bg-gray-100"
                          : "text-green-700 border-green-200 hover:bg-green-50 bg-white"
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNumber = index + 1;
                        const isCurrentPage = pageNumber === currentPage;
                        const isFirstPage = pageNumber === 1;
                        const isLastPage = pageNumber === totalPages;
                        const isAdjacentToCurrent =
                          Math.abs(pageNumber - currentPage) <= 1;
                        if (
                          !isFirstPage &&
                          !isLastPage &&
                          !isAdjacentToCurrent &&
                          (pageNumber === 2 || pageNumber === totalPages - 1)
                        ) {
                          return (
                            <span
                              key={`ellipsis-${pageNumber}`}
                              className="px-3 py-1 text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }
                        if (
                          !isFirstPage &&
                          !isLastPage &&
                          !isAdjacentToCurrent
                        ) {
                          return null;
                        }
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-4 py-2 rounded-full font-semibold shadow transition-all ${
                              isCurrentPage
                                ? "bg-green-600 text-white"
                                : "border border-green-200 text-green-700 hover:bg-green-50 bg-white"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-full border font-semibold transition-all shadow ${
                        currentPage === totalPages
                          ? "text-gray-400 border-gray-200 cursor-not-allowed bg-gray-100"
                          : "text-green-700 border-green-200 hover:bg-green-50 bg-white"
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </nav>
                </div>
              )}
              <div className="mt-6 text-base text-gray-600 text-center">
                {t("showingResults", {
                  start: indexOfFirstProduct + 1,
                  end: Math.min(indexOfLastProduct, filteredProducts.length),
                  total: filteredProducts.length,
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg animate-fadeInUp">
              <div className="mx-auto h-24 w-24 text-gray-300 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {t("noItemsFound")}
              </h3>
              <p className="mt-2 text-gray-500 text-lg">
                {searchQuery || selectedCategory !== "all"
                  ? t("noItemsMatch")
                  : t("noItemsAvailable")}
              </p>
              <div className="mt-8">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    handleCategoryChange("all");
                  }}
                  className="inline-flex items-center px-6 py-3 rounded-full shadow text-base font-semibold text-white bg-green-600 hover:bg-green-700 transition-all"
                >
                  {t("resetFilters")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Category Sidebar */}
        <div className="w-full md:w-72 flex-shrink-0 order-0 md:order-none">
          <div className="sticky top-8 border border-green-100 rounded-2xl bg-white/80 backdrop-blur-md p-6 shadow-xl animate-fadeInUp">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-2xl text-green-700">
                  {t("categories")}
                </h3>
                <Filter className="w-6 h-6 text-green-600" />
              </div>
              <div className="border-t pt-6">
                <div className="space-y-3">
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className={`w-full text-left px-4 py-3 rounded-full font-semibold transition-all text-lg ${
                      selectedCategory === "all"
                        ? "bg-green-600 text-white shadow-lg"
                        : "hover:bg-green-50 text-green-700"
                    }`}
                  >
                    {t("allProducts")}
                  </button>
                  {Object.keys(categoryCounts).map((category) => {
                    const categoryProducts = products.filter(
                      (product) =>
                        product.category.toLowerCase() ===
                          category.toLowerCase() && product.isDeleted === false
                    );
                    return (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`w-full text-left px-4 py-3 rounded-full font-semibold transition-all flex justify-between items-center text-lg ${
                          selectedCategory === category
                            ? "bg-green-600 text-white shadow-lg"
                            : "hover:bg-green-50 text-green-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(category)}
                          <span className="capitalize">{t(category)}</span>
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold ${
                            selectedCategory === category
                              ? "bg-green-500 text-white"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {categoryProducts.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="border-t mt-6 pt-6">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    handleCategoryChange("all");
                    setCurrentPage(1);
                  }}
                  className="w-full py-3 rounded-full text-green-700 hover:text-green-800 font-bold bg-green-50 hover:bg-green-100 transition-all"
                >
                  {t("resetFilters")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
          <div
            className="absolute inset-0 backdrop-blur-md bg-black/30 transition-opacity"
            onClick={() => setShowCart(false)}
          ></div>
          <div
            className={`absolute inset-y-0 ${
              isRTL ? "left-0" : "right-0"
            } max-w-full flex animate-slideInDrawer`}
          >
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white/90 backdrop-blur-lg shadow-2xl rounded-l-2xl overflow-y-scroll">
                <div className="flex-1 py-8 overflow-y-auto px-6">
                  <div className="flex items-start justify-between mb-6">
                    <h2 className="text-2xl font-bold text-green-700">
                      {t("shoppingCart")}
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 p-2 text-gray-400 hover:text-green-600"
                      onClick={() => setShowCart(false)}
                    >
                      <X className="h-7 w-7" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-8">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-16">
                        <ShoppingCart className="mx-auto h-14 w-14 text-gray-300" />
                        <h3 className="mt-4 text-xl font-bold text-gray-900">
                          {t("cartEmpty")}
                        </h3>
                        <p className="mt-2 text-gray-500 text-lg">
                          {t("startAddingItems")}
                        </p>
                        <div className="mt-8">
                          <button
                            onClick={() => setShowCart(false)}
                            className="inline-flex items-center px-6 py-3 rounded-full shadow text-base font-semibold text-white bg-green-600 hover:bg-green-700 transition-all"
                          >
                            {t("continueShopping")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flow-root">
                        <ul className="-my-6 divide-y divide-green-100">
                          {cartItems.map((item) => (
                            <li key={item._id} className="py-6 flex">
                              <div className="flex-shrink-0 w-24 h-24 border border-green-100 rounded-xl overflow-hidden">
                                <img
                                  src={`https://farm-fusion-srt9.onrender.com${item.image}`}
                                  alt={item.name}
                                  className="w-full h-full object-cover object-center"
                                />
                              </div>
                              <div
                                className={`$${isRTL ? "mr-6" : "ml-6"} flex-1 flex flex-col`}
                              >
                                <div>
                                  <div className="flex justify-between text-lg font-bold text-green-700">
                                    <h3>{getLocalizedText(item, "name")}</h3>
                                    <p className={`${isRTL ? "mr-4" : "ml-4"}`}>
                                      {(item.price * item.quantity).toFixed(2)} {t("currency")}
                                    </p>
                                  </div>
                                  <p className="mt-1 text-base text-gray-500">
                                    {getLocalizedText(item, "category")}
                                  </p>
                                </div>
                                <div className="flex-1 flex items-end justify-between text-base mt-2">
                                  <div className="flex items-center border rounded-full shadow">
                                    <button
                                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                      className="px-4 py-2 text-green-700 hover:bg-green-50 rounded-l-full"
                                    >
                                      <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="px-4 py-2 font-bold">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                      className="px-4 py-2 text-green-700 hover:bg-green-50 rounded-r-full"
                                    >
                                      <Plus className="w-5 h-5" />
                                    </button>
                                  </div>
                                  <div className="flex">
                                    <button
                                      onClick={() => removeFromCart(item._id)}
                                      type="button"
                                      className="font-bold text-red-600 hover:text-red-500 flex items-center gap-1"
                                    >
                                      {isRTL ? (
                                        <>
                                          <span>{t("remove")}</span>
                                          <Trash2 className="w-5 h-5" />
                                        </>
                                      ) : (
                                        <>
                                          <Trash2 className="w-5 h-5" />
                                          <span>{t("remove")}</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                {cartItems.length > 0 && (
                  <div className="border-t border-green-100 py-8 px-6">
                    <div className="flex justify-between text-lg font-bold text-green-700">
                      <p>{t("subtotal")}</p>
                      <p>
                        {cartTotal} {t("currency")}
                      </p>
                    </div>
                    <p className="mt-1 text-base text-gray-500">
                      {t("shippingCalculated")}
                    </p>
                    <div className="mt-8">
                      <button
                        onClick={() => {
                          setShowCart(false);
                          navigate("/checkout");
                        }}
                        className="w-full flex justify-center items-center px-8 py-4 rounded-full shadow text-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-all"
                      >
                        {t("checkout")}
                      </button>
                    </div>
                    <div className="mt-6 flex justify-center text-base text-gray-500">
                      <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-500 font-bold"
                      >
                        {t("clearCart")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;