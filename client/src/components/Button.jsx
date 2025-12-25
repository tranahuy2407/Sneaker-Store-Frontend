import React from "react";

export const Button = ({ children, className = "", variant = "primary", size = "md", ...props }) => {
  let baseClasses =
    "inline-flex items-center justify-center font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  if (size === "sm") baseClasses += " px-3 py-1 text-sm";
  else if (size === "md") baseClasses += " px-4 py-2 text-base";
  else if (size === "lg") baseClasses += " px-5 py-3 text-lg";

  switch (variant) {
    case "outline":
      baseClasses += " border border-gray-300 text-gray-700 hover:bg-gray-50";
      break;
    case "destructive":
      baseClasses += " bg-red-600 text-white hover:bg-red-700";
      break;
    case "secondary":
      baseClasses += " bg-gray-200 text-gray-800 hover:bg-gray-300";
      break;
    default:
      baseClasses += " bg-blue-600 text-white hover:bg-blue-700";
  }

  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};
