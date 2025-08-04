// Component/ui/Toast.js
import React, { useState, useEffect } from "react";


export const toast = ({ message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [message, duration, onClose]);

  if (!visible) return null;

  return (
    <div className="toast">
      <p>{message}</p>
    </div>
  );
};
