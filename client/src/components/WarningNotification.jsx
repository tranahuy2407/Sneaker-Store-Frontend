import React, { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function WarningNotification({
  message,
  onClose,
  duration = 2000,
}) {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  return (
    <div className="fixed z-50 overflow-hidden bg-white border-l-4 border-yellow-500 rounded-lg shadow-lg top-6 right-6 animate-fade-in-up">
      <div className="flex items-center gap-3 px-4 py-3">
        <AlertTriangle className="w-6 h-6 text-yellow-500" />
        <span className="font-medium text-gray-800">{message}</span>
      </div>

      <div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"
        style={{
          width: "100%",
          animation: `shrink ${duration}ms linear forwards`,
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
