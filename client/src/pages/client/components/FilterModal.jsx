import React from "react";
import { FaFilter, FaTimes, FaCheck } from "react-icons/fa";
import { X } from "lucide-react";

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

  const pricePresets = [
    { label: "Dưới 1 triệu", min: "", max: "1000000" },
    { label: "1 - 2 triệu", min: "1000000", max: "2000000" },
    { label: "2 - 5 triệu", min: "2000000", max: "5000000" },
    { label: "Trên 5 triệu", min: "5000000", max: "" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-80 max-w-[88vw] bg-white z-50 shadow-2xl animate-slide-left flex flex-col">
        
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <FaFilter size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Bộ lọc</h3>
              <p className="text-xs text-orange-100">
                {activeFiltersCount > 0
                  ? `${activeFiltersCount} bộ lọc đang áp dụng`
                  : "Chọn bộ lọc phù hợp"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Categories */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-5 bg-orange-500 rounded-full" />
                Danh mục
              </h4>
              {selectedCategories.length > 0 && (
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                  {selectedCategories.length} đã chọn
                </span>
              )}
            </div>
            <div className="space-y-1">
              {categories.map((cat) => {
                const isSelected = selectedCategories.map(String).includes(String(cat.id));
                return (
                  <label
                    key={cat.id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-orange-50 border border-orange-200"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        isSelected
                          ? "bg-orange-500 border-orange-500"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && <FaCheck className="text-white text-[10px]" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onCategoryChange(cat.id)}
                      className="hidden"
                    />
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? "text-orange-700" : "text-gray-700"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Brands */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-5 bg-purple-500 rounded-full" />
                Thương hiệu
              </h4>
              {selectedBrands.length > 0 && (
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                  {selectedBrands.length} đã chọn
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => {
                const isSelected = selectedBrands.map(String).includes(String(brand.id));
                return (
                  <button
                    key={brand.id}
                    onClick={() => onBrandChange(brand.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                      isSelected
                        ? "bg-purple-500 text-white border-purple-500"
                        : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-500"
                    }`}
                  >
                    {brand.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="p-5">
            <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
              <span className="w-1 h-5 bg-green-500 rounded-full" />
              Khoảng giá
            </h4>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {pricePresets.map((preset) => {
                const isActive =
                  priceRange.min === preset.min && priceRange.max === preset.max;
                return (
                  <button
                    key={preset.label}
                    onClick={() => {
                      onPriceChange("min", preset.min);
                      onPriceChange("max", preset.max);
                    }}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                      isActive
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:bg-green-50"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₫</span>
                <input
                  type="number"
                  placeholder="Từ"
                  value={priceRange.min}
                  onChange={(e) => onPriceChange("min", e.target.value)}
                  className="w-full pl-8 pr-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
                />
              </div>
              <span className="text-gray-400">–</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₫</span>
                <input
                  type="number"
                  placeholder="Đến"
                  value={priceRange.max}
                  onChange={(e) => onPriceChange("max", e.target.value)}
                  className="w-full pl-8 pr-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50">
          {/* Active filter tags preview */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedCategories.map((catId) => {
                const cat = categories.find((c) => String(c.id) === String(catId));
                return cat ? (
                  <span
                    key={catId}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium"
                  >
                    {cat.name}
                    <button onClick={() => onCategoryChange(catId)}>
                      <X size={10} />
                    </button>
                  </span>
                ) : null;
              })}
              {selectedBrands.map((brandId) => {
                const brand = brands.find((b) => String(b.id) === String(brandId));
                return brand ? (
                  <span
                    key={brandId}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium"
                  >
                    {brand.name}
                    <button onClick={() => onBrandChange(brandId)}>
                      <X size={10} />
                    </button>
                  </span>
                ) : null;
              })}
              {(priceRange.min !== "" || priceRange.max !== "") && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                  {priceRange.min ? `${Number(priceRange.min).toLocaleString()}₫` : "0₫"} – {priceRange.max ? `${Number(priceRange.max).toLocaleString()}₫` : "∞"}
                  <button onClick={() => { onPriceChange("min", ""); onPriceChange("max", ""); }}>
                    <X size={10} />
                  </button>
                </span>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClearFilters}
              className="flex-1 py-3 border-2 border-gray-300 rounded-xl text-gray-600 font-semibold hover:bg-white hover:border-gray-400 transition-all text-sm"
            >
              Xóa tất cả
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 text-white font-semibold rounded-xl transition-all shadow-lg text-sm active:scale-95"
              style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
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
