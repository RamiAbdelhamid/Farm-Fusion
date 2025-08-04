// /src/components/ui/textarea.jsx

import React from "react";

export const Textarea = ({ value, onChange, placeholder, id }) => {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 w-full"
    />
  );
};
