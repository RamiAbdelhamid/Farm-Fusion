import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Star,
  Award,
  AlertCircle,
  Clock,
  MapPin,
  Leaf,
  Phone,
} from "lucide-react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const VetBooking = () => {
  const { t, i18n } = useTranslation();
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedVet, setSelectedVet] = useState(null);
  const [emergency, setEmergency] = useState(false);
  const [reason, setReason] = useState("");
  const [reservedDates, setReservedDates] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [departments, setDepartments] = useState([]);
  const [vets, setVets] = useState([]);

  // Alert functions
  const showSuccessAlert = (message) => {
    Swal.fire({
      title: t("alerts.success"),
      text: message,
      icon: "success",
      confirmButtonColor: "#16a34a",
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: t("alerts.error"),
      text: message,
      icon: "error",
      confirmButtonColor: "#dc2626",
    });
  };

  const showWarningAlert = (message) => {
    Swal.fire({
      title: t("alerts.warning"),
      text: message,
      icon: "warning",
      confirmButtonColor: "#d97706",
    });
  };

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "https://farm-fusion-srt9.onrender.com/api/departments",
          { withCredentials: true }
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        if (error.response?.status === 401) {
          showErrorAlert(t("vetBooking.alerts.loginRequired"));
        } else {
          showErrorAlert(t("vetBooking.alerts.departmentsError"));
        }
      }
    };

    fetchDepartments();
  }, [t]);

  // Fetch vets when department is selected
  useEffect(() => {
    if (selectedDepartment) {
      const fetchVets = async () => {
        try {
          const response = await axios.get(
            `https://farm-fusion-srt9.onrender.com/api/vets/by-department/${selectedDepartment}`,
            { withCredentials: true }
          );
          setVets(response.data);
        } catch (error) {
          console.error("Error fetching vets:", error);
          if (error.response?.status === 401) {
            showErrorAlert(t("vetBooking.alerts.loginVets"));
          } else {
            showErrorAlert(t("vetBooking.alerts.vetsError"));
          }
        }
      };

      fetchVets();
    }
  }, [selectedDepartment, t]);

  // Fetch reserved dates when vet is selected
  useEffect(() => {
    if (selectedVet) {
      fetchReservedDates(selectedVet.name);
    } else {
      setReservedDates([]);
    }
  }, [selectedVet]);

  const fetchReservedDates = async (vetName) => {
    try {
      const response = await axios.get(
        `https://farm-fusion-srt9.onrender.com/bookings/vet/${vetName}`,
        { withCredentials: true }
      );
      setReservedDates(response.data);
    } catch (error) {
      console.error("Error fetching reserved dates:", error);
      if (error.response?.status === 401) {
        showErrorAlert(t("vetBooking.alerts.loginDates"));
      } else {
        showErrorAlert(t("vetBooking.alerts.datesError"));
      }
    }
  };

  const getNextAvailableDate = (vetName) => {
    if (!reservedDates || reservedDates.length === 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toLocaleDateString(i18n.language);
    }

    const reservedDateObjects = reservedDates.map((date) => new Date(date));
    let nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1); // Start from tomorrow

    let daysToCheck = 30;
    while (daysToCheck > 0) {
      const isReserved = reservedDateObjects.some(
        (reservedDate) =>
          reservedDate.toDateString() === nextDate.toDateString()
      );

      if (!isReserved) {
        return nextDate.toLocaleDateString(i18n.language);
      }

      nextDate.setDate(nextDate.getDate() + 1);
      daysToCheck--;
    }

    return nextDate.toLocaleDateString(i18n.language);
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (
      !selectedDepartment ||
      !selectedVet ||
      !selectedDate ||
      !reason ||
      !phoneNumber
    ) {
      showWarningAlert(t("vetBooking.alerts.fillAllFields"));
      return;
    }

    if (reservedDates.includes(selectedDate)) {
      showWarningAlert(t("vetBooking.alerts.dateBooked"));
      return;
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ""))) {
      showWarningAlert(t("vetBooking.alerts.validPhone"));
      return;
    }

    const bookingData = {
      department: selectedDepartment,
      vet: selectedVet.name,
      date: selectedDate,
      emergency,
      reason,
      phoneNumber,
    };

    console.log("Booking data:", bookingData);

    try {
      Swal.fire({
        title: t("vetBooking.processing"),
        text: t("vetBooking.pleaseWait"),
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await axios.post("https://farm-fusion-srt9.onrender.com/bookings", bookingData, {
        withCredentials: true,
      });

      Swal.close();
      showSuccessAlert(t("vetBooking.alerts.bookingSuccess"));

      fetchReservedDates(selectedVet.name);
      setSelectedDate("");
      setReason("");
      setPhoneNumber("");
    } catch (error) {
      console.error(error);
      Swal.close();
      console.log("Error response:", error.response?.data);

      if (error.response) {
        if (error.response.status === 401) {
          showErrorAlert(t("vetBooking.alerts.loginBook"));
        } else {
          showErrorAlert(
            error.response.data.message || t("vetBooking.alerts.bookingError")
          );
        }
      } else {
        showErrorAlert(t("vetBooking.alerts.networkError"));
      }
    }
  };

  const DatePicker = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      if (i18n.language === "ar") {
        // Arabic date format
        return date.toLocaleDateString("ar-EG");
      }
      // English format
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return (
      <div className="relative">
        <input
          type="date"
          required
          min={minDate}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
        />

        {selectedVet && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              {t("vetBooking.reservedDates")}:
            </h3>
            <div className="flex overflow-x-auto gap-2">
              {reservedDates.length > 0 ? (
                reservedDates
                  .sort((a, b) => new Date(b) - new Date(a))
                  .map((date, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium shadow-sm"
                    >
                      {formatDate(date)}
                    </span>
                  ))
              ) : (
                <span className="text-sm text-gray-500 italic">
                  {t("vetBooking.noReservedDates")}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="max-w-7xl mx-auto p-4 md:p-8 bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-screen animate-fadeIn"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-green-100 animate-fadeInUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-10 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full opacity-20 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500 rounded-full opacity-10 transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
          <div className="flex items-center gap-4">
            <Leaf className="w-12 h-12 text-white drop-shadow-lg" />
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-2">
                {t("vetBooking.title")}
              </h1>
              <p className="text-green-100 mt-2 text-lg md:text-xl">
                {t("vetBooking.subtitle")}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="flex items-center mb-8 pb-4 border-b border-green-100">
            <MapPin className="w-6 h-6 text-green-600 mr-3" />
            <span className="text-gray-600 text-lg font-semibold">{t("vetBooking.programName")}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1: Department & Emergency */}
            <div className="space-y-8 animate-fadeInUp">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <span className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl shadow">1</span>
                {t("vetBooking.step1")}
              </h2>
              <div className="space-y-4">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => {
                      setSelectedDepartment(dept.id);
                      setSelectedVet(null);
                      setSelectedDate("");
                    }}
                    className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 shadow-md hover:shadow-xl cursor-pointer text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-400 animate-fadeInUp
                      ${
                        selectedDepartment === dept.id
                          ? "border-green-500 bg-green-50 scale-105"
                          : "border-green-100 hover:border-green-300 bg-white"
                      }`}
                  >
                    <span className="text-3xl">{dept.icon}</span>
                    <span className="font-medium text-gray-700">{dept.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-10">
                <button
                  onClick={() => setEmergency(!emergency)}
                  className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 shadow-md cursor-pointer text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-400 animate-fadeInUp
                    ${
                      emergency
                        ? "border-red-500 bg-red-50 scale-105"
                        : "border-green-100 hover:border-red-200 bg-white"
                    }`}
                >
                  <AlertCircle className={`w-7 h-7 ${emergency ? "text-red-500" : "text-gray-400"}`} />
                  <span className="font-medium text-gray-700">{t("vetBooking.emergencyCase")}</span>
                </button>
                {emergency && (
                  <p className="text-sm text-red-500 mt-2 pl-2 animate-fadeIn">
                    {t("vetBooking.emergencyNote")}
                  </p>
                )}
              </div>
            </div>

            {/* Step 2: Vet Selection */}
            <div className="space-y-8 animate-fadeInUp">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <span className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl shadow">2</span>
                {t("vetBooking.step2")}
              </h2>
              {selectedDepartment ? (
                <>
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      {t("vetBooking.selectVet")}
                    </label>
                    <select
                      value={selectedVet ? selectedVet.name : ""}
                      onChange={(e) => {
                        const vet = vets.find((v) => v.name === e.target.value);
                        setSelectedVet(vet);
                      }}
                      className="w-full p-4 border-2 border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-md text-lg"
                    >
                      <option value="">-- {t("vetBooking.selectVetPlaceholder")} --</option>
                      {vets
                        .filter((vet) => vet.department === selectedDepartment)
                        .map((vet) => (
                          <option key={vet.name} value={vet.name}>
                            {t("vetBooking.drPrefix")} {vet.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {selectedVet && (
                    <div className="mt-8 p-6 rounded-2xl border-2 border-green-200 bg-green-50 shadow-md animate-fadeInUp">
                      <div className="flex items-center gap-5 mb-4">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-3xl shadow">
                          {selectedVet.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-2xl text-gray-800">
                            {t("vetBooking.drPrefix")} {selectedVet.name}
                          </h3>
                          <p className="text-base text-gray-600">
                            {selectedVet.experience} {t("vetBooking.yearsExperience")}
                          </p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-base text-gray-600 mb-2 font-semibold">
                          {t("vetBooking.specializations")}:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedVet.specializations.map((spec) => (
                            <span
                              key={spec}
                              className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-base font-medium shadow"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Clock className="w-5 h-5 text-green-600 inline-block mr-2" />
                        <span className="text-base text-gray-700 font-semibold">
                          {t("vetBooking.nextAvailable")}: {getNextAvailableDate(selectedVet.name)}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-500 p-10 bg-gray-50 rounded-2xl border border-dashed border-green-200 animate-fadeInUp">
                  <Leaf className="w-14 h-14 text-green-200 mx-auto mb-4" />
                  <p className="text-lg">{t("vetBooking.selectDepartmentFirst")}</p>
                </div>
              )}
            </div>

            {/* Step 3: Booking Form */}
            <div className="space-y-8 animate-fadeInUp">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <span className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl shadow">3</span>
                {t("vetBooking.step3")}
              </h2>
              <form
                onSubmit={handleBooking}
                className="space-y-8 bg-white/90 p-8 rounded-2xl border border-green-100 shadow-md animate-fadeInUp"
              >
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    {t("vetBooking.selectDate")}
                  </label>
                  <DatePicker />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    {t("vetBooking.phoneNumber")}
                  </label>
                  <div className="relative">
                    <Phone className="w-6 h-6 text-green-600 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={t("vetBooking.phonePlaceholder")}
                      className="w-full pl-14 pr-4 py-4 border-2 border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-md text-lg"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-1">
                    {t("vetBooking.phoneFormat")}
                  </p>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    {t("vetBooking.reasonForVisit")}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-4 border-2 border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-md text-lg"
                    placeholder={t("vetBooking.reasonPlaceholder")}
                  ></textarea>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={
                      !selectedDepartment ||
                      !selectedVet ||
                      !selectedDate ||
                      !reason ||
                      !phoneNumber
                    }
                    className={`w-full bg-green-600 text-white py-4 px-8 rounded-full hover:bg-green-700 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed font-bold shadow-lg flex items-center justify-center gap-3 text-lg ${i18n.language === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <Calendar className="w-6 h-6" />
                    {t("vetBooking.bookAppointment")}
                  </button>
                  {selectedVet && selectedDepartment && (
                    <p className="text-sm text-gray-500 text-center mt-3">
                      You're booking with Dr. {selectedVet.name} for {departments.find((d) => d.id === selectedDepartment)?.name}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 text-center text-base text-gray-600 border-t border-green-100 animate-fadeInUp">
          {t("vetBooking.footer")}
        </div>
      </div>
    </div>
  );
};

export default VetBooking;