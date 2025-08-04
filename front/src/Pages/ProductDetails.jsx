

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Heart,
  Share2,
  ArrowRight,
  Facebook,
  Instagram,
  MessageSquare,
  Eye,
} from "lucide-react";
import axios from "axios";
import { Heart as HeartOutline, Heart as HeartFilled } from "lucide-react";
import { useWishlist } from "../Component/Shared/WishlistContext";
import ReviewForm from "../Component/ReviewForm";
import ReviewsList from "../Component/ReviewsList";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../Component/Shared/CartContext";

const ProductDetails = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const productUrl = `${window.location.origin}/products/${id}`;
  const shareMessage = `${t('productDetails.checkOut')} ${product?.name} - ${productUrl}`;
  const getLocalizedText = (item, key) => {
    const lang = i18n.language;
    if (lang === "ar" && item[`${key}Ar`]) return item[`${key}Ar`];
    if (lang === "fr" && item[`${key}Fr`]) return item[`${key}Fr`];
    return item[key]; // fallback to English
  };
  
  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        productUrl
      )}`,
      "_blank"
    );
    setShowShareOptions(false);
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
      "_blank"
    );
    setShowShareOptions(false);
  };

  const shareOnInstagram = () => {
    window.open(
      `https://www.instagram.com/?url=${encodeURIComponent(productUrl)}`,
      "_blank"
    );
    setShowShareOptions(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const productRes = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(productRes.data);

        const reviewsRes = await axios.get(
          `http://localhost:5000/api/reviews/product/${id}`
        );
        setReviews(reviewsRes.data);

        const userData = await axios
          .get("http://localhost:5000/api/users/me", { withCredentials: true })
          .catch((error) => {
            console.log("Error fetching user data:", error);
            return null;
          });

        if (userData) {
          setCurrentUserId(userData.data._id);
        } else {
          setCurrentUserId(null);
        }

        if (productRes.data.category) {
          const relatedResponse = await axios.get(
            `http://localhost:5000/api/products?category=${productRes.data.category}&limit=4`
          );
          setRelatedProducts(
            relatedResponse.data.filter(
              (item) => item._id !== productRes.data._id
            )
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  const handleReviewDeleted = (reviewId) => {
    setReviews(reviews.filter((review) => review._id !== reviewId));
  };

  const handleReviewUpdated = (updatedReview) => {
    setReviews((prev) =>
      prev.map((review) =>
        review._id === updatedReview._id ? updatedReview : review
      )
    );
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 p-6 bg-red-50 text-red-500 rounded-lg">
        <p className="text-lg font-semibold">{t('productDetails.errorLoading')}</p>
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          {t('productDetails.goBack')}
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center mt-10 text-red-500">
        {t('productDetails.notFound')}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 relative">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> {t("productDetails.back")}
      </button>

      <div className="bg-white rounded-xl overflow-hidden shadow-md mb-8">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 bg-gray-50">
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              className="w-full h-full object-contain max-h-96 lg:max-h-full"
            />
          </div>

          <div className="lg:w-1/2 p-6 flex flex-col">
            <div>
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold mb-2">
                  {getLocalizedText(product, "name")}
                </h2>
                <div className="flex gap-2">
                  <div>
                    <button
                      className="p-2 rounded-full hover:bg-gray-100"
                      onClick={() => toggleWishlist(product)}
                    >
                      {isInWishlist(product._id) ? (
                        <HeartFilled className="w-5 h-5 text-red-500 fill-red-500" />
                      ) : (
                        <HeartOutline className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100"
                      onClick={() => setShowShareOptions(!showShareOptions)}
                    >
                      <Share2 className="w-5 h-5 text-gray-500" />
                    </button>

                    {showShareOptions && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                        <button
                          onClick={shareOnFacebook}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                          {t("productDetails.shareFacebook")}
                        </button>
                        <button
                          onClick={shareOnWhatsApp}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <MessageSquare className="w-4 h-4 mr-2 text-green-500" />
                          {t("productDetails.shareWhatsApp")}
                        </button>
                        <button
                          onClick={shareOnInstagram}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Instagram className="w-4 h-4 mr-2 text-pink-500" />
                          {t("productDetails.shareInstagram")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold text-green-600">
                  {product.price} {t("productDetails.currency")}
                </p>
                {product.oldPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    {product.oldPrice} {t("productDetails.currency")}
                  </p>
                )}
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">
                    {t("productDetails.category")}
                  </p>
                  <p className="font-medium">
                    {getLocalizedText(product, "category")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">
                    {t("productDetails.availability")}
                  </p>
                  <p className="font-medium text-green-500">
                    {t("productDetails.inStock")}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
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

                   
                      </div>






            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
        <div className="border-b">
          <div className="flex">
            {["description", "details", "reviews"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-4 font-medium capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {t(`productDetails.${tab}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "description" && (
            <div>
              <p className="text-gray-700 mb-6">
                {getLocalizedText(product, "description")}
              </p>
            </div>
          )}
          {activeTab === "details" && (
            <div>
              <p className="text-gray-700">
                {getLocalizedText(product, "details") ||
                  t("productDetails.noDetails")}
              </p>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="border-b pb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {t("productDetails.customerReviews")}
                  </h3>
                  {reviews.length > 0 ? (
                    <ReviewsList
                      reviews={reviews}
                      currentUserId={currentUserId}
                      onReviewDeleted={handleReviewDeleted}
                      onReviewUpdated={handleReviewUpdated}
                    />
                  ) : (
                    <p className="text-gray-600">
                      {t("productDetails.noReviews")}
                    </p>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-4">
                  {t("productDetails.writeReview")}
                </h3>
                {currentUserId ? (
                  <ReviewForm
                    productId={id}
                    onReviewAdded={handleReviewAdded}
                  />
                ) : (
                  <p className="text-gray-600">
                    {t("productDetails.loginToReview")}{" "}
                    <a href="/login" className="text-blue-600 hover:underline">
                      {t("productDetails.login")}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">
              {t("productDetails.relatedProducts")}
            </h3>
            <Link
              to="/Livevacc"
              className="text-blue-600 flex items-center gap-1 hover:underline"
            >
              {t("productDetails.viewAll")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.slice(0, 4).map((related) => (
              <div
                key={related.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-gray-50">
                  <img
                    src={`http://localhost:5000${related.image}`}
                    alt={related.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-1 truncate">{related.name}</h4>
                  <p className="text-blue-600 font-semibold">
                    {related.price} {t("productDetails.currency")}
                  </p>
                  <button
                    onClick={() => navigate(`/product/${related._id}`)}
                    className="mt-2 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
                  >
                    {t("productDetails.viewDetails")}
                  </button>
                </div>


              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

