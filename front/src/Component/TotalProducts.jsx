import React, { useState, useEffect } from "react";
import { Package } from "lucide-react";
import axios from "axios";

const TotalProducts = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        const activeProducts = response.data.filter(
          (product) => !product.isDeleted
        );
        setTotalProducts(activeProducts.length);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <>
      <h2 className="font-bold text-3xl mb-1 text-gray-800">
        {totalProducts}
      </h2>{" "}
     </>
  );
};

export default TotalProducts;
