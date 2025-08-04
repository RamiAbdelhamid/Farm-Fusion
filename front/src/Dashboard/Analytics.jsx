import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart as BarChartIcon,
  Package,
  Check,
  DollarSign,
  Calendar,
  Download,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart,
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
} from "recharts";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    emergencyBookings: 0,
  });
  const [completedReservations, setCompletedReservations] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [periodFilter, setPeriodFilter] = useState("12months");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await axios.get(
          "http://localhost:5000/api/products"
        );
        const activeProducts = productsResponse.data.filter(
          (product) => !product.isDeleted
        );

        // Fetch all bookings
        const bookingsResponse = await axios.get(
          "http://localhost:5000/bookings"
        );
        const allBookings = bookingsResponse.data;

        // Calculate booking statistics
        const completedBookings = allBookings.filter(
          (booking) => booking.completed
        );

        setCompletedReservations(completedBookings.length);

        // Calculate estimated revenue (same as in Dashboard)
        const estimatedRevenue = completedBookings.length * 10; // Assuming 10 JOD per booking

        setStats({
          totalProducts: activeProducts.length,
          lowStock: activeProducts.filter((product) => product.stock < 10)
            .length,
          totalRevenue: estimatedRevenue,
          pendingBookings: allBookings.filter(
            (booking) => booking.status === "pending"
          ).length,
          emergencyBookings: allBookings.filter((booking) => booking.emergency)
            .length,
        });

        // Generate mock monthly data for charts
        generateMonthlyData(allBookings, activeProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate monthly data for the charts
  const generateMonthlyData = (bookings, products) => {
    const year = new Date().getFullYear(); // استخدم نفس السنة دائماً أو اجعلها قابلة للتغيير
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
      const monthStart = new Date(year, i, 1);
      const monthEnd = new Date(year, i + 1, 0);

      const completedInMonth = bookings.filter((booking) => {
        if (!booking.completed || !booking.date) return false;

        const bookingDate = new Date(booking.date);
        return bookingDate >= monthStart && bookingDate <= monthEnd;
      }).length;

      const revenueInMonth = completedInMonth * 10;
      const productsInMonth = products.length;

      months.push({
        name: monthNames[i],
        products: productsInMonth,
        bookings: completedInMonth,
        revenue: revenueInMonth,
      });
    }

    setMonthlyData(months);
  };
  

  const filterData = () => {
    if (periodFilter === "6months") {
      return monthlyData.slice(6);
    } else if (periodFilter === "3months") {
      return monthlyData.slice(9);
    } else {
      return monthlyData;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        <p className="ml-3 text-blue-700">Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="bg-green-700 to-blue-500 p-6 rounded-xl mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Analytics Dashboard
            </h1>
            <p className="text-blue-100">
              Visualize your clinic's performance metrics
            </p>
          </div>
          <Link
            to="/dashboard"
            className="bg-green bg-opacity-20 p-2 rounded hover:bg-opacity-30 transition-colors flex items-center text-white"
          >
            <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Package size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <p className="text-sm text-gray-500">Completed Bookings</p>
              <p className="text-2xl font-bold">{completedReservations}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Check size={24} className="text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            Total bookings successfully completed
          </p>
        </div>

        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">{stats.totalRevenue} JOD</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            Revenue generated from all bookings
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap justify-between items-center">
        <div className="flex items-center mb-2 md:mb-0">
          <BarChartIcon size={20} className="text-green-600 mr-2" />
          <h2 className="text-lg font-semibold">Analytics Charts</h2>
        </div>
        <div className="flex space-x-2">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
          >
            <option value="12months">Last 12 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="3months">Last 3 Months</option>
          </select>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Products Chart */}
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
          <div className="mb-4">
            <h3 className="flex items-center text-lg font-semibold">
              <Package size={18} className="text-green-600 mr-2" /> Products
              Trend
            </h3>
            <p className="text-sm text-gray-500">
              Number of products over time
            </p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filterData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} products`, "Products"]}
                />
                <Legend />
                <Bar dataKey="products" fill="#008236" name="Products" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completed Bookings Chart */}
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
          <div className="mb-4">
            <h3 className="flex items-center text-lg font-semibold">
              <Calendar size={18} className="text-green-600 mr-2" /> Completed
              Bookings
            </h3>
            <p className="text-sm text-gray-500">
              Monthly completed booking trends
            </p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filterData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, "dataMax + 5"]} />
                <Tooltip
                  formatter={(value) => [`${value} bookings`, "Completed"]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#008236"
                  name="Completed Bookings"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Chart - Full Width */}
      <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
        <div className="mb-4">
          <h3 className="flex items-center text-lg font-semibold">
            <DollarSign size={18} className="text-green-600 mr-2" /> Revenue
            Analysis
          </h3>
          <p className="text-sm text-gray-500">
            Monthly revenue trend from bookings
          </p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filterData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, "dataMax + 10"]} />
              <Tooltip formatter={(value) => [`${value} JOD`, "Revenue"]} />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                fill="#008236"
                stroke="#008236"
                name="Revenue (JOD)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
