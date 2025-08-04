import React from "react";
import { Filter, Pill, Info, Package } from "lucide-react";

const CategoryFilter = ({
  selectedCategory,
  handleCategoryChange,
  categoryCounts,
  products,
  setSearchQuery,
}) => {
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

  return (
    <div className="sticky top-6 border rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-gray-800">
            Pet Categories
          </h3>
          <Filter className="w-5 h-5 text-green-600" />
        </div>

        <div className="border-t pt-4">
          <div className="space-y-2">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${
                selectedCategory === "all"
                  ? "bg-green-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              All Products
            </button>

            {Object.keys(categoryCounts).map((category) => {
              const categoryProducts = products.filter(
                (product) =>
                  product.category.toLowerCase() === category.toLowerCase() &&
                  product.isDeleted === false
              );
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition flex justify-between items-center ${
                    selectedCategory === category
                      ? "bg-green-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="capitalize">{category}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === category
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {categoryProducts.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t mt-4 pt-4">
          <button
            onClick={() => {
              setSearchQuery("");
              handleCategoryChange("all");
            }}
            className="w-full py-2 text-green-600 hover:text-green-700 font-medium"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
