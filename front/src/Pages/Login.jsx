import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import axios from "axios";
import { Tractor, Lock, Mail } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Login = ({ switchForm ,onLogin ,setUserRole  }) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const fetchUserRole = async () => {
    try {
      const response = await axios.get(
        "https://farm-fusion-srt9.onrender.com/api/users/get-role",
        { withCredentials: true }
      );
      setUserRole(response.data.role);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user role", error);
      setUserRole(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (rememberMe) {
        localStorage.setItem("email", formData.email);
      } else {
        localStorage.removeItem("email");
      }

      await axios.post("https://farm-fusion-srt9.onrender.com/api/users/login", formData, {
        withCredentials: true,
      });

      await fetchUserRole();

      if (formData.email === "Admin@gmail.com") {
          // نعلم الأب أن المستخدم صار authenticated
  if (typeof onLogin === "function") onLogin();
        navigate("/dashboard");
      } else {
         if (typeof onLogin === "function") onLogin();
  navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || t("loginn.login_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    setError("");
    setIsAuthenticated(true);

    try {
      await axios.post(
        "https://farm-fusion-srt9.onrender.com/api/users/google-login",
        { token: credentialResponse.credential },
        { withCredentials: true }
      );

      await fetchUserRole();
     if (typeof onLogin === "function") onLogin();
navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || t("loginn.google_login_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-12"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <Tractor className="w-12 h-12 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-green-800">
              {t("loginn.app_name")}
            </h2>
          </div>

          <p className="text-center text-gray-600 mb-6">
            {t("loginn.welcome_message")}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 ${
                    i18n.language === "ar" ? "right-0 pr-3" : "left-0 pl-3"
                  } flex items-center pointer-events-none`}
                >
                  <Mail className="h-5 w-5 text-green-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder={t("loginn.email_placeholder")}
                  required
                  className={`block w-full ${
                    i18n.language === "ar" ? "pr-10 pl-3" : "pl-10 pr-3"
                  } py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 ${
                    i18n.language === "ar" ? "right-0 pr-3" : "left-0 pl-3"
                  } flex items-center pointer-events-none`}
                >
                  <Lock className="h-5 w-5 text-green-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder={t("loginn.password_placeholder")}
                  required
                  className={`block w-full ${
                    i18n.language === "ar" ? "pr-10 pl-3" : "pl-10 pr-3"
                  } py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  htmlFor="remember-me"
                  className={`${
                    i18n.language === "ar" ? "mr-2" : "ml-2"
                  } block text-sm text-gray-900`}
                >
                  {t("loginn.remember_me")}
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  {t("loginn.forgot_password")}
                </Link>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {loading ? t("loginn.logging_in") : t("loginn.sign_in")}
            </motion.button>
          </form>

          <div className="mt-6">
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {t("loginn.or_continue_with")}
              </span>
            </div>

            <div className="mt-6">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError(t("loginn.google_loginn_failed"))}
                shape="pill"
                theme="outline"
                width="100%"
                disabled={loading}
                text={i18n.language === "ar" ? "signin_with" : "continue_with"}
              />
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t("loginn.no_account")}{" "}
              <Link
                to="/signup"
                className="text-green-600 hover:text-green-700"
              >
                {t("loginn.sign_up")}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
