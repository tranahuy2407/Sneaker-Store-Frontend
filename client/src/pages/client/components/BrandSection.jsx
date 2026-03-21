import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartProvider";
import QuickViewPopup from "./QuickViewPopup";
import defaultImage from "../../../assets/default.jpg";
import { FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import favoriteAPI from "../../../api/favorite.api";
import recentlyViewedAPI from "../../../api/recentlyViewed.api";
import { getImageUrl, getSrcSet } from "../../../helpers/imageSrcSet";

const BrandSection = ({ title, banner, products, slug }) => {
const [quickViewProduct, setQuickViewProduct] = useState(null);
const { isAuthenticated } = useSelector((state) => state.userAuth);

const handleFavorite = async (productId) => {
  if (!isAuthenticated) {
    alert("Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích!");
    return;
  }
  try {
    await favoriteAPI.toggle(productId);
    alert("Đã cập nhật danh sách yêu thích!");
  } catch (error) {
    console.error("Lỗi khi cập nhật yêu thích:", error);
  }
};

return ( <div className="w-full px-4 py-10 mx-auto max-w-7xl md:px-6">
  {/* Tiêu đề */}
  <div className="mb-10 text-center">
    <Link to={slug ? `/thuong-hieu/${slug}` : "#"} className={slug ? "hover:opacity-80 transition-opacity" : "pointer-events-none"}>
      <h2 className="relative inline-block pb-4 text-2xl font-bold md:text-3xl uppercase tracking-wider">
        {title}
        <span className="absolute bottom-0 w-16 h-1 -translate-x-1/2 bg-blue-400 rounded left-1/2"></span>
      </h2>
    </Link>
  </div>

  {/* Banner */}
  <div className="w-full mb-10 overflow-hidden rounded-xl shadow-lg group">
    <Link to={slug ? `/thuong-hieu/${slug}` : "#"}>
      <img
        src={getImageUrl(banner)}
        srcSet={getSrcSet(banner)}
        sizes="(max-width: 1280px) 100vw, 1280px"
        alt={title}
        className="w-full transition-transform duration-700 group-hover:scale-105"
      />
    </Link>
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

          {/* Nút yêu thích */}
          <button
            onClick={() => handleFavorite(item.id)}
            className="absolute left-2 top-2 z-20 p-2 bg-white/80 rounded-full text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
            title="Thêm vào yêu thích"
          >
            <FaHeart size={14} />
          </button>

          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-md bg-gray-50 flex items-center justify-center">
            {(() => {
              const imgSrc = item.images?.length > 0 ? item.images.find(img => img.isDefault)?.url || item.images[0]?.url : defaultImage;
              return (
                <img
                  src={getImageUrl(imgSrc)}
                  srcSet={getSrcSet(imgSrc)}
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  alt={item.name}
                  className="object-cover w-full h-full transition duration-300 group-hover:brightness-75 group-hover:scale-105"
                />
              );
            })()}
          </div>

          {/* Hover buttons */}
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 transition-all duration-300 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0"
          >
            <Link
              to={`/san-pham/${item.slug}`}
              onClick={() => recentlyViewedAPI.add(item.id)}
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
        <p className="h-10 mt-2 text-sm font-semibold line-clamp-2 overflow-hidden">{item.name}</p>

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
