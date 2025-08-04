// /src/components/ui/button.jsx

import React from "react";

export const Button = ({
  children,
  onClick,
  variant = "solid",
  size = "md",
}) => {
  const variants = {
    solid: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-100",
  };

  const sizes = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} ${sizes[size]} rounded-md transition duration-300`}
    >
      {children}
    </button>
  );
};
