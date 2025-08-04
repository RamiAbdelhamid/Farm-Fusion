// /src/components/ui/select.jsx

import React, { useState } from "react";

// The main Select component
export const Select = ({ children, value, onValueChange }) => {
  return <div className="relative inline-block w-full">{children}</div>;
};

// SelectTrigger component that triggers the dropdown
export const SelectTrigger = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-2 px-4 border border-gray-300 bg-white rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </button>
  );
};

// SelectValue component to display the selected value
export const SelectValue = ({ children }) => {
  return <span className="block text-sm text-gray-700">{children}</span>;
};

// SelectItem component for each individual item in the dropdown
export const SelectItem = ({ children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="py-2 px-4 cursor-pointer text-gray-700 hover:bg-gray-100"
    >
      {children}
    </div>
  );
};

export const SelectContent = ({ children }) => {
  return (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
      {children}
    </div>
  );
};
