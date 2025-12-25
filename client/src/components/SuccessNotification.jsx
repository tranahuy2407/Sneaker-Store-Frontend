import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";

export default function SuccessNotification({ message, onClose, duration = 1500 }) {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  return (
    <div className="fixed z-50 overflow-hidden bg-white border-l-4 border-green-500 rounded-lg shadow-lg top-6 right-6 animate-fade-in-up">
      <div className="flex items-center gap-3 px-4 py-3">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <span className="font-medium text-gray-800">{message}</span>
      </div>

      <div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"
        style={{
          width: "100%",
          animation: `shrink ${duration}ms linear forwards`
        }}
      ></div>

      <style>
        {`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>
    </div>
  );
}
