// /src/components/ui/switch.jsx

import React from 'react';

export const Switch = ({ id, checked, onCheckedChange, label }) => {
  return (
    <div className="flex items-center">
      {label && <label htmlFor={id} className="mr-2 text-sm font-medium">{label}</label>}
      <div className="relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="toggle-checkbox absolute block w-6 h-6 bg-white border-4 rounded-full appearance-none cursor-pointer transition-all duration-300 ease-in-out"
        />
        <span
          className="toggle-label block w-10 h-6 bg-gray-300 rounded-full cursor-pointer"
        />
      </div>
    </div>
  );
};
