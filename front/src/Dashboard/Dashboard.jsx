import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Calendar,
  Clipboard,
  Droplet,
  Sun,
  Wind,
  Cloud,
  CloudRain,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Package,
  AlertTriangle,
  ShoppingBag,
  DollarSign,
  PlusCircle,
  CalendarPlus,
  User,
  Filter,
  AlertCircle,
  Check,
  X,
  Clock,
  Sidebar,
} from "lucide-react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";


import Analytics from "./Analytics";
const Dashboard = () => {
  const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#facc15",
    "#f472b6",
    "#a78bfa",
    "#38bdf8",
  ];

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedReservations, setCompletedReservations] = useState(0);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    emergencyBookings: 0,
  });
  const [weather, setWeather] = useState({
    temp: 0,
    humidity: 0,
    wind: 0,
    description: "",
    icon: "sun",
    forecast: [],
  });
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [recentBookings, setRecentBookings] = useState([]);
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    emergency: 0,
  });
  const [reservedDates, setReservedDates] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const generateMonthlyData = (bookings, products) => {
    const currentDate = new Date();
    const months = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 0; i < 12; i++) {
      const month = new Date(currentDate.getFullYear(), i, 1);
      const monthStart = new Date(currentDate.getFullYear(), i, 1);
      const monthEnd = new Date(currentDate.getFullYear(), i + 1, 0);

      const monthName = monthNames[i];
      const year = currentDate.getFullYear();

      const completedInMonth = bookings.filter((booking) => {
        const bookingDate = new Date(booking.date);
        return (
          booking.completed &&
          bookingDate >= monthStart &&
          bookingDate <= monthEnd
        );
      }).length;

      const revenueInMonth = completedInMonth * 10;
      const productsInMonth = products.length;

      months.push({
        name: `${monthName}`,
        bookings: completedInMonth,
        revenue: revenueInMonth,
        products: productsInMonth,
      });
    }

    return months;
  };
  // 🔁 تصفية البيانات للحجوزات
  const pieBookingData = monthlyData
    .filter((entry) => entry.bookings > 0)
    .map((entry) => ({
      name: entry.name,
      value: entry.bookings,
    }));

  // 🔁 تصفية البيانات للإيرادات
  const pieRevenueData = monthlyData
    .filter((entry) => entry.revenue > 0)
    .map((entry) => ({
      name: entry.name,
      value: entry.revenue,
    }));
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await axios.get(
          "https://farm-fusion-srt9.onrender.com/api/products"
        );
        const activeProducts = productsResponse.data.filter(
          (product) => !product.isDeleted
        );
        setProducts(activeProducts.slice(0, 5)); // Just get the first 5 for the dashboard
        setStats({
          totalProducts: activeProducts.length,
        });

        // Fetch all bookings
        const bookingsResponse = await axios.get(
          "https://farm-fusion-srt9.onrender.com/bookings"
        );
        const allBookings = bookingsResponse.data;

        // Get the 5 most recent bookings
        const sortedBookings = [...allBookings].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentBookings(sortedBookings.slice(0, 5));

        // Calculate booking statistics
        const completedBookings = allBookings.filter(
          (booking) => booking.completed
        );
        const pendingBookings = allBookings.filter(
          (booking) => booking.status === "pending"
        );
        const approvedBookings = allBookings.filter(
          (booking) => booking.status === "approved"
        );
        const emergencyBookings = allBookings.filter(
          (booking) => booking.emergency
        );

        setCompletedReservations(completedBookings.length);

        // Calculate estimated revenue (you can adjust this calculation based on your business logic)
        const estimatedRevenue = completedBookings.length * 10; // Assuming 50 JOD per booking

        setBookingStats({
          total: allBookings.length,
          pending: pendingBookings.length,
          approved: approvedBookings.length,
          completed: completedBookings.length,
          emergency: emergencyBookings.length,
        });

        setStats({
          totalProducts: activeProducts.length,
          lowStock: activeProducts.filter((product) => product.stock < 10)
            .length,
          totalRevenue: estimatedRevenue,
          pendingBookings: pendingBookings.length,
          emergencyBookings: emergencyBookings.length,
        });
        const monthly = generateMonthlyData(allBookings, activeProducts);
        setMonthlyData(monthly);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch doctors
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("https://farm-fusion-srt9.onrender.com/api/doctors");
        if (response.data && response.data.length > 0) {
          const formattedDoctors = response.data.map((doctor) => ({
            id: doctor._id,
            name: `Dr. ${doctor.name}`,
          }));

          setDoctors(formattedDoctors);

          if (formattedDoctors.length > 0) {
            setSelectedDoctor(formattedDoctors[0].id);
            // Fetch reserved dates for the first doctor
            fetchReservedDates(formattedDoctors[0].name.replace("Dr. ", ""));
          }
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    const fetchReservedDates = async (vetName) => {
      try {
        const response = await axios.get(
          `https://farm-fusion-srt9.onrender.com/api/bookings/vet/${vetName}`
        );
        setReservedDates(response.data);
      } catch (error) {
        console.error("Error fetching reserved dates:", error);
      }
    };

    fetchWeatherData();
    fetchData();
    fetchDoctors();
  }, []);
  //******************************************************************** */

  //********************************************************************

  // Update reserved dates when doctor changes
  useEffect(() => {
    if (selectedDoctor) {
      const doctor = doctors.find((d) => d.id === selectedDoctor);
      if (doctor) {
        const vetName = doctor.name.replace("Dr. ", "");
        const fetchReservedDates = async () => {
          try {
            const response = await axios.get(
              `https://farm-fusion-srt9.onrender.com/api/bookings/vet/${vetName}`
            );
            setReservedDates(response.data);
          } catch (error) {
            console.error("Error fetching reserved dates:", error);
          }
        };
        fetchReservedDates();
      }
    }
  }, [selectedDoctor, doctors]);

  const fetchWeatherData = async () => {
    try {
      const API_KEY = "c97533b51c204ec682e83651252003";
      const CITY = "Amman";

      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?q=${CITY}&key=${API_KEY}&days=5&aqi=no&alerts=no`
      );

      if (response.status === 200) {
        const currentWeather = response.data.current;

        const forecastData = response.data.forecast.forecastday.map(
          (forecast) => {
            const dayName = new Date(forecast.date).toLocaleString("en-us", {
              weekday: "short",
            });

            return {
              day: dayName,
              temp: Math.round(forecast.day.avgtemp_c),
              icon: getWeatherIcon(forecast.day.condition.text),
            };
          }
        );

        setWeather({
          temp: Math.round(currentWeather.temp_c),
          humidity: currentWeather.humidity,
          wind: Math.round(currentWeather.wind_kph),
          description: currentWeather.condition.text,
          icon: getWeatherIcon(currentWeather.condition.text),
          forecast: forecastData,
        });
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const getWeatherIcon = (condition) => {
    const conditions = {
      Clear: "sun",
      Clouds: "cloud",
      Rain: "rain",
      Drizzle: "rain",
      Thunderstorm: "rain",
      Snow: "snow",
      Mist: "cloud",
      Fog: "cloud",
      "Partly cloudy": "cloud",
      Overcast: "cloud",
    };

    return conditions[condition] || "sun";
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case "addProduct":
        navigate("/add-product");
        break;
      case "newBooking":
        navigate("/bookings/new");
        break;
      case "schedule":
        navigate("/calendar");
        break;
      case "reports":
        navigate("/reports");
        break;
      default:
        break;
    }
  };

  // Get today's date for the calendar highlight
  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  // Generate calendar days for current month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // Parse reserved dates for the calendar
  const parsedReservedDays = reservedDates.map((dateStr) => {
    const date = new Date(dateStr);
    return date.getDate();
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        <p className="ml-3 text-blue-700">Loading the dashboard...</p>
      </div>
    );
  }

  const renderWeatherIcon = (icon) => {
    switch (icon) {
      case "sun":
        return <Sun size={20} className="mx-auto my-1 text-yellow-500" />;
      case "cloud":
        return <Cloud size={20} className="mx-auto my-1 text-gray-500" />;
      case "rain":
        return <CloudRain size={20} className="mx-auto my-1 text-blue-500" />;
      default:
        return <Sun size={20} className="mx-auto my-1 text-yellow-500" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 p-6 rounded-xl mb-6">
        <h1 className="text-2xl font-bold text-white">Welcome Back, Admin</h1>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Package size={24} className="text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <ArrowUp size={12} /> Active products
          </p>
        </div>

        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Bookings</p>
              <p className="text-2xl font-bold">{stats.pendingBookings}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-yellow-600 mt-2 flex items-center">
            <ArrowUp size={12} /> Needs attention
          </p>
        </div>

        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Bookings</p>
              <p className="text-2xl font-bold">{completedReservations}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Check size={24} className="text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <ArrowUp size={12} /> Total completed
          </p>
        </div>

        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">{stats.totalRevenue} JOD</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign size={24} className="text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <ArrowUp size={12} /> Revenue to date
          </p>
        </div>
      </div>
  {/*Statistcis */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-10 w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          📊 Monthly Distribution
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 🔵 Bookings Pie */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2 text-center">
              🟢 Bookings Distribution
            </h3>
            {pieBookingData.length === 0 ? (
              <p className="text-gray-500 text-center">
                No bookings to display
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieBookingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieBookingData.map((entry, index) => (
                      <Cell
                        key={`bookings-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* 🟣 Revenue Pie */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2 text-center">
              🟣 Revenue Distribution (JOD)
            </h3>
            {pieRevenueData.length === 0 ? (
              <p className="text-gray-500 text-center">No revenue data</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieRevenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value} JOD`}
                  >
                    {pieRevenueData.map((entry, index) => (
                      <Cell
                        key={`revenue-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>















      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
              <h2 className="font-semibold text-lg text-blue-800">
                Recent Bookings
              </h2>
              <Link
                to="./DoctorReservations"
                className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
              >
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="p-4">
              {recentBookings.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4" />
                  <p>No bookings found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vet
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Emergency
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentBookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-900">
                                Dr. {booking.vet}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {booking.department}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(booking.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(
                                booking.status
                              )}`}
                            >
                              {booking.status.charAt(0).toUpperCase() +
                                booking.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                booking.emergency
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {booking.emergency ? "Emergency" : "Regular"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm space-x-2"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
              <h2 className="font-semibold text-lg text-blue-800">
                Recent Products
              </h2>
              <Link
                to="./products"
                className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
              >
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="p-4">
              {products.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4" />
                  <p>No products found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <img
                                src={`https://farm-fusion-srt9.onrender.com${product.image}`}
                                alt={product.name}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                              <span className="font-medium text-gray-900">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {product.category}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {product.price} JOD
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Booking Statistics */}
          <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
              <h2 className="font-semibold text-lg text-blue-800">
                Booking Statistics
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Bookings</span>
                  <span className="font-medium">{bookingStats.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-medium">{bookingStats.pending}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (bookingStats.pending / bookingStats.total) * 100 || 0
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Approved</span>
                  <span className="font-medium">{bookingStats.approved}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (bookingStats.approved / bookingStats.total) * 100 || 0
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-medium">{bookingStats.completed}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-500 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (bookingStats.completed / bookingStats.total) * 100 || 0
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Emergency Cases</span>
                  <span className="font-medium">{bookingStats.emergency}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (bookingStats.emergency / bookingStats.total) * 100 || 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Widget */}
          <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
              <h2 className="font-semibold text-lg text-blue-800">
                Weather Information
              </h2>
            </div>
            <div className="p-4">
              <div className="text-center p-2">
                <div className="flex items-center justify-center mb-2">
                  {renderWeatherIcon(weather.icon)}
                  <span className="text-2xl font-bold ml-2">
                    {weather.temp}°C
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{weather.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-blue-50 p-2 rounded flex items-center justify-center">
                    <Droplet size={16} className="text-blue-600 mr-1" />
                    <span>Humidity: {weather.humidity}%</span>
                  </div>
                  <div className="bg-blue-50 p-2 rounded flex items-center justify-center">
                    <Wind size={16} className="text-blue-600 mr-1" />
                    <span>Wind: {weather.wind} km/h</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-5 gap-1">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="text-center">
                    <p className="text-xs font-medium">{day.day}</p>
                    {renderWeatherIcon(day.icon)}
                    <p className="text-sm">{day.temp}°C</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

  
    </div>
  );
};

export default Dashboard;
