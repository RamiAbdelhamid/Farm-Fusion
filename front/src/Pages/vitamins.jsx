import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  ShoppingCart,
  X,
  Plus,
  Eye,
  MapPin,
  Minus,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../Component/ui/hover-card";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Component/Shared/CartContext";
import { Heart as HeartOutline, Heart as HeartFilled } from "lucide-react";
import { useWishlist } from "../Component/Shared/WishlistContext";

const Livevacc = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const { isInWishlist, toggleWishlist } = useWishlist();

  // استخدام context السلة
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

  const navigate = useNavigate();

  // جلب المنتجات من API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);

        // حساب عدد المنتجات في كل فئة
        const counts = response.data.reduce((acc, product) => {
          const category = product.category;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        setCategoryCounts(counts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // تصفية المنتجات بناء على البحث والفئة
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-green-600" />
          <p className="mt-4 text-lg text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      {/* Header with Search and Cart */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search vaccines, medications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>

          <button
            onClick={() => setShowCart(true)}
            className="relative flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <ShoppingCart className="w-5 h-5" />
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-4">Animal Categories</h3>
          <div className="flex flex-wrap gap-4">
            {["all", "Poultry", "cow", "horse", "sheep", "pets"].map(
              (category) => {
                const categoryProducts = products.filter(
                  (product) =>
                    (category === "all" ||
                      product.category.toLowerCase() ===
                        category.toLowerCase()) &&
                    product.isDeleted === false
                );
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg capitalize ${
                      selectedCategory === category
                        ? "bg-green-600 text-white"
                        : "bg-white border hover:bg-gray-50"
                    }`}
                  >
                    {category === "all"
                      ? "All"
                      : `${category} (${categoryProducts.length})`}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity "
            onClick={() => setShowCart(false)}
          ></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Shopping Cart
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 p-2 text-gray-400 hover:text-gray-500"
                      onClick={() => setShowCart(false)}
                    >
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-8">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">
                          Your cart is empty
                        </h3>
                        <p className="mt-1 text-gray-500">
                          Start adding some items to your cart
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={() => setShowCart(false)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                          >
                            Continue Shopping
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flow-root">
                        <ul className="-my-6 divide-y divide-gray-200">
                          {cartItems.map((item) => (
                            <li key={item._id} className="py-6 flex">
                              <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                <img
                                  src={`http://localhost:5000${item.image}`}
                                  alt={item.name}
                                  className="w-full h-full object-cover object-center"
                                />
                              </div>

                              <div className="ml-4 flex-1 flex flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>{item.name}</h3>
                                    <p className="ml-4">
                                      {(item.price * item.quantity).toFixed(2)}{" "}
                                      JD
                                    </p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {item.category}
                                  </p>
                                </div>
                                <div className="flex-1 flex items-end justify-between text-sm">
                                  <div className="flex items-center border rounded-lg">
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item._id,
                                          item.quantity - 1
                                        )
                                      }
                                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-3 py-1">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item._id,
                                          item.quantity + 1
                                        )
                                      }
                                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <div className="flex">
                                    <button
                                      onClick={() => removeFromCart(item._id)}
                                      type="button"
                                      className="font-medium text-red-600 hover:text-red-500 flex items-center"
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      Remove
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
                  <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>{cartTotal} JD</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Shipping and taxes calculated at checkout.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          setShowCart(false);
                          navigate("/checkout");
                        }}
                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                      >
                        Checkout
                      </button>
                    </div>
                    <div className="mt-4 flex justify-center text-sm text-gray-500">
                      <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-500 font-medium"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <HoverCard key={product._id} openDelay={200} closeDelay={100}>
              <HoverCardTrigger>
                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
                  <div className="relative flex items-center">
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

                    <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  <div className="relative">
                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center mb-3 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {product.location || "Nationwide Delivery"}
                    </div>
                    <p className="text-green-600 font-semibold mb-4">
                      {product.price} JD
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </HoverCardTrigger>
            </HoverCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
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
          <h3 className="text-lg font-medium text-gray-900">No items found</h3>
          <p className="mt-2 text-gray-500">
            {searchQuery || selectedCategory !== "all"
              ? "No items match your search or filter criteria. Please try different keywords or categories."
              : "No items available now. Please check back later."}
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Livevacc;
