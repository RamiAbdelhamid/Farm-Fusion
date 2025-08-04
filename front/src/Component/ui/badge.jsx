// /src/components/ui/badge.jsx

import React from "react";

// The Badge component is used to display status or short labels
export const Badge = ({ children, color = "blue", className = "" }) => {
  const colors = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    red: "bg-red-500 text-white",
    yellow: "bg-yellow-500 text-gray-800",
    gray: "bg-gray-500 text-white",
  };

  return (
    <span
      className={`${colors[color]} inline-block px-3 py-1 text-sm font-medium rounded-full ${className}`}
    >
      {children}
    </span>
  );
};
