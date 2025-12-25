import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function WarningModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Xóa",     
  variant = "danger",          
}) {
  if (!open) return null;

  const confirmClass =
    variant === "primary"
      ? "bg-black hover:bg-gray-800"
      : "bg-red-600 hover:bg-red-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] sm:w-[400px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <AlertTriangle className="text-yellow-500" size={20} />
            {title || "Cảnh báo"}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <p className="mb-6 text-gray-600">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Hủy
          </button>

          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-md transition ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
