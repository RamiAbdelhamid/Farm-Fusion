// /components/ui/card.jsx

import React from "react";

export const Card = ({ children }) => {
  return <div className="bg-white shadow-lg rounded-lg p-6">{children}</div>;
};

export const CardHeader = ({ children }) => {
  return <div className="border-b pb-4 mb-4">{children}</div>;
};

export const CardTitle = ({ children }) => {
  return <h3 className="text-xl font-semibold">{children}</h3>;
};

export const CardDescription = ({ children }) => {
  return <p className="text-sm text-gray-500">{children}</p>;
};

export const CardContent = ({ children }) => {
  return <div className="space-y-4">{children}</div>;
};

export const CardFooter = ({ children }) => {
  return <div className="pt-4 mt-4 border-t">{children}</div>;
};
