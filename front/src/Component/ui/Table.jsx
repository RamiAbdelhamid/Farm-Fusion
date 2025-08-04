// /src/components/ui/table.jsx

import React from "react";

// Table component is the wrapper for the entire table
export const Table = ({ children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">{children}</table>
    </div>
  );
};

// TableHeader component defines the header section of the table
export const TableHeader = ({ children }) => {
  return (
    <thead className="bg-gray-100">
      <tr>{children}</tr>
    </thead>
  );
};

// TableRow component represents a row in the table
export const TableRow = ({ children }) => {
  return <tr>{children}</tr>;
};

// TableCell component represents a cell in the table
export const TableCell = ({ children, align = "left" }) => {
  return (
    <td className={`px-4 py-2 text-sm text-gray-700 text-${align}`}>
      {children}
    </td>
  );
};

// TableBody component defines the body section of the table
export const TableBody = ({ children }) => {
  return <tbody>{children}</tbody>;
};

// TableHead component defines the header section of the table
export const TableHead = ({ children }) => {
  return <thead className="bg-gray-100">{children}</thead>;
};