// /src/components/ui/dialog.jsx

import React, { useState } from "react";

// Dialog component serves as the wrapper for the modal dialog
export const Dialog = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {children}
        <button
          className="absolute top-2 right-2 text-gray-700"
          onClick={onClose}
        >
          X
        </button>
      </div>
    </div>
  );
};

// DialogContent component holds the content of the dialog
export const DialogContent = ({ children }) => {
  return <div className="space-y-4">{children}</div>;
};

// DialogDescription component represents a short description in the dialog
export const DialogDescription = ({ children }) => {
  return <p className="text-sm text-gray-600">{children}</p>;
};

// DialogFooter component contains actions like buttons (e.g., Save, Cancel)
export const DialogFooter = ({ children }) => {
  return <div className="mt-4 flex justify-end space-x-4">{children}</div>;
};

// DialogHeader component represents the header (title) section of the dialog
export const DialogHeader = ({ children }) => {
  return <div className="text-xl font-bold text-gray-800">{children}</div>;
};

// DialogTitle component represents the title of the dialog
export const DialogTitle = ({ children }) => {
  return <h2 className="text-xl font-semibold">{children}</h2>;
};

// DialogTrigger component to trigger the dialog open event
export const DialogTrigger = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded-md"
    >
      {children}
    </button>
  );
};
