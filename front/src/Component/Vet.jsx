import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import axios from "axios";

const TotalVet = () => {
  const [totalVets, setTotalVets] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/vets");
        console.log("API Response:", response.data); // Debug log

        // Handle different response structures
        const vetsData = Array.isArray(response.data)
          ? response.data
          : response.data.vets || [];

        setTotalVets(vetsData.length);
      } catch (error) {
        console.error("Error fetching vets:", error);
        setTotalVets(0); // Fallback to 0 on error
      } finally {
        setLoading(false);
      }
    };

    fetchVets();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading vets...</div>;
  }

  return (
    <>
      <h2 className="font-bold text-3xl mb-1 text-gray-800">{totalVets}</h2>{" "}
    </>
  );
};

export default TotalVet;
