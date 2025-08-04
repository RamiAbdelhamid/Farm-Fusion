// /src/components/ui/radio-group.jsx

import React from "react";

// The RadioGroup component is a wrapper for a group of radio buttons
export const RadioGroup = ({ children, value, onValueChange }) => {
  return <div className="space-y-2">{children}</div>;
};

// The RadioGroupItem component represents each individual radio button
export const RadioGroupItem = ({ id, value, checked, onChange, children }) => {
  return (
    <label htmlFor={id} className="flex items-center space-x-2">
      <input
        type="radio"
        id={id}
        name="radio-group"
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300"
      />
      <span className="text-sm text-gray-700">{children}</span>
    </label>
  );
};
