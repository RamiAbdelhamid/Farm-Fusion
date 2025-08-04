// Component/ui/alert-dialog.jsx
import React from "react";

export const AlertDialog = ({ children }) => {
  return <div className="alert-dialog">{children}</div>;
};

export const AlertDialogHeader = ({ children }) => {
  return <div className="alert-dialog-header">{children}</div>;
};

export const AlertDialogTrigger = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className="alert-dialog-trigger">
      {children}
    </button>
  );
};

export const AlertDialogContent = ({ children }) => {
  return <div className="alert-dialog-content">{children}</div>;
};

export const AlertDialogTitle = ({ children }) => {
  return <h3 className="alert-dialog-title">{children}</h3>;
};

export const AlertDialogDescription = ({ children }) => {
  return <p className="alert-dialog-description">{children}</p>;
};

export const AlertDialogFooter = ({ children }) => {
  return <div className="alert-dialog-footer">{children}</div>;
};

export const AlertDialogAction = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className="alert-dialog-action">
      {children}
    </button>
  );
};

export const AlertDialogCancel = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className="alert-dialog-cancel">
      {children}
    </button>
  );
};
