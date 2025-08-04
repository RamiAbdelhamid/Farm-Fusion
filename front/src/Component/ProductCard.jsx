// components/ProductCard.js
import React from "react";
import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { useWishlist } from "../Component/Shared/WishlistContext";

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md group">
      <Link to={`/products/${product._id}`}>
        <div className="h-48 bg-gray-50 overflow-hidden relative">
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{product.discount}%
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <Link to={`/products/${product._id}`} className="hover:text-blue-600">
            <h3 className="font-medium mb-1 truncate">{product.name}</h3>
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Heart
              className={`w-5 h-5 ${
                isInWishlist(product._id)
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center mb-2">
          <div className="flex mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  product.averageRating >= star
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          {product.reviewCount > 0 && (
            <span className="text-xs text-gray-500">
              ({product.reviewCount})
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 font-semibold">{product.price} JD</p>
            {product.oldPrice && (
              <p className="text-xs text-gray-500 line-through">
                {product.oldPrice} JD
              </p>
            )}
          </div>
          <Link
            to={`/products/${product._id}`}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
