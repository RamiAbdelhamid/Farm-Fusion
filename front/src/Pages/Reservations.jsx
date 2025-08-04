import React, { useState, useEffect, useCallback } from "react";
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
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const API_BASE_URL = "https://farm-fusion-srt9.onrender.com";

const Reservations = () => {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [user, setUser] = useState(null);

  // Fetch user data
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Fetch reservations data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/bookings`);
      const doctorReservations = response.data.filter(
        (booking) => booking.notified
      );

      setReservations(doctorReservations);

      const uniqueDoctors = [
        ...new Set(doctorReservations.map((booking) => booking.vet)),
      ];
      setDoctors(uniqueDoctors);

      if (uniqueDoctors.length > 0 && !selectedDoctor) {
        setSelectedDoctor(uniqueDoctors[0]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(t("reservationss.fetchError"));
      toast.error(t("reservationss.fetchError"));
    } finally {
      setLoading(false);
    }
  }, [selectedDoctor, t]);

  // Fetch doctor-specific reservationss
  const fetchDoctorReservations = useCallback(
    async (doctorName) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_BASE_URL}/bookings`);
        const doctorReservations = response.data.filter(
          (booking) => booking.vet === doctorName && booking.notified
        );

        setReservations(doctorReservations);
        setSelectedDoctor(doctorName);
      } catch (err) {
        console.error("Error fetching doctor reservations:", err);
        setError(t("reservationss.doctorFetchError"));
        toast.error(t("reservationss.doctorFetchError"));
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    if (user && user.role === "veterinarian") {
      fetchDoctorReservations(user.name);
    } else {
      fetchData();
    }
  }, [user, fetchData, fetchDoctorReservations]);

  // Mark reservation as completed
  const markAsCompleted = async (bookingId) => {
    const result = await Swal.fire({
      title: t("reservationss.confirmCompleteTitle"),
      text: t("reservationss.confirmCompleteText"),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
      confirmButtonText: t("reservationss.confirmButton"),
      cancelButtonText: t("reservationss.cancelButton"),
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${API_BASE_URL}/bookings/${bookingId}/complete`, {
          completed: true,
        });

        setReservations(
          reservations.map((reservation) =>
            reservation._id === bookingId
              ? { ...reservation, completed: true }
              : reservation
          )
        );

        Swal.fire({
          title: t("reservationss.completedSuccessTitle"),
          text: t("reservationss.markCompletedSuccess"),
          icon: "success",
          confirmButtonColor: "#10B981",
        });
      } catch (err) {
        console.error("Error completing reservation:", err);
        Swal.fire({
          title: t("reservationss.errorTitle"),
          text: t("reservationss.markCompletedError"),
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      }
    }
  };

  // Approve booking
  const approveBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: t("reservationss.confirmApproveTitle"),
      text: t("reservationss.confirmApproveText"),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
      confirmButtonText: t("reservationss.confirmButton"),
      cancelButtonText: t("reservationss.cancelButton"),
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${API_BASE_URL}/bookings/${bookingId}/status`, {
          status: "approved",
        });

        setReservations(
          reservations.map((reservation) =>
            reservation._id === bookingId
              ? { ...reservation, status: "approved" }
              : reservation
          )
        );

        Swal.fire({
          title: t("reservationss.approvedSuccessTitle"),
          text: t("reservationss.approveSuccess"),
          icon: "success",
          confirmButtonColor: "#10B981",
        });
      } catch (err) {
        console.error("Error approving booking:", err);
        Swal.fire({
          title: t("reservationss.errorTitle"),
          text: t("reservationss.approveError"),
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      }
    }
  };

  // Reject booking
  const rejectBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: t("reservationss.confirmRejectTitle"),
      text: t("reservationss.confirmRejectText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: t("reservationss.confirmRejectButton"),
      cancelButtonText: t("reservationss.cancelButton"),
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${API_BASE_URL}/bookings/${bookingId}/status`, {
          status: "rejected",
        });

        setReservations(
          reservations.map((reservation) =>
            reservation._id === bookingId
              ? { ...reservation, status: "rejected" }
              : reservation
          )
        );

        Swal.fire({
          title: t("reservationss.rejectedTitle"),
          text: t("reservationss.rejectSuccess"),
          icon: "success",
          confirmButtonColor: "#10B981",
        });
      } catch (err) {
        console.error("Error rejecting booking:", err);
        Swal.fire({
          title: t("reservationss.errorTitle"),
          text: t("reservationss.rejectError"),
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      }
    }
  };

  // Filter reservations based on selected doctor and active tab
  const filteredReservations = reservations.filter((reservation) => {
    const matchesDoctor = reservation.vet === selectedDoctor;

    if (activeTab === "all") return matchesDoctor;
    if (activeTab === "pending") {
      return (
        matchesDoctor &&
        !reservation.completed &&
        reservation.status !== "rejected"
      );
    }
    if (activeTab === "completed") {
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
          {t("reservationss.status.completed")}
        </span>
      );
    }

    if (status === "approved") {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-sm flex items-center">
          <Check className="w-4 h-4 mr-1" />
          {t("reservationss.status.approved")}
        </span>
      );
    } else if (status === "rejected") {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-sm flex items-center">
          <X className="w-4 h-4 mr-1" />
          {t("reservationss.status.rejected")}
        </span>
      );
    } else if (emergency) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {t("reservationss.status.emergency")}
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {t("reservationss.status.pending")}
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

  // Format date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    const result = await Swal.fire({
      title: t("reservationss.refreshTitle"),
      text: t("reservationss.refreshText"),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: t("reservationss.confirmButton"),
      cancelButtonText: t("reservationss.cancelButton"),
    });

    if (result.isConfirmed) {
      if (user?.role === "veterinarian") {
        await fetchDoctorReservations(user.name);
      } else {
        await fetchData();
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("reservationss.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-20 text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("reservationss.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 p-6 rounded-t-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <PawPrint className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                {t("reservationss.title")}
              </h1>
              <p className="text-green-100 mt-1 sm:mt-2">
                {t("reservationss.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 bg-green-50 rounded-b-xl">
          {doctors.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4" />
              <p>{t("reservationss.noDoctors")}</p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center mx-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t("reservationss.refresh")}
              </button>
            </div>
          ) : (
            <div>
              {/* Doctor Selection */}
              {user?.role !== "veterinarian" && (
                <div className="mb-6">
                  <label className="block text-green-800 mb-2 font-medium">
                    {t("reservationss.selectVet")}:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {doctors.map((doctor) => (
                      <button
                        key={doctor}
                        onClick={() => setSelectedDoctor(doctor)}
                        className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors flex items-center text-sm sm:text-base ${
                          selectedDoctor === doctor
                            ? "bg-green-100 text-green-800 border-2 border-green-300"
                            : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-transparent"
                        }`}
                      >
                        <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        {t("reservationss.drPrefix")} {doctor}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex border-b mb-6 border-green-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-3 py-2 sm:px-4 sm:py-2 font-medium whitespace-nowrap ${
                    activeTab === "pending"
                      ? "text-green-700 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t("reservationss.tabs.pending")}
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`px-3 py-2 sm:px-4 sm:py-2 font-medium whitespace-nowrap ${
                    activeTab === "completed"
                      ? "text-green-700 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t("reservationss.tabs.completed")}
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-2 sm:px-4 sm:py-2 font-medium whitespace-nowrap ${
                    activeTab === "all"
                      ? "text-green-700 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t("reservationss.tabs.all")}
                </button>
              </div>

              {/* Reservations List */}
              {filteredReservations.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-white rounded-lg p-8">
                  <ClipboardList className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>
                    {t("reservationss.noAppointments", {
                      doctor:
                        t("reservationss.drPrefix") + " " + selectedDoctor,
                    })}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {filteredReservations.map((reservation) => (
                    <div
                      key={reservation._id}
                      className={`border rounded-lg p-4 sm:p-5 shadow-sm ${
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
                      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6">
                        {/* Left Side - Reservation Details */}
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {getAnimalIcon(reservation.department)}
                            <span className="text-lg font-medium text-gray-800">
                              {t("reservationss.appointmentWith", {
                                doctor:
                                  t("reservationss.drPrefix") +
                                  " " +
                                  reservation.vet,
                              })}
                            </span>
                            {getStatusBadge(
                              reservation.status,
                              reservation.emergency,
                              reservation.completed
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-5 h-5 text-green-600" />
                            <span>{formatDate(reservation.date)}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="font-medium text-gray-700">
                              {t("reservationss.department")}:
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              {reservation.department}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="font-medium text-gray-700">
                              {t("reservationss.customerPhone")}:
                            </span>
                            <a
                              href={`tel:${reservation.phoneNumber}`}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200"
                            >
                              {reservation.phoneNumber}
                            </a>
                          </div>

                          <div>
                            <h3 className="font-medium text-gray-700 mb-2">
                              {t("reservationss.reason")}:
                            </h3>
                            <p className="text-gray-600 bg-white p-3 rounded border border-gray-200">
                              {reservation.reason}
                            </p>
                          </div>
                        </div>

                        {/* Right Side - Actions */}
                        <div className="flex flex-col gap-3 sm:items-end">
                          <div className="text-right">
                            <span className="text-xs sm:text-sm text-gray-500">
                              {t("reservationss.bookingId")}: {reservation._id}
                            </span>
                          </div>

                          <div className="flex flex-col gap-2 w-full sm:w-auto">
                            {!reservation.completed &&
                              reservation.status !== "approved" &&
                              reservation.status !== "rejected" && (
                                <>
                                  <button
                                    onClick={() =>
                                      approveBooking(reservation._id)
                                    }
                                    className="flex items-center justify-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm sm:text-base"
                                  >
                                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {t("reservationss.approve")}
                                  </button>
                                  <button
                                    onClick={() =>
                                      rejectBooking(reservation._id)
                                    }
                                    className="flex items-center justify-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm sm:text-base"
                                  >
                                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {t("reservationss.reject")}
                                  </button>
                                </>
                              )}

                            {reservation.status === "approved" &&
                              !reservation.completed && (
                                <button
                                  onClick={() =>
                                    markAsCompleted(reservation._id)
                                  }
                                  className="flex items-center justify-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-sm sm:text-base"
                                >
                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                  {t("reservationss.markCompleted")}
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
