import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import axios from "axios";

const TotalBookings = () => {
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/bookings");
        setTotalBookings(response.data.length);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <>
      <h2 className="font-bold text-3xl mb-1 text-gray-800">{totalBookings}</h2>{" "}
    </>
  );
};

export default TotalBookings;
