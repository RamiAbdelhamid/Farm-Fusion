// /src/components/ui/label.jsx

import React from "react";

export const Label = ({ children, htmlFor }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700"
    >
      {children}
    </label>
  );
};
