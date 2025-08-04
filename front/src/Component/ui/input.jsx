// /src/components/ui/input.jsx

import React from "react";

export const Input = ({ value, onChange, placeholder, type = "text", id }) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 transition duration-300"
    />
  );
};
