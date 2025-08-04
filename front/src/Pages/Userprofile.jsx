


import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    profilePicture: null,
  });
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    pageSize: 3,
  });
  const [activeTab, setActiveTab] = useState(0);
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          withCredentials: true,
        });
        setUser(res.data.user);
        setUpdatedUser({
          name: res.data.user.name,
          email: res.data.user.email,
          profilePicture: res.data.user.profilePicture,
        });
      } catch (error) {
        toast.error(error.response?.data?.message || t("profile.fetchError"));
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [t]);

  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/bookings/user?page=${pagination.currentPage}&limit=${pagination.pageSize}`,
            {
              withCredentials: true,
            }
          );
          setBookings(res.data.bookings);
          setPagination({
            currentPage: res.data.currentPage,
            totalPages: res.data.totalPages,
            totalBookings: res.data.totalBookings,
            pageSize: res.data.pageSize,
          });
        } catch (error) {
          toast.error(t("profile.bookingsError"));
        }
      };
      fetchBookings();
    }
  }, [user, pagination.currentPage, t]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setUpdatedUser((prev) => ({ ...prev, profilePicture: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", updatedUser.name);
    formData.append("email", updatedUser.email);
    if (updatedUser.profilePicture) {
      formData.append("profilePicture", updatedUser.profilePicture);
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUser(res.data.user);
      setIsEditing(false);
      toast.success(t("profile.updateSuccess"));
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || t("profile.updateError"));
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        { withCredentials: true }
      );
      window.location.href = "/login";
    } catch (error) {
      toast.error(t("profile.logoutError"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-100 to-green-200">
        <div className="flex items-center space-x-4 p-6 bg-white rounded-xl shadow-lg">
          <svg
            className="animate-spin h-8 w-8 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-green-800 font-semibold">
            {t("profile.loading")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border-4 border-green-600">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-8">
          <div
            className={`flex flex-col md:flex-row items-center space-y-4 md:space-y-0 ${
              isRTL ? "md:space-x-reverse" : "md:space-x-6"
            }`}
          >
            {user.profilePicture ? (
              <img
                src={`http://localhost:5000${user.profilePicture}`}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg transform hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-32 h-32 bg-green-300 rounded-full flex items-center justify-center text-5xl text-green-800 font-bold border-4 border-white shadow-lg">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div
              className={`text-center ${
                isRTL ? "md:text-right" : "md:text-left"
              } flex-grow`}
            >
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-green-200 mb-2">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{t("profile.signOut")}</span>
            </button>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="p-8">
          <div className="border-b border-green-200 pb-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-800">
                {t("profile.personalInfo")}
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                {isEditing ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{t("profile.cancel")}</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span>{t("profile.edit")}</span>
                  </>
                )}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-5 rounded-lg shadow-md">
                    <label className="block text-green-700 font-semibold mb-2">
                      {t("profile.name")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={updatedUser.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="bg-green-50 p-5 rounded-lg shadow-md">
                    <label className="block text-green-700 font-semibold mb-2">
                      {t("profile.email")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      readOnly
                      value={updatedUser.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="bg-green-50 p-5 rounded-lg shadow-md md:col-span-2">
                    <label className="block text-green-700 font-semibold mb-2">
                      {t("profile.profilePicture")}
                    </label>
                    <input
                      type="file"
                      name="profilePicture"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 border border-green-300 rounded-lg file:mr-4 file:rounded-full file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-green-700 hover:file:bg-green-100"
                    />
                  </div>
                </div>
                <div
                  className={`flex ${isRTL ? "justify-start" : "justify-end"}`}
                >
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{t("profile.saveChanges")}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: t("profile.name"), value: user.name },
                  { label: t("profile.email"), value: user.email },
                  { label: t("profile.role"), value: user.role },
                  {
                    label: t("profile.creationDate"),
                    value: new Date(user.createdAt).toLocaleDateString(),
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-green-50 p-5 rounded-lg shadow-md"
                  >
                    <label className="block text-green-700 font-semibold mb-2">
                      {item.label}
                    </label>
                    <p className="text-green-900 font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bookings Section with Tabs */}
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-6">
              {t("profile.vetBookings")}
            </h2>

            {bookings.length === 0 ? (
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto mb-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                <p className="text-green-800">{t("profile.noBookings")}</p>
              </div>
            ) : (
              <div className="bg-green-50 rounded-lg shadow-md">
                {/* Tab navigation */}
                <div className="flex border-b border-green-200">
                  {bookings.map((booking, index) => (
                    <button
                      key={booking._id}
                      className={`flex-1 py-3 px-4 focus:outline-none ${
                        activeTab === index
                          ? "bg-white text-green-800 font-bold border-t-2 border-r border-l border-green-300 rounded-t-lg"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                      onClick={() => setActiveTab(index)}
                    >
                      {new Date(booking.date).toLocaleDateString()}
                      {booking.emergency && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          !
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="p-6">
                  {bookings.map((booking, index) => (
                    <div
                      key={booking._id}
                      className={`${activeTab === index ? "block" : "hidden"}`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-green-800">
                          {t("profile.vetConsultation")}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.emergency
                              ? "bg-red-500 text-white"
                              : "bg-green-200 text-green-800"
                          }`}
                        >
                          {booking.emergency
                            ? t("profile.emergency")
                            : t("profile.routine")}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="font-semibold text-green-700">
                            {t("profile.veterinarian")}
                          </p>
                          <p className="text-green-900">{booking.vet}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="font-semibold text-green-700">
                            {t("profile.date")}
                          </p>
                          <p className="text-green-900">
                            {new Date(booking.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm md:col-span-2">
                          <p className="font-semibold text-green-700">
                            {t("profile.reasonForVisit")}
                          </p>
                          <p className="text-green-900">{booking.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {bookings.length > 0 && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-6">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("profile.previous")}
                </button>
                <span className="text-green-800">
                  {t("profile.page")} {pagination.currentPage} {t("profile.of")}{" "}
                  {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("profile.next")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;