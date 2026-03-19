import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import favoriteAPI from "../../api/favorite.api";
import { Heart, Home, Search, Info, X, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import { useCart } from "../../context/CartProvider";
import SuccessNotification from "../../components/SuccessNotification";
import WarningNotification from "../../components/WarningNotification";
import QuickViewPopup from "./components/QuickViewPopup";

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [autoRemove, setAutoRemove] = useState(true);
  const [notif, setNotif] = useState({ show: false, type: "", message: "" });
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  const { addToCart } = useCart();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await favoriteAPI.getAll();
      setFavorites(res.data?.data?.data || res.data?.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách yêu thích:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await favoriteAPI.toggle(productId);
      setFavorites(favorites.filter(item => (item.product_id || item.product?.id) !== productId));
    } catch (error) {
      console.error("Lỗi khi xóa yêu thích:", error);
    }
  };

  const handleAddToCart = (product) => {
    setQuickViewProduct(product);
  };

  const handleQuickViewSuccess = (product) => {
    setNotif({ show: true, type: "success", message: `Đã thêm "${product.name}" vào giỏ hàng!` });
    if (autoRemove) {
      handleRemove(product.id);
    }
  };

  const filteredFavorites = favorites.filter(item => 
    item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Header onHeightChange={() => {}} />
      <Navbar onHeightChange={() => {}} />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/", icon: <Home size={14} /> },
            { label: "Yêu thích", icon: <Heart className="w-4 h-4" /> },
          ]}
        />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách yêu thích ({favorites.length})
          </h1>
          
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm trong danh sách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Info/Toggle Bar */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-blue-700 text-sm">
            <Info size={18} className="flex-shrink-0" />
            <p>Tự động xóa sản phẩm khỏi danh sách yêu thích khi thêm vào giỏ hàng</p>
          </div>
          <button 
            onClick={() => setAutoRemove(!autoRemove)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${autoRemove ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoRemove ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        {/* List Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 text-sm font-semibold text-gray-500 bg-gray-50 rounded-t-xl">
          <div className="col-span-6">Sản phẩm</div>
          <div className="col-span-3 text-center">Giá</div>
          <div className="col-span-3 text-center">Thao tác</div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="space-y-4 mt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : filteredFavorites.length > 0 ? (
          <div className="border border-gray-100 rounded-b-xl overflow-hidden divide-y divide-gray-100">
            {filteredFavorites.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-gray-50 transition-colors">
                
                {/* Product Col */}
                <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                  <button 
                    onClick={() => handleRemove(item.product_id || item.product?.id)}
                    className="flex-shrink-0 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                    <img 
                      src={item.product?.images?.[0]?.url || '/placeholder.png'} 
                      alt={item.product?.name}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <Link 
                      to={`/san-pham/${item.product?.slug}`}
                      className="font-bold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 mb-1"
                    >
                      {item.product?.name}
                    </Link>
                    <span className="text-xs text-gray-400">
                      Thương hiệu: <span className="text-gray-600">{item.product?.brand?.name || "N/A"}</span>
                    </span>
                    {item.product?.sizes?.[0] && (
                      <span className="text-xs text-gray-400">
                        Kích thước: <span className="text-gray-600">{item.product.sizes[0].size}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Price Col */}
                <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">
                    {Number(item.product?.discountPrice || item.product?.price).toLocaleString()}₫
                  </span>
                  {item.product?.discountPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {Number(item.product.price).toLocaleString()}₫
                    </span>
                  )}
                </div>

                {/* Action Col */}
                <div className="col-span-1 md:col-span-3 flex justify-center">
                  <button
                    onClick={() => handleAddToCart(item.product)}
                    className="px-6 py-2.5 bg-[#f59e6c] hover:bg-[#e68a55] text-white font-bold rounded-lg transition-colors text-sm shadow-sm flex items-center gap-2"
                  >
                   Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Heart size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium mb-4">
              {searchTerm ? "Không tìm thấy sản phẩm phù hợp" : "Danh sách yêu thích của bạn đang trống"}
            </p>
            <Link to="/" className="text-blue-600 font-bold hover:underline">
              Tiếp tục mua sắm
            </Link>
          </div>
        )}
      </div>

      <Footer />

      {/* Quick View Popup */}
      {quickViewProduct && (
        <QuickViewPopup
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onSuccess={handleQuickViewSuccess}
        />
      )}

      {/* Notifications */}
      {notif.show && notif.type === "success" && (
        <SuccessNotification
          message={notif.message}
          onClose={() => setNotif({ ...notif, show: false })}
        />
      )}
      {notif.show && notif.type === "error" && (
        <WarningNotification
          message={notif.message}
          onClose={() => setNotif({ ...notif, show: false })}
        />
      )}
    </div>
  );
};

export default FavoritePage;
