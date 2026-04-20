import React from "react";
import { FaFilter, FaTimes, FaCheck } from "react-icons/fa";

const FilterModal = ({
  isOpen,
  onClose,
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  priceRange,
  activeFiltersCount,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onClearFilters,
}) => {
  if (!isOpen) return null;

  const priceRanges = [
    { label: "Dưới 1tr", min: "", max: "1000000" },
    { label: "1tr - 2tr", min: "1000000", max: "2000000" },
    { label: "2tr - 5tr", min: "2000000", max: "5000000" },
    { label: "Trên 5tr", min: "5000000", max: "" },
  ];

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content - Wider */}
      <div className="fixed left-0 top-0 h-full w-96 max-w-[90vw] bg-white z-50 shadow-2xl overflow-hidden animate-slide-left flex flex-col">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <FaFilter size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xl">Bộ lọc</h3>
              <p className="text-sm text-blue-100">
                {activeFiltersCount > 0
                  ? `${activeFiltersCount} bộ lọc đã chọn`
                  : "Chọn bộ lọc phù hợp"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all"
          >
            <FaTimes size={22} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Categories Filter */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                Danh mục sản phẩm
              </h4>
              {selectedCategories.length > 0 && (
                <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                  {selectedCategories.length} đã chọn
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className={`
                    flex items-center gap-4 cursor-pointer p-3.5 rounded-xl transition-all duration-200 group
                    ${
                      selectedCategories.includes(cat.id)
                        ? "bg-blue-50 border-2 border-blue-300 shadow-sm"
                        : "hover:bg-gray-50 border-2 border-transparent"
                    }
                  `}
                >
                  <div
                    className={`
                      w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                      ${
                        selectedCategories.includes(cat.id)
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300 group-hover:border-blue-300"
                      }
                    `}
                  >
                    {selectedCategories.includes(cat.id) && (
                      <FaCheck className="text-white text-sm" />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => onCategoryChange(cat.id)}
                    className="hidden"
                  />
                  <span
                    className={`text-base font-medium transition-colors ${
                      selectedCategories.includes(cat.id)
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands Filter - Tag Style */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                Thương hiệu
              </h4>
              {selectedBrands.length > 0 && (
                <span className="text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
                  {selectedBrands.length} đã chọn
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => onBrandChange(brand.id)}
                  className={`
                    px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200
                    ${
                      selectedBrands.includes(brand.id)
                        ? "bg-purple-500 text-white shadow-lg shadow-purple-200 scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105"
                    }
                  `}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="font-bold text-gray-800 flex items-center gap-2 text-lg mb-4">
              <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
              Khoảng giá
            </h4>

            {/* Quick price buttons */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    onPriceChange("min", range.min);
                    onPriceChange("max", range.max);
                  }}
                  className={`
                    px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border-2
                    ${
                      priceRange.min === range.min && priceRange.max === range.max
                        ? "bg-green-500 text-white border-green-500 shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50"
                    }
                  `}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Custom price inputs */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  ₫
                </span>
                <input
                  type="number"
                  placeholder="Giá từ"
                  value={priceRange.min}
                  onChange={(e) => onPriceChange("min", e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                />
              </div>
              <span className="text-gray-400 font-bold">-</span>
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  ₫
                </span>
                <input
                  type="number"
                  placeholder="Giá đến"
                  value={priceRange.max}
                  onChange={(e) => onPriceChange("max", e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="border-t bg-gray-50 p-5 space-y-4">
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((catId) => {
                const cat = categories.find((c) => c.id === catId);
                return cat ? (
                  <span
                    key={catId}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    {cat.name}
                    <button
                      onClick={() => onCategoryChange(catId)}
                      className="hover:text-blue-900 p-0.5"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                ) : null;
              })}
              {selectedBrands.map((brandId) => {
                const brand = brands.find((b) => b.id === brandId);
                return brand ? (
                  <span
                    key={brandId}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
                  >
                    {brand.name}
                    <button
                      onClick={() => onBrandChange(brandId)}
                      className="hover:text-purple-900 p-0.5"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                ) : null;
              })}
              {(priceRange.min || priceRange.max) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                  {priceRange.min && priceRange.max
                    ? `${parseInt(priceRange.min).toLocaleString()}₫ - ${parseInt(priceRange.max).toLocaleString()}₫`
                    : priceRange.min
                    ? `Từ ${parseInt(priceRange.min).toLocaleString()}₫`
                    : `Đến ${parseInt(priceRange.max).toLocaleString()}₫`}
                </span>
              )}
            </div>
          )}
          <div className="flex gap-4">
            <button
              onClick={onClearFilters}
              className="flex-1 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-white hover:border-gray-400 transition-all active:scale-95"
            >
              Xóa tất cả
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterModal;
