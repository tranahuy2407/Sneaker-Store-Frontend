import React from "react";

export const Input = React.forwardRef(({ className = "", error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full px-3 py-2 border rounded-md placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
      } ${className}`}
      {...props}
    />
  );
});
