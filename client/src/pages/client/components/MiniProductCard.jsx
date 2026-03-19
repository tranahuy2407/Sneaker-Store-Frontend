import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import { useSelector } from 'react-redux';
import favoriteAPI from '../../../api/favorite.api';
import recentlyViewedAPI from '../../../api/recentlyViewed.api';
import { useState, useEffect } from 'react';
import SuccessNotification from '../../../components/SuccessNotification';
import WarningNotification from '../../../components/WarningNotification';
import QuickViewPopup from './QuickViewPopup';

const MiniProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.userAuth);

  if (!product) return null;

  const [isFav, setIsFav] = useState(product.isFavorite || false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [notif, setNotif] = useState({ show: false, type: '', message: '' });

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setNotif({ show: true, type: 'warning', message: "Vui lòng đăng nhập để thêm vào yêu thích!" });
      return;
    }
    try {
      await favoriteAPI.toggle(product.id);
      const newFavStatus = !isFav;
      setIsFav(newFavStatus);
      setNotif({ 
        show: true, 
        type: 'success', 
        message: newFavStatus ? "Đã thêm vào danh sách yêu thích!" : "Đã xóa khỏi danh sách yêu thích!" 
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật yêu thích:", error);
      setNotif({ show: true, type: 'error', message: "Có lỗi xảy ra khi cập nhật yêu thích." });
    }
  };

  const handleEyeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/san-pham/${product.slug}`);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const checkoutItem = {
      product: {
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        images: product.images,
      },
      quantity: 1,
      size: product.sizes?.[0]?.size || "Free Size", // Lấy tạm size đầu hoặc mặc định
    };

    navigate("/checkout", {
      state: {
        buyNow: true,
        items: [checkoutItem],
      },
    });
  };

  return (
    <div className="relative flex flex-col h-full transition-all duration-300 bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-orange-400 group shadow-sm flex-1">
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full shadow-md">
          -{discountPercent}%
        </div>
      )}

      {/* Action Icons */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-3 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={handleFavorite}
          className={`p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all ${isFav ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
        >
          <Heart size={18} fill={isFav ? "currentColor" : "none"} />
        </button>
        <button 
          onClick={handleEyeClick}
          className="p-2 text-gray-400 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:text-blue-500 hover:scale-110 transition-all"
        >
          <Eye size={18} />
        </button>
        <button 
          onClick={handleCartClick}
          className="p-2 text-gray-400 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:text-orange-500 hover:scale-110 transition-all"
        >
          <ShoppingCart size={18} />
        </button>
      </div>

      <Link 
        to={`/san-pham/${product.slug}`}
        onClick={() => recentlyViewedAPI.add(product.id)}
        className="flex flex-col flex-1 p-4 pb-0"
      >
        {/* Product Image */}
        <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-2xl flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
          <img 
            src={product.images?.[0]?.url || '/placeholder.png'} 
            alt={product.name} 
            className="object-contain w-[85%] h-[85%] transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1">
          <h4 className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors h-[40px]">
            {product.name}
          </h4>
          
          <div className="mt-auto mb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-base font-extrabold text-red-600">
                {Number(product.discountPrice || product.price).toLocaleString()}₫
              </span>
              {product.discountPrice && product.discountPrice < product.price && (
                <span className="text-xs text-gray-400 line-through font-medium">
                  {Number(product.price).toLocaleString()}₫
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  size={14} 
                  className="fill-yellow-400 text-yellow-400" 
                />
              ))}
              <span className="text-xs text-gray-500 ml-1 font-medium">5.0</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Buy Now Button */}
      <div className="p-0 mt-auto">
        <button 
          onClick={handleBuyNow}
          className="w-full py-4 text-white font-bold text-base bg-red-600 hover:bg-red-700 transition-colors rounded-b-3xl shadow-inner active:scale-95 duration-150"
        >
          Mua ngay
        </button>
      </div>

      {/* Popups and Notifications */}
      {showQuickView && (
        <QuickViewPopup
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}

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

export default MiniProductCard;
