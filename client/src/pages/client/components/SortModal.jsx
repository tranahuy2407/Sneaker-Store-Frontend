import React from "react";
import { X, Check } from "lucide-react";

const SortModal = ({ isOpen, onClose, currentSort, options, onSortChange }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Centered Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm bg-white z-[70] shadow-2xl rounded-3xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-800">Sắp xếp theo</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Options */}
        <div className="p-2">
          {options.map((opt) => {
            const isSelected = currentSort === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onSortChange(opt.value);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${
                  isSelected
                    ? "bg-orange-50 text-orange-600 font-bold"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <span className="text-sm">{opt.label}</span>
                {isSelected && <Check size={18} className="text-orange-500" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </>
  );
};

export default SortModal;
