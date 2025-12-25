import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function WarningModalSize({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-in-out bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] sm:w-[380px] transform transition-all duration-300 ease-in-out scale-100">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <AlertTriangle className="text-yellow-500" size={20} />
            Vui lòng chọn size
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-all duration-200 ease-in-out hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message */}
        <p className="mb-6 text-gray-600">
          Bạn cần chọn size trước khi thêm sản phẩm vào giỏ hàng.
        </p>

        {/* Footer Buttons */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Tôi đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
