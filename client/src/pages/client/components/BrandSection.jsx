import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartProvider";
import QuickViewPopup from "./QuickViewPopup";
import defaultImage from "../../../assets/default.jpg";

const BrandSection = ({ title, banner, products }) => {
const [quickViewProduct, setQuickViewProduct] = useState(null);

return ( <div className="w-full px-4 py-10 mx-auto max-w-7xl md:px-6">
  {/* Tiêu đề */}
  <div className="mb-10 text-center">
    <h2 className="relative inline-block pb-4 text-2xl font-bold md:text-3xl">
      {title}
      <span className="absolute bottom-0 w-16 h-1 -translate-x-1/2 bg-blue-400 rounded left-1/2"></span>
    </h2>
  </div>

  {/* Banner */}
  <div className="w-full mb-10">
    <img
      src={banner}
      alt={title}
      className="w-full rounded-md shadow-md"
    />
  </div>

  {/* Danh sách sản phẩm */}
  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    {products.map((item, i) => (
      <div key={i} className="text-center group">

        {/* Product card */}
        <div className="relative mb-3 overflow-hidden rounded-md">

          {/* Badge giảm giá */}
          {item.discount > 0 && (
            <span className="absolute z-20 px-2 py-1 text-xs text-white bg-red-600 rounded-full right-2 top-2">
              -{item.discount}% 
            </span>
          )}

          {/* Image */}
          <img
            src={item.images.length > 0 ? item.images.find(img => img.isDefault)?.url || item.images[0].url : defaultImage}
            alt={item.name}
            className="object-cover w-full h-auto transition duration-300 group-hover:brightness-75"
          />

          {/* Hover buttons */}
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 transition-all duration-300 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0"
          >
            <Link
              to={`/san-pham/${item.slug}`}
              className="w-32 py-2 font-semibold text-center text-gray-800 bg-white border rounded-md shadow hover:bg-gray-100"
            >
              Tùy chọn
            </Link>

            <button
              className="w-32 py-2 font-semibold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600"
              onClick={() => setQuickViewProduct(item)}
            >
              Xem nhanh
            </button>
          </div>
        </div>

        {/* Product name */}
        <p className="h-12 text-sm font-semibold">{item.name}</p>

        {/* Price */}
        <div className="font-bold text-red-600">{item.discountPrice.toLocaleString()}₫</div>

        {item.price && (
          <div className="text-xs text-gray-500 line-through">
            {item.price.toLocaleString()}₫
          </div>
        )}
      </div>
    ))}
  </div>

  {/* QuickView Popup */}
  {quickViewProduct && (
    <QuickViewPopup
      product={quickViewProduct}
      onClose={() => setQuickViewProduct(null)}
    />
  )}
</div>
);
};

export default BrandSection;
