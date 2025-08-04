import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  AlertCircle,
  CheckCircle,
  ClipboardList,
  User,
  Clock,
  Leaf,
  PawPrint,
  X,
  Check,
  RefreshCw,
} from "lucide-react";

const Reservations = () => {
  const [doctors, setDoctors] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending"); // pending, completed, all
  const [user, setUser] = useState(null); // State to store the current user data

  // Fetch user data (assuming it's stored in localStorage or via context)
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Assuming the current user is stored in localStorage
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Fetch all doctors and their reservations
  useEffect(() => {
    if (user && user.role === "veterinarian") {
      fetchDoctorReservations(user.name);
    } else {
      fetchDoctorsAndReservations();
    }
  }, [user]);

  const fetchDoctorsAndReservations = async () => {
    try {
      setLoading(true);
      // Fetch all bookings
      const response = await axios.get("http://localhost:5000/bookings");

      // Filter to get only bookings that have been notified to doctors
      const doctorReservations = response.data.filter(
        (booking) => booking.notified
      );
      setReservations(doctorReservations);

      // Extract unique vet names
      const uniqueDoctors = [
        ...new Set(doctorReservations.map((booking) => booking.vet)),
      ];
      setDoctors(uniqueDoctors);

      // Set first doctor as selected by default if available
      if (uniqueDoctors.length > 0 && !selectedDoctor) {
        setSelectedDoctor(uniqueDoctors[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        "Failed to load doctors and reservations. Please try again later."
      );
      setLoading(false);
    }
  };

  const fetchDoctorReservations = async (doctorName) => {
    try {
      setLoading(true);
      // Fetch reservations for the specific doctor
      const response = await axios.get("http://localhost:5000/bookings");

      const doctorReservations = response.data.filter(
        (booking) => booking.vet === doctorName && booking.notified
      );
      setReservations(doctorReservations);

      // Set the doctor as the selected one
      setSelectedDoctor(doctorName);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load reservations. Please try again later.");
      setLoading(false);
    }
  };

  // Mark reservation as completed
  const markAsCompleted = async (bookingId) => {
    try {
      await axios.put(`http://localhost:5000/bookings/${bookingId}/complete`, {
        completed: true,
      });

      // Update local state
      setReservations(
        reservations.map((reservation) =>
          reservation._id === bookingId
            ? { ...reservation, completed: true }
            : reservation
        )
      );

      alert("Reservation marked as completed!");
    } catch (error) {
      console.error("Error completing reservation:", error);
      alert("Failed to mark reservation as completed. Please try again.");
    }
  };

  // Approve booking
  const approveBooking = async (bookingId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/bookings/${bookingId}/status`,
        {
          status: "approved",
        }
      );
      // Update the local state to mark this booking as approved
      setReservations(
        reservations.map((reservation) =>
          reservation._id === bookingId
            ? { ...reservation, status: "approved" }
            : reservation
        )
      );
      alert("Booking approved successfully!");
    } catch (error) {
      console.error("Error approving booking:", error);
      alert("Failed to approve booking. Please try again.");
    }
  };

  // Reject booking
  const rejectBooking = async (bookingId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/bookings/${bookingId}/status`,
        {
          status: "rejected",
        }
      );
      // Update the local state to mark this booking as rejected
      setReservations(
        reservations.map((reservation) =>
          reservation._id === bookingId
            ? { ...reservation, status: "rejected" }
            : reservation
        )
      );
      alert("Booking rejected successfully!");
    } catch (error) {
      console.error("Error rejecting booking:", error);
      alert("Failed to reject booking. Please try again.");
    }
  };

  // Filter reservations based on selected doctor and active tab
  const filteredReservations = reservations.filter((reservation) => {
    const matchesDoctor = reservation.vet === selectedDoctor;

    if (activeTab === "all") {
      return matchesDoctor;
    } else if (activeTab === "pending") {
      return (
        matchesDoctor &&
        !reservation.completed &&
        reservation.status !== "rejected"
      );
    } else if (activeTab === "completed") {
      return matchesDoctor && reservation.completed;
    }

    return false;
  });

  // Get status badge
  const getStatusBadge = (status, emergency, completed) => {
    if (completed) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-sm flex items-center">
          <CheckCircle className="w-4 h-4 mr-1" />
          Completed
        </span>
      );
    }

    if (status === "approved") {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-sm flex items-center">
          <Check className="w-4 h-4 mr-1" />
          Approved
        </span>
      );
    } else if (status === "rejected") {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-sm flex items-center">
          <X className="w-4 h-4 mr-1" />
          Rejected
        </span>
      );
    } else if (emergency) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          Emergency
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          Pending
        </span>
      );
    }
  };

  // Determine animal type icon
  const getAnimalIcon = (department) => {
    if (
      department.toLowerCase().includes("farm") ||
      department.toLowerCase().includes("livestock")
    ) {
      return <Leaf className="w-5 h-5 text-green-600" />;
    } else {
      return <PawPrint className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 p-6 rounded-t-xl">
          <div className="flex items-center">
            <PawPrint className="w-8 h-8 text-white mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                Veterinary Appointments
              </h1>
              <p className="text-green-100 mt-2">
                Manage animal care appointments and treatment schedules
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-green-50 rounded-b-xl">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading appointments...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" />
              <p>{error}</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4" />
              <p>No veterinarians with appointments found.</p>
              <button
                onClick={fetchDoctorsAndReservations}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center mx-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          ) : (
            <div>
              {/* Doctor Selection */}
              <div className="mb-6">
                <label className="block text-green-800 mb-2 font-medium">
                  Select Veterinarian:
                </label>
                <div className="flex flex-wrap gap-3">
                  {doctors.map((doctor) => (
                    <button
                      key={doctor}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                        selectedDoctor === doctor
                          ? "bg-green-100 text-green-800 border-2 border-green-300"
                          : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dr. {doctor}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b mb-6 border-green-200">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-4 py-2 font-medium ${
                    activeTab === "pending"
                      ? "text-green-700 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`px-4 py-2 font-medium ${
                    activeTab === "completed"
                      ? "text-green-700 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 font-medium ${
                    activeTab === "all"
                      ? "text-green-700 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All Appointments
                </button>
              </div>

              {/* Reservations List */}
              {filteredReservations.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-white rounded-lg p-8">
                  <ClipboardList className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>
                    No appointments found for Dr. {selectedDoctor} with the
                    selected filter.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredReservations.map((reservation) => (
                    <div
                      key={reservation._id}
                      className={`border rounded-lg p-5 shadow-sm ${
                        reservation.completed
                          ? "border-green-200 bg-green-50"
                          : reservation.status === "approved"
                          ? "border-green-200 bg-white"
                          : reservation.status === "rejected"
                          ? "border-red-200 bg-red-50"
                          : reservation.emergency
                          ? "border-yellow-200 bg-yellow-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        {/* Left Side - Reservation Details */}
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2">
                            {getAnimalIcon(reservation.department)}
                            <span className="text-lg font-medium text-gray-800">
                              Appointment with Dr. {reservation.vet}
                            </span>
                            {getStatusBadge(
                              reservation.status,
                              reservation.emergency,
                              reservation.completed
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-5 h-5 text-green-600" />
                            <span>
                              {new Date(reservation.date).toLocaleDateString(
                                undefined,
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="font-medium text-gray-700">
                              Department:
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              {reservation.department}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="font-medium text-gray-700">
                              Customer Phone:
                            </span>
                            <a
                              href={`tel:${reservation.phoneNumber}`}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200"
                            >
                              {reservation.phoneNumber}
                            </a>
                          </div>

                          <div>
                            <h3 className="font-medium text-gray-700 mb-2">
                              Reason for Visit:
                            </h3>
                            <p className="text-gray-600 bg-white p-3 rounded border border-gray-200">
                              {reservation.reason}
                            </p>
                          </div>
                        </div>

                        {/* Right Side - Actions */}
                        <div className="flex flex-col gap-3">
                          <div className="text-right">
                            <span className="text-sm text-gray-500">
                              Booking ID: {reservation._id}
                            </span>
                          </div>

                          <div className="flex flex-col gap-2 mt-2">
                            {!reservation.completed &&
                              reservation.status !== "approved" &&
                              reservation.status !== "rejected" && (
                                <>
                                  <button
                                    onClick={() =>
                                      approveBooking(reservation._id)
                                    }
                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                                  >
                                    <Check className="w-4 h-4" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      rejectBooking(reservation._id)
                                    }
                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                    Reject
                                  </button>
                                </>
                              )}

                            {reservation.status === "approved" &&
                              !reservation.completed && (
                                <button
                                  onClick={() =>
                                    markAsCompleted(reservation._id)
                                  }
                                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Mark as Completed
                                </button>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservations;
