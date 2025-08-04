// /src/components/ui/tabs.jsx

import React from "react";

export const Tabs = ({ children, defaultValue }) => {
  return <div className="tabs">{children}</div>;
};

export const TabsList = ({ children, className }) => {
  return <div className={`tabs-list ${className}`}>{children}</div>;
};

export const TabsTrigger = ({ children, value }) => {
  return <div className="tabs-trigger">{children}</div>;
};

export const TabsContent = ({ children, value }) => {
  return <div className="tabs-content">{children}</div>;
};
