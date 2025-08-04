import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Tractor, Wheat, User, Mail, Lock } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Register = ({ switchForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      await axios.post("http://localhost:5000/api/users/register", dataToSend, {
        withCredentials: true,
      });
      
      // Show SweetAlert on success
      await Swal.fire({
        title: "Success!",
        text: "Registration successful!",
        icon: "success",
        confirmButtonText: "Continue",
        confirmButtonColor: "#16a34a", // green-600
      });
      
   await axios.post(
     "http://localhost:5000/api/users/login",
     {
       email: formData.email,
       password: formData.password,
     },
     { withCredentials: true }
   );

   // بعد تسجيل الدخول بنجاح
   navigate("/");

      
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden border-t-4 border-green-600"
      >
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <Tractor className="w-12 h-12 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-[#383838]">
              Create New Account
            </h2>
          </div>

          <p className="text-center text-gray-600 mb-6">
            Join us today and enjoy all the benefits
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-6 text-left">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#383838] mb-1 text-left"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-green-500" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-3 pr-12 rounded-lg border border-[#383838] focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-left"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="register-email"
                className="block text-sm font-medium text-[#383838] mb-1 text-left"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-green-500" />
                </div>
                <input
                  id="register-email"
                  type="email"
                  placeholder="your@email.com"
                  className="w-full p-3 pr-12 rounded-lg border border-[#383838] focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-left"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="register-password"
                className="block text-sm font-medium text-[#383838] mb-1 text-left"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-green-500" />
                </div>
                <input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 pr-12 rounded-lg border border-[#383838] focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-left"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-[#383838] mb-1 text-left"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-green-500" />
                </div>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 pr-12 rounded-lg border border-[#383838] focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-left"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <p className="text-xs text-[#383838] mt-1 text-left">
                Must be at least 8 characters
              </p>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 mt-1 text-green-600 border-[#383838] rounded focus:ring-green-500"
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-[#383838]"
              >
                I agree to the{" "}
                <a href="#" className="text-green-600 hover:text-green-700">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-green-600 hover:text-green-700">
                  Privacy Policy
                </a>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium shadow-md hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </motion.button>
          </form>

          <p className="text-center text-[#383838] mt-8">
            Already have an account?{" "}
            <a href="login" className="text-green-600 hover:text-green-700">
            <button
              onClick={switchForm}
              className="text-green-600 font-medium hover:text-green-700"
            >
              Sign In
            </button></a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;