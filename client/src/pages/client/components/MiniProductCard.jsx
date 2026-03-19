import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import { useSelector } from 'react-redux';
import favoriteAPI from '../../../api/favorite.api';

const MiniProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.userAuth);

  if (!product) return null;

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích!");
      return;
    }
    try {
      await favoriteAPI.toggle(product.id);
      alert("Đã cập nhật danh sách yêu thích!");
    } catch (error) {
      console.error("Lỗi khi cập nhật yêu thích:", error);
    }
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
    <div className="relative flex flex-col h-full transition-all duration-300 bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-orange-400 group shadow-sm">
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
          -{discountPercent}%
        </div>
      )}

      {/* Action Icons */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={handleFavorite}
          className="p-1.5 text-gray-400 bg-white rounded-full shadow-md hover:text-red-500 hover:scale-110 transition-all"
        >
          <Heart size={18} />
        </button>
        <button className="p-1.5 text-gray-400 bg-white rounded-full shadow-md hover:text-blue-500 hover:scale-110 transition-all">
          <Eye size={18} />
        </button>
        <button className="p-1.5 text-gray-400 bg-white rounded-full shadow-md hover:text-orange-500 hover:scale-110 transition-all">
          <ShoppingCart size={18} />
        </button>
      </div>

      <Link 
        to={`/san-pham/${product.slug}`}
        className="flex flex-col flex-1 p-4"
      >
        {/* Product Image */}
        <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-2xl flex items-center justify-center bg-gray-50">
          <img 
            src={product.images?.[0]?.url || '/placeholder.png'} 
            alt={product.name} 
            className="object-contain w-[80%] h-[80%] transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1">
          <h4 className="text-base font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h4>
          
          <div className="mt-auto">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-lg font-extrabold text-red-600">
                {Number(product.discountPrice || product.price).toLocaleString()}₫
              </span>
              {product.discountPrice && (
                <span className="text-sm text-gray-400 line-through font-medium">
                  {Number(product.price).toLocaleString()}₫
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  size={16} 
                  className="fill-yellow-400 text-yellow-400" 
                />
              ))}
              <span className="text-sm text-gray-500 ml-1 font-medium">5</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Buy Now Button */}
      <button 
        onClick={handleBuyNow}
        className="w-full py-4 text-white font-bold text-lg bg-red-600 hover:bg-red-700 transition-colors mt-auto rounded-b-3xl"
      >
        Mua ngay
      </button>
    </div>
  );
};

export default MiniProductCard;
