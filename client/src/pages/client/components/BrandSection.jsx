import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import defaultImage from "../../../assets/default.jpg";
import { useSelector } from "react-redux";
import favoriteAPI from "../../../api/favorite.api";
import { getImageUrl, getSrcSet } from "../../../helpers/imageSrcSet";
import SuccessNotification from "../../../components/SuccessNotification";
import WarningNotification from "../../../components/WarningNotification";
import SkeletonCard, { SkeletonBanner, SkeletonTitle } from "../../../components/SkeletonCard";

const BrandSection = ({ title, banner, products, slug, isLoading = false }) => {
  const [favorites, setFavorites] = useState(new Set());
  const [notif, setNotif] = useState({ show: false, type: '', message: '' });
  const [hoveredImage, setHoveredImage] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.userAuth);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      const res = await favoriteAPI.getAll();
      // Xử lý nhiều cấu trúc response khác nhau
      let favs = res.data?.data;
      if (!Array.isArray(favs)) {
        favs = res.data?.favorites || res.data || [];
      }
      if (Array.isArray(favs)) {
        setFavorites(new Set(favs.map(f => f.product_id || f.productId || f.id || f.product?.id)));
      }
    } catch (err) {
      console.error("Lỗi tải yêu thích:", err);
    }
  };

  const handleFavorite = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setNotif({ show: true, type: 'warning', message: "Vui lòng đăng nhập để thêm vào yêu thích!" });
      return;
    }
    try {
      await favoriteAPI.toggle(productId);
      const isFav = favorites.has(productId);
      setFavorites(prev => {
        const newFavs = new Set(prev);
        if (newFavs.has(productId)) {
          newFavs.delete(productId);
        } else {
          newFavs.add(productId);
        }
        return newFavs;
      });
      setNotif({
        show: true,
        type: 'success',
        message: isFav ? "Đã xóa khỏi danh sách yêu thích!" : "Đã thêm vào danh sách yêu thích!"
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật yêu thích:", error);
      setNotif({ show: true, type: 'error', message: "Có lỗi xảy ra!" });
    }
  };

return ( <div className="w-full px-4 py-10 mx-auto max-w-7xl md:px-6">
  {/* Danh sách sản phẩm */}
  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    {isLoading ? (
      <SkeletonCard count={5} />
    ) : (
      products.map((item, i) => (
        <div key={i} className="text-center group">

          {/* Product card */}
          <div className="relative mb-3 overflow-hidden rounded-md">

            {/* Badge giảm giá - góc trái */}
            {item.discount > 0 ? (
              <span className="absolute z-30 px-2.5 py-1.5 text-xs font-bold text-white bg-red-500 rounded-lg left-2 top-2 shadow-md border border-red-600">
                -{item.discount}%
              </span>
            ) : null}

            {/* Image with zoom effect */}
            <div 
              className="relative aspect-square overflow-hidden rounded-md bg-gray-50 flex items-center justify-center cursor-pointer"
              onMouseEnter={() => setHoveredImage(item.id)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              {(() => {
                const imgSrc = item.images?.length > 0 ? item.images.find(img => img.isDefault)?.url || item.images[0]?.url : defaultImage;
                return (
                  <Link to={`/san-pham/${item.slug}`} onClick={() => recentlyViewedAPI.add(item.id)}>
                    <img
                      src={getImageUrl(imgSrc)}
                      srcSet={getSrcSet(imgSrc)}
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      alt={item.name}
                      className={`object-cover w-full h-full transition-all duration-500 ${
                        hoveredImage === item.id 
                          ? 'scale-150 brightness-100' 
                          : 'scale-100 group-hover:brightness-75'
                      }`}
                    />
                  </Link>
                );
              })()}
            </div>

            {/* Nút yêu thích - góc phải trên */}
            <button
              onClick={(e) => handleFavorite(e, item.id)}
              className={`absolute right-2 top-2 z-20 w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-lg border-2 transition-all hover:scale-110 active:scale-95 ${favorites.has(item.id) ? 'border-red-500 text-red-500' : 'border-gray-400 text-gray-400 hover:border-red-500 hover:text-red-500'}`}
              title="Thêm vào yêu thích"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill={favorites.has(item.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          {/* Product name with link */}
          <Link 
            to={`/san-pham/${item.slug}`}
            onClick={() => recentlyViewedAPI.add(item.id)}
            className="block h-10 mt-2 text-sm font-semibold line-clamp-2 overflow-hidden hover:text-blue-600 transition-colors"
          >
            {item.name}
          </Link>

        {/* Price */}
        <div className="font-bold text-red-600">{item.discountPrice.toLocaleString()}₫</div>

        {item.price && (
          <div className="text-xs text-gray-500 line-through">
            {item.price.toLocaleString()}₫
          </div>
        )}
      </div>
    )))}
  </div>

  {/* Notifications */}
  {notif.show && (
    notif.type === 'success' ? (
      <SuccessNotification
        message={notif.message}
        onClose={() => setNotif({ ...notif, show: false })}
      />
    ) : (
      <WarningNotification
        message={notif.message}
        onClose={() => setNotif({ ...notif, show: false })}
      />
    )
  )}
</div>
);
};

export default BrandSection;
