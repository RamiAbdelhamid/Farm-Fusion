import * as React from "react";
import { cn } from "../lib/utils";

const HoverCard = ({ children, className }) => {
  return (
    <div className={cn("relative group inline-block", className)}>
      {children}
    </div>
  );
};

const HoverCardTrigger = ({ children, className }) => {
  return <div className={cn("cursor-pointer", className)}>{children}</div>;
};

const HoverCardContent = ({ children, className }) => {
  return (
    <div
      className={cn(
        "absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 border opacity-0 group-hover:opacity-100 transition-opacity",
        className
      )}
    >
      {children}
    </div>
  );
};

export { HoverCard, HoverCardTrigger, HoverCardContent };
