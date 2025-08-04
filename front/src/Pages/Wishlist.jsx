import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart as HeartFilled,
  Heart,
  ShoppingCart,
  Info,
} from "lucide-react";
import { useWishlist } from "../Component/Shared/WishlistContext";
import { useCart } from "../Component/Shared/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const WishlistItem = ({
  product,
  onMoveToCart,
  onToggleWishlist,
  onViewDetails,
  isRTL,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      <div className="relative overflow-hidden rounded-t-xl">
        <div className="h-56 bg-gray-50 flex items-center justify-center relative">
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.name}
            className="max-w-full max-h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            onClick={onViewDetails}
          />
          <button
            onClick={onToggleWishlist}
            className={`absolute top-3 ${
              isRTL ? "left-3" : "right-3"
            } p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-300`}
          >
            <HeartFilled className="w-5 h-5 text-red-500 fill-red-500" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3
            className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer"
            onClick={onViewDetails}
          >
            {product.name}
          </h3>
          <p className="text-green-600 font-bold text-xl">
            {product.price} {product.currency}
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onViewDetails}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors"
          >
            <Info className="w-4 h-4" />
            {isRTL ? "عرض التفاصيل" : "View Details"}
          </button>
          <button
            onClick={onMoveToCart}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            {isRTL ? "أضف للسلة" : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Wishlist = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isRTL = i18n.language === "ar";

  const moveToCart = (product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      currency: product.currency || "JD",
    });
    toggleWishlist(product);
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center ${
            isRTL ? "space-x-reverse" : "space-x-4"
          } mb-8`}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>

          <div
            className={`flex items-center ${
              isRTL ? "space-x-reverse" : "space-x-3"
            }`}
          >
            <h1 className="text-3xl font-bold text-gray-800">
              {t("wishlist.title")}
            </h1>
            <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
              {wishlist.length} {t("wishlist.items")}
            </span>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm"
          >
            <HeartFilled className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              {t("wishlist.emptyTitle")}
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {t("wishlist.emptyMessage")}
            </p>
            <Link
              to="/Shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {t("wishlist.continueShopping")}
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {wishlist.map((product) => (
                <WishlistItem
                  key={product._id}
                  product={{
                    ...product,
                    isInWishlist: true,
                    currency: product.currency || "JD",
                  }}
                  onMoveToCart={() => moveToCart(product)}
                  onToggleWishlist={() => toggleWishlist(product)}
                  onViewDetails={() => handleViewDetails(product._id)}
                  isRTL={isRTL}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
