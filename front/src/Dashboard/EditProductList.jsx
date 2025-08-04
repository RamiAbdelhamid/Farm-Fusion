import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Trash2,
  Edit,
  RefreshCw,
  Grid,
  List,
  Check,
  AlertTriangle,
  X,
} from "lucide-react";

const EditProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list"); // grid or list view
  const [sortBy, setSortBy] = useState("name"); // sorting option
  const [sortOrder, setSortOrder] = useState("asc"); // sorting direction
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // product ID to delete or null
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Categories list
  const categories = [
    "all",
    "Live Vaccine",
    "vitamins",
    "Disinfectant",
    "Fertilizer",
    "Seeds",
    "Equipment",
  ];

  // Fetch products when page loads
  useEffect(() => {
    fetchProducts();
  }, []);

  // Hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      const activeProducts = response.data.filter(
        (product) => !product.isDeleted
      );
      setProducts(activeProducts);
      showToast("Products loaded successfully", "info");
    } catch (error) {
      console.error("Error fetching products:", error);
      showToast("Failed to load products", "error");
    }
    setLoading(false);
  };

  // Handle soft delete
  const handleSoftDelete = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/products/${id}/soft-delete`
      );
      // Update UI after deletion
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
      setShowDeleteConfirm(null);
      showToast(response.data.message || "Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      showToast("Error deleting product", "error");
    }
  };

  // Sort products
  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      let comparison = 0;

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "price") {
        comparison = parseFloat(a.price) - parseFloat(b.price);
      } else if (sortBy === "category") {
        comparison = a.category.localeCompare(b.category);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  // Filter products based on category and search query
  const filteredProducts = sortProducts(
    products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    })
  );

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("name");
    setSortOrder("asc");
    showToast("Filters have been reset", "info");
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    showToast(`View changed to ${mode} mode`, "info");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Toast notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg transition-all transform-gpu ${
            toast.type === "success"
              ? "bg-emerald-500 text-white"
              : toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          <span className="mr-2">
            {toast.type === "success" ? (
              <Check size={20} />
            ) : toast.type === "error" ? (
              <AlertTriangle size={20} />
            ) : (
              <i className="fas fa-info-circle" />
            )}
          </span>
          <p className="font-medium">{toast.message}</p>
          <button
            onClick={() => setToast({ ...toast, show: false })}
            className="ml-4 text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Products</h2>
        <Link
          to="/add-product"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg font-medium flex items-center"
        >
          <span className="mr-2">+</span> Add New Product
        </Link>
      </div>

      {/* Search and filter bar */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-3 pl-10 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
            />
            <Search
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-3 pl-10 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all appearance-none"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Filter
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
          </div>

          {/* Sort options */}
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="category">Sort by Category</option>
            </select>
            <button
              onClick={() => {
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                showToast(
                  `Order changed to ${
                    sortOrder === "asc" ? "descending" : "ascending"
                  }`,
                  "info"
                );
              }}
              className="p-3 border rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors w-12 flex justify-center"
              title={sortOrder === "asc" ? "Ascending" : "Descending"}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={resetFilters}
              className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors py-1"
            >
              <RefreshCw size={16} className="mr-1" /> Reset Filters
            </button>
            <span className="text-gray-500">
              {filteredProducts.length} products found
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleViewModeChange("list")}
              className={`p-2 rounded-lg ${
                viewMode === "list"
                  ? "bg-emerald-100 text-emerald-600"
                  : "text-gray-500 hover:bg-gray-100"
              } transition-colors`}
              title="List View"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => handleViewModeChange("grid")}
              className={`p-2 rounded-lg ${
                viewMode === "grid"
                  ? "bg-emerald-100 text-emerald-600"
                  : "text-gray-500 hover:bg-gray-100"
              } transition-colors`}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Product display */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-500">
            No products found for the selected category and search query.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 text-emerald-500 hover:text-emerald-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all"
            >
              <div className="relative">
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  className="w-full h-72 object-cover"
                />
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-white text-sm font-medium shadow">
                  {product.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-emerald-600 font-bold mb-2">
                  {product.price} JD
                </p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-between items-center">
                  <Link
                    to={`/edit-product/${product._id}`}
                    onClick={() => showToast(`Editing ${product.name}`, "info")}
                    className="flex items-center bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Edit size={16} className="mr-1" /> Edit
                  </Link>

                  {showDeleteConfirm === product._id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSoftDelete(product._id)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(null);
                          showToast("Deletion cancelled", "info");
                        }}
                        className="bg-gray-50 text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(product._id)}
                      className="flex items-center bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={`http://localhost:5000${product.image}`}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.price} JD
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <Link
                        to={`/edit-product/${product._id}`}
                        onClick={() =>
                          showToast(`Editing ${product.name}`, "info")
                        }
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <span className="flex items-center">
                          <Edit size={14} className="mr-1" /> Edit
                        </span>
                      </Link>
                      {showDeleteConfirm === product._id ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSoftDelete(product._id)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => {
                              setShowDeleteConfirm(null);
                              showToast("Deletion cancelled", "info");
                            }}
                            className="bg-gray-50 text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(product._id)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <span className="flex items-center">
                            <Trash2 size={14} className="mr-1" /> Delete
                          </span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EditProductList;
