import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown, Check, Tag, DollarSign, RotateCcw } from "lucide-react";

export default function FilterSidebar({ brands = [], categories = [], onClose }) {
  const [params, setParams] = useSearchParams();

  /* STATES */
  const [price, setPrice] = useState({
    min: Number(params.get("minPrice")) || 0,
    max: Number(params.get("maxPrice")) || 10000000,
  });

  const [brandIds, setBrandIds] = useState(params.get("brandIds") || "");
  const [categoryIds, setCategoryIds] = useState(params.get("categoryIds") || "");
  const [sort, setSort] = useState(params.get("sort") || "");

  /* Toggles multi-select values */
  const toggleId = (current, id) => {
    const list = current ? current.split(",") : [];
    const sId = String(id);
    if (list.includes(sId)) {
      const filtered = list.filter(item => item !== sId);
      return filtered.join(",");
    } else {
      return [...list, sId].join(",");
    }
  };

  /* APPLY */
  const applyFilter = () => {
    const newParams = new URLSearchParams(params);
    if (price.min > 0) newParams.set("minPrice", price.min); else newParams.delete("minPrice");
    if (price.max < 10000000) newParams.set("maxPrice", price.max); else newParams.delete("maxPrice");
    if (brandIds) newParams.set("brandIds", brandIds); else newParams.delete("brandIds");
    if (categoryIds) newParams.set("categoryIds", categoryIds); else newParams.delete("categoryIds");
    if (sort) newParams.set("sort", sort); else newParams.delete("sort");
    newParams.set("page", "1");
    setParams(newParams);
    if (onClose) onClose();
  };

  /* RESET */
  const resetFilter = () => {
    setPrice({ min: 0, max: 10000000 });
    setBrandIds("");
    setCategoryIds("");
    setSort("");
    const newParams = new URLSearchParams(params);
    newParams.delete("minPrice");
    newParams.delete("maxPrice");
    newParams.delete("brandIds");
    newParams.delete("categoryIds");
    newParams.delete("sort");
    newParams.set("page", "1");
    setParams(newParams);
  };

  return (
    <div className="w-full space-y-6 bg-white shrink-0 animate-fadeIn">
      {/* HEADER - Only visible if onClose is provided (likely mobile modal) */}
      {onClose && (
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <SlidersHorizontal size={22} className="text-orange-500" />
            Bộ lọc sản phẩm
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {!onClose && (
        <div className="flex items-center justify-between pb-2">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 uppercase tracking-tight">
             Bộ lọc
          </h2>
          <button
            onClick={resetFilter}
            className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors uppercase"
          >
            <RotateCcw size={12} /> Làm mới
          </button>
        </div>
      )}

      {/* CATEGORIES */}
      <div className="space-y-3">
        <p className="flex items-center gap-2 font-bold text-gray-900 text-sm uppercase">
          <Tag size={16} className="text-orange-500" /> Danh mục
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const isSelected = categoryIds.split(",").includes(String(c.id));
            return (
              <button
                key={c.id}
                onClick={() => setCategoryIds(prev => toggleId(prev, c.id))}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200
                  ${isSelected 
                    ? "bg-orange-500 text-white border-orange-500 shadow-orange-200 shadow-lg" 
                    : "bg-gray-50 text-gray-600 border-gray-100 hover:border-orange-300 hover:text-orange-500"}`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* BRANDS */}
      <div className="space-y-3">
        <p className="flex items-center gap-2 font-bold text-gray-900 text-sm uppercase">
          <SlidersHorizontal size={16} className="text-orange-500" /> Thương hiệu
        </p>
        <div className="max-h-48 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
          {brands.map((b) => {
            const isSelected = brandIds.split(",").includes(String(b.id));
            return (
              <label
                key={b.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 group
                  ${isSelected ? "bg-orange-50" : "hover:bg-gray-50"}`}
                onClick={() => setBrandIds(prev => toggleId(prev, b.id))}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all
                  ${isSelected ? "bg-orange-500 border-orange-500" : "bg-white border-gray-300 group-hover:border-orange-400"}`}>
                  {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
                <span className={`text-sm ${isSelected ? "text-orange-600 font-bold" : "text-gray-700"}`}>
                  {b.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* PRICE RANGE */}
      <div className="space-y-3">
        <p className="flex items-center gap-2 font-bold text-gray-900 text-sm uppercase">
          <DollarSign size={16} className="text-orange-500" /> Khoảng giá
        </p>
        <PriceRange price={price} setPrice={setPrice} />
      </div>

      {/* APPLY BUTTON */}
      <button
        onClick={applyFilter}
        className="w-full py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600 shadow-xl shadow-orange-100 rounded-2xl hover:shadow-orange-200 hover:-translate-y-1 active:scale-95"
      >
        Áp dụng bộ lọc
      </button>
    </div>
  );
}

function PriceRange({ price, setPrice }) {
  const maxLimit = 10000000;
  const format = (v) => v.toLocaleString("vi-VN") + "₫";

  const handleMinChange = (e) => {
    const val = Number(e.target.value);
    setPrice(p => ({ ...p, min: Math.min(val, p.max - 100000) }));
  };

  const handleMaxChange = (e) => {
    const val = Number(e.target.value);
    setPrice(p => ({ ...p, max: Math.max(val, p.min + 100000) }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="relative">
            <input
              type="number"
              value={price.min}
              onChange={handleMinChange}
              className="w-full pl-3 pr-2 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">TỪ</span>
          </div>
        </div>
        <div className="text-gray-300">—</div>
        <div className="flex-1">
          <div className="relative">
            <input
              type="number"
              value={price.max}
              onChange={handleMaxChange}
              className="w-full pl-3 pr-2 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">ĐẾN</span>
          </div>
        </div>
      </div>

      <div className="relative h-6 pt-2">
        <div className="absolute w-full h-1.5 bg-gray-100 rounded-full top-3"></div>
        <div
          className="absolute h-1.5 rounded-full bg-orange-500 top-3"
          style={{
            left: `${(price.min / maxLimit) * 100}%`,
            right: `${100 - (price.max / maxLimit) * 100}%`,
          }}
        ></div>
        <input
          type="range"
          min={0}
          max={maxLimit}
          value={price.min}
          step={100000}
          onChange={handleMinChange}
          className="absolute w-full h-6 bg-transparent pointer-events-auto top-0 accent-orange-600 appearance-none cursor-pointer"
          style={{ zIndex: price.min > maxLimit / 2 ? 5 : 4 }}
        />
        <input
          type="range"
          min={0}
          max={maxLimit}
          value={price.max}
          step={100000}
          onChange={handleMaxChange}
          className="absolute w-full h-6 bg-transparent pointer-events-auto top-0 accent-orange-600 appearance-none cursor-pointer"
        />
      </div>

      <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase">
        <span>{format(price.min)}</span>
        <span>{format(price.max)}</span>
      </div>
    </div>
  );
}



