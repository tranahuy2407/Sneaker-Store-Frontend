import React from "react";

export default function Breadcrumb({ items = [], className = "" }) {
  return (
    <div
      className={`flex gap-2 items-center text-sm text-gray-500 ${className}`}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="mx-2 text-gray-400">/</span>}
          <span className="flex items-center gap-1">
            {item.icon && item.icon}
            {item.href ? (
              <a
                href={item.href}
                className="transition-colors hover:text-gray-700"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={
                  index === items.length - 1
                    ? "font-medium text-gray-700"
                    : "text-gray-500"
                }
              >
                {item.label}
              </span>
            )}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}
