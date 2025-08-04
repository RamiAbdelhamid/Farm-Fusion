import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
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
    pageSize: 2,
  });

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
        toast.error(
          error.response?.data?.message || "Failed to fetch user data"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

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
          toast.error("Failed to fetch bookings");
        }
      };
      fetchBookings();
    }
  }, [user, pagination.currentPage]);

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
      toast.success("Information updated successfully");
    } catch (error) {
      console.error(error.response?.data?.message || error.message); // Log error
      toast.error(
        error.response?.data?.message || "Failed to update information"
      );
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
      toast.error("Logout failed");
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
            Loading Farm Profile...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border-4 border-green-600">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-8">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
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
            <div className="text-center md:text-left flex-grow">
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
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="p-8">
          <div className="border-b border-green-200 pb-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-800">
                Personal Information
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
                    <span>Cancel</span>
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
                    <span>Edit</span>
                  </>
                )}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-5 rounded-lg shadow-md">
                    <label className="block text-green-700 font-semibold mb-2">
                      Name
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
                      Email
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
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      name="profilePicture"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 border border-green-300 rounded-lg file:mr-4 file:rounded-full file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-green-700 hover:file:bg-green-100"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
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
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: "Name", value: user.name },
                  { label: "Email", value: user.email },
                  { label: "Role", value: user.role },
                  {
                    label: "Creation Date",
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
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
