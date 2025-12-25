import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 mt-6 sm:flex-row">
      <p className="text-sm text-gray-600">
        Trang <span className="font-semibold text-gray-800">{currentPage}</span> /{" "}
        <span className="font-semibold text-gray-800">{totalPages}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md transition-all duration-300 ease-in-out ${
            currentPage === 1
              ? "cursor-not-allowed text-gray-400 border-gray-200 bg-gray-100"
              : "hover:bg-gray-100 border-gray-300 text-gray-700"
          }`}
        >
          <ChevronLeft size={16} />
          Trước
        </button>

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md transition-all duration-300 ease-in-out ${
            currentPage === totalPages
              ? "cursor-not-allowed text-gray-400 border-gray-200 bg-gray-100"
              : "hover:bg-gray-100 border-gray-300 text-gray-700"
          }`}
        >
          Sau
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
