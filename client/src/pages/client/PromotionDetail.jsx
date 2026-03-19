import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import promotionAPI from "@/api/promotion.api";
import productAPI from "@/api/product.api";
import MiniProductCard from "./components/MiniProductCard";
import { Ticket, Copy, Check, ChevronLeft, ShoppingBag, Home } from "lucide-react";
import SuccessNotification from "@/components/SuccessNotification";
import Breadcrumb from "@/components/Breadcrumb";

const PromotionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const fetchPromotionData = async () => {
      try {
        setLoading(true);
        const res = await promotionAPI.getById(id);
        if (res.data.status === "success") {
          const promoData = res.data.data;
          setPromotion(promoData);

          if (promoData.products && promoData.products.length > 0) {
            setProducts(promoData.products);
          } else {
            const prodRes = await productAPI.getAll({ promotion_id: id });
            if (prodRes.data?.data?.data) {
              setProducts(prodRes.data.data.data);
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết khuyến mãi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setShowNotif(true);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!promotion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy chương trình khuyến mãi</h2>
        <button 
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onHeightChange={setHeaderHeight} />
      <Navbar onHeightChange={setNavbarHeight} />

      <main className="flex-grow container mx-auto px-4 py-8">
        
              <Breadcrumb
                className="mx-6 my-4"
                items={[
                  { label: "Trang chủ", href: "/", icon: <Home size={14} /> },
                  {
                    label: "Khuyến mãi",
                    icon: <Ticket className="w-4 h-4" />,
                  },
                ]}
              />

        {/* Promotion Banner */}
        <div className="relative w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl mb-12 group">
          <img 
            src={promotion.image || "https://via.placeholder.com/1200x500?text=Promotion"} 
            alt={promotion.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-12">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg leading-tight">
              {promotion.name}
            </h1>
            {promotion.description && (
              <p className="text-gray-200 text-lg md:text-xl max-w-2xl font-medium drop-shadow-md opacity-90">
                {promotion.description}
              </p>
            )}
          </div>
        </div>

        {/* Coupons Section */}
        {promotion.coupons && promotion.coupons.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                <Ticket size={28} />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 uppercase tracking-tight">
                Mã giảm giá độc quyền
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotion.coupons.map((coupon) => (
                <div 
                  key={coupon.id} 
                  className="bg-white border-2 border-dashed border-red-200 rounded-3xl p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all hover:border-red-400 group relative overflow-hidden"
                >
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-full border-r-2 border-dashed border-red-200"></div>
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-full border-l-2 border-dashed border-red-200"></div>
                  
                  <div className="flex-1 mr-4">
                    <p className="text-xs font-bold text-red-500 uppercase mb-1 tracking-widest">Giảm ngay</p>
                    <p className="text-2xl font-black text-gray-800">
                      {coupon.type === "PERCENT" ? `${coupon.value}%` : `${Number(coupon.value).toLocaleString()}₫`}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 font-medium">Đơn tối thiểu: {Number(coupon.min_order_value).toLocaleString()}₫</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-black tracking-widest border border-gray-200">
                      {coupon.code}
                    </span>
                    <button 
                      onClick={() => handleCopyCode(coupon.code)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        copiedCode === coupon.code 
                        ? "bg-green-500 text-white" 
                        : "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200 active:scale-95"
                      }`}
                    >
                      {copiedCode === coupon.code ? <Check size={16} /> : <Copy size={16} />}
                      {copiedCode === coupon.code ? "Đã lưu" : "Sao chép"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Products Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <ShoppingBag size={28} />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 uppercase tracking-tight">
                Sản phẩm ưu đãi
              </h2>
            </div>
            <span className="text-gray-500 font-bold bg-gray-100 px-4 py-1.5 rounded-full text-sm">
              {products.length} sản phẩm
            </span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
              {products.map((product) => (
                <div key={product.id} className="h-full">
                  <MiniProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <ShoppingBag size={48} />
              </div>
              <p className="text-gray-500 text-xl font-medium">Hiện chưa có sản phẩm nào cho chương trình này.</p>
              <p className="text-gray-400 mt-2">Vui lòng quay lại sau nhé!</p>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {showNotif && (
        <SuccessNotification 
          message="Đã sao chép mã giảm giá thành công!" 
          onClose={() => setShowNotif(false)} 
        />
      )}
    </div>
  );
};

export default PromotionDetail;
