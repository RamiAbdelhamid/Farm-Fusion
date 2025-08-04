import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams(); // الحصول على معرّف المنتج من الرابط
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    details: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null); // تخزين الصورة الجديدة (إذا كانت موجودة)
  const navigate = useNavigate();

  // جلب بيانات المنتج عند تحميل الصفحة
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(response.data); // تعيين بيانات المنتج
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // تحديث بيانات المنتج
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // التعامل مع صورة المنتج
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // تخزين الصورة الجديدة
  };

  // التعامل مع تقديم النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // إضافة الحقول التي تم تعديلها فقط إلى formData
    if (product.name) formData.append("name", product.name);
    if (product.description)
      formData.append("description", product.description);
    if (product.price) formData.append("price", product.price);
    if (product.category) formData.append("category", product.category);
    if (product.details) formData.append("details", product.details);

    // إذا كانت الصورة مرفوعة، إضافة الصورة الجديدة
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/products/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // التأكد من نوع البيانات
          },
        }
      );
      alert("Product updated successfully");
      navigate("/Dashboard/products"); // العودة إلى صفحة الداشبورد بعد التحديث
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Error updating product");
    }
  };

  if (loading) {
    return <p>Loading product...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Price Field */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price (JD)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Category Field */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Details Field */}
        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-700"
          >
            Details
          </label>
          <textarea
            id="details"
            name="details"
            value={product.details}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Image Field */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Product Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            className="w-full mt-2 px-4 py-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
