import React from "react";

export default function CustomTooltip({ text, children }) {
  return (
    <div className="relative inline-block group">
      {children}

      {/* Tooltip box */}
      <div
        className="absolute invisible px-2 py-1 text-xs text-white transition-all duration-200 -translate-x-1/2 bg-black rounded-md shadow-lg opacity-0  left-1/2 -top-10 group-hover:opacity-100 group-hover:visible whitespace-nowrap"
      >
        {text}

        {/* Arrow */}
        <div
          className="absolute w-2 h-2 rotate-45 -translate-x-1/2 bg-black  left-1/2 -bottom-1"
        />
      </div>
    </div>
  );
}
