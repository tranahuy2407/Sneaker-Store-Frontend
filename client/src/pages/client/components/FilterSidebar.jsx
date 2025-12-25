import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown, Check } from "lucide-react";
import { sortOptions, buildProductFilters } from "@/helpers/productFilter";

export default function FilterSidebar({ brands = [], categories = [], onClose }) {
  const [params, setParams] = useSearchParams();

  /* STATES */
  const [price, setPrice] = useState({
    min: Number(params.get("minPrice")) || 0,
    max: Number(params.get("maxPrice")) || 50000000,
  });

  const [brandId, setBrandId] = useState(params.get("brandId") || "");
  const [categoryId, setCategoryId] = useState(params.get("categoryId") || "");
  const [sort, setSort] = useState(params.get("sort") || "");

  /* APPLY */
  const applyFilter = () => {
    const filterParams = buildProductFilters({
      search: params.get("q") || "",
      minPrice: price.min,
      maxPrice: price.max,
      brandId,
      categoryId,
      sort,
      page: 1,
      limit: params.get("limit") || 20,
    });

    if (filterParams.status) delete filterParams.status;

    setParams(filterParams);

  };

  /* RESET */
  const resetFilter = () => {
    setPrice({ min: 0, max: 50000000 });
    setBrandId("");
    setCategoryId("");
    setSort("");

    setParams({
      page: 1,
      limit: 20,
      q: params.get("q") || "",
    });
  };

  return (
    <div className="w-full p-6 space-y-6 bg-white border shadow-xl max-w-none rounded-3xl h-fit animate-slideUp">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <SlidersHorizontal size={22} />
          Bộ lọc sản phẩm
        </h2>

        <button
          onClick={resetFilter}
          className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-red-500 transition rounded-xl bg-red-50 hover:bg-red-100"
        >
          <X size={14} /> Xóa
        </button>
      </div>

      {/* PRICE RANGE */}
      <PriceRange price={price} setPrice={setPrice} />

     <div className="flex w-full gap-6">
      <div className="flex-1">
        <Dropdown
          title="Thương hiệu"
          selected={brandId ? brands.find((b) => b.id == brandId)?.name : "Chọn thương hiệu"}
        >
          {brands.map((b) => (
            <label
              key={b.id}
              onClick={() => setBrandId(b.id)}
              className={`flex items-center justify-between px-4 py-2 rounded-xl cursor-pointer transition 
                ${brandId == b.id ? "bg-blue-50 text-blue-600" : "text-gray-800 hover:bg-gray-100"}`}
            >
              <span>{b.name}</span>
              {brandId == b.id && <Check size={18} className="text-blue-600" />}
            </label>
          ))}
        </Dropdown>
      </div>

      <div className="flex-1">
        <Dropdown
          title="Danh mục"
          selected={categoryId ? categories.find((c) => c.id == categoryId)?.name : "Chọn danh mục"}
        >
          {categories.map((c) => (
            <label
              key={c.id}
              onClick={() => setCategoryId(c.id)}
              className={`flex items-center justify-between px-4 py-2 rounded-xl cursor-pointer transition 
                ${categoryId == c.id ? "bg-blue-50 text-blue-600" : "text-gray-800 hover:bg-gray-100"}`}
            >
              <span>{c.name}</span>
              {categoryId == c.id && <Check size={18} className="text-blue-600" />}
            </label>
          ))}
        </Dropdown>
      </div>
        </div>


      {/* SORT */}
      <div>
        <p className="mb-2 font-semibold text-gray-900">Sắp xếp</p>
        <select
          className="w-full px-4 py-3 text-gray-700 transition border shadow-sm bg-gray-50 rounded-2xl hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {sortOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* APPLY BUTTON */}
      <button
        onClick={applyFilter}
        className="w-full py-3 font-bold text-white transition-all duration-200 bg-blue-600 shadow-lg rounded-2xl hover:bg-blue-700 hover:scale-[1.02]"
      >
        Áp dụng bộ lọc
      </button>
    </div>
  );
}

function Dropdown({ title, selected, children }) {
  return (
    <div>
      <p className="mb-2 font-semibold text-gray-900">{title}</p>

      <details className="overflow-hidden transition border shadow-sm bg-gray-50 rounded-2xl group">
        <summary className="flex items-center justify-between px-4 py-3 text-gray-800 transition cursor-pointer hover:bg-gray-100">
          <span>{selected}</span>
          <ChevronDown size={18} className="transition group-open:rotate-180" />
        </summary>

        <div className="p-2 space-y-1 overflow-y-auto bg-white max-h-56 animate-fadeIn">
          {children}
        </div>
      </details>
    </div>
  );
}

function PriceRange({ price, setPrice }) {
  const format = (v) => v.toLocaleString("vi-VN") + "₫";

  return (
    <div className="p-4 overflow-hidden border shadow-sm bg-gray-50 rounded-2xl">
      <p className="mb-3 text-lg font-semibold text-gray-900">Khoảng giá</p>

      {/* INPUT BOXES */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-600">Từ</label>
          <input
            type="number"
            value={price.min}
            min={0}
            max={50000000}
            onChange={(e) =>
              setPrice((p) => ({
                ...p,
                min: Math.min(Number(e.target.value), p.max - 100000),
              }))
            }
            className="w-full px-3 py-2 mt-1 text-sm bg-white border shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1">
          <label className="text-xs font-medium text-gray-600">Đến</label>
          <input
            type="number"
            value={price.max}
            min={0}
            max={50000000}
            onChange={(e) =>
              setPrice((p) => ({
                ...p,
                max: Math.max(Number(e.target.value), p.min + 100000),
              }))
            }
            className="w-full px-3 py-2 mt-1 text-sm bg-white border shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* RANGE SLIDER */}
      <div className="relative h-16 overflow-hidden">
        {/* Track */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-full top-7"></div>

        {/* Active Range */}
        <div
          className="absolute h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 top-7"
          style={{
            left: `${(price.min / 50000000) * 100}%`,
            right: `${100 - (price.max / 50000000) * 100}%`,
          }}
        ></div>

        {/* MIN */}
        <input
          type="range"
          min={0}
          max={50000000}
          value={price.min}
          step={100000}
          onChange={(e) =>
            setPrice((p) => ({
              ...p,
              min: Math.min(Number(e.target.value), p.max - 100000),
            }))
          }
          className="absolute w-full h-8 bg-transparent pointer-events-auto top-4 range-thumb"
        />

        {/* MAX */}
        <input
          type="range"
          min={0}
          max={50000000}
          value={price.max}
          step={100000}
          onChange={(e) =>
            setPrice((p) => ({
              ...p,
              max: Math.max(Number(e.target.value), p.min + 100000),
            }))
          }
          className="absolute w-full h-8 bg-transparent pointer-events-auto top-4 range-thumb"
        />
      </div>

      {/* DISPLAY RANGE */}
      <div className="flex justify-between mt-3 text-sm font-semibold text-gray-700">
        <span>{format(price.min)}</span>
        <span>{format(price.max)}</span>
      </div>
    </div>
  );
}


