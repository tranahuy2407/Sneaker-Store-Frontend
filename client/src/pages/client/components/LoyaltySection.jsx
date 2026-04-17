import React, { useState, useEffect } from "react";
import { Gift, Zap, CheckCircle2, Trophy, Loader2, ChevronRight, Copy, X } from "lucide-react";
import { toast } from "react-toastify";
import productAPI from "@/api/product.api";
import userAPI from "@/api/user.api";

const MILESTONES = [
  { threshold: 500000, reward: "Mã giảm giá 5%", type: "coupon", code: "SNEAKER5" },
  { threshold: 1500000, reward: "Mã giảm giá 10%", type: "coupon", code: "SNEAKER10" },
  { threshold: 2000000, reward: "Mã giảm giá 15%", type: "coupon", code: "SNEAKER15" },
  { threshold: 5000000, reward: "Mã giảm giá 20%", type: "coupon", code: "SNEAKER20" },
  { threshold: 10000000, reward: "Tặng 1 đôi giày miễn phí", type: "gift" },
];

export default function LoyaltySection({ orders = [], user }) {
  const [totalSpent, setTotalSpent] = useState(0);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [rewardProducts, setRewardProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    try {
      if (!Array.isArray(orders)) {
          setTotalSpent(0);
          return;
      }
      const spent = orders
        .filter((order) => order && order.status === "Completed")
        .reduce((sum, order) => {
          const amount = parseFloat(order.total_amount || 0);
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
      setTotalSpent(spent);
    } catch (err) {
      console.error("Error calculating total spent:", err);
      setTotalSpent(0);
    }
  }, [orders]);

  const nextMilestone = MILESTONES.find((m) => m.threshold > totalSpent);
  const progress = nextMilestone 
    ? (totalSpent / nextMilestone.threshold) * 100 
    : 100;

  const copyToClipboard = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast.success(`Đã sao chép mã: ${code}`);
  };

  const handleOpenGiftModal = async () => {
    console.log("Opening Gift Modal...");
    setShowGiftModal(true);
    setLoadingProducts(true);
    try {
      // Tăng limit để lấy nhiều sản phẩm hơn và lọc
      const res = await productAPI.getAll({ limit: 100 });
      console.log("Product API Response:", res.data);
      
      // Tìm mảng sản phẩm trong response (đề phòng các cấu trúc lồng nhau khác nhau)
      let allProducts = [];
      if (Array.isArray(res.data?.data)) {
        allProducts = res.data.data;
      } else if (Array.isArray(res.data?.data?.data)) {
        allProducts = res.data.data.data;
      } else if (Array.isArray(res.data?.data?.rows)) {
        allProducts = res.data.data.rows;
      } else if (Array.isArray(res.data)) {
        allProducts = res.data;
      }
      
      // Lọc giày dưới 2 triệu
      const affordableShoes = allProducts.filter(p => {
        if (!p) return false;
        const price = parseFloat(p.price || 0);
        return price > 0 && price <= 2000000;
      });
      
      setRewardProducts(affordableShoes);
    } catch (error) {
      console.error("Error fetching reward products:", error);
      toast.error("Không thể tải danh sách quà tặng");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleClaim = async () => {
    if (!selectedProduct || !selectedSize) {
      toast.warning("Vui lòng chọn sản phẩm và size");
      return;
    }

    setClaiming(true);
    try {
        await userAPI.claimLoyaltyGift({
            productId: selectedProduct.id,
            size: selectedSize
        });
        
        toast.success(`Yêu cầu nhận quà đã được gửi tới Admin! Chúng tôi sẽ liên hệ với bạn sớm nhất.`);
        setShowGiftModal(false);
    } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi khi gửi yêu cầu nhận quà");
    } finally {
        setClaiming(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Chương Trình Khách Hàng Thân Thiết</h3>
              <p className="text-blue-100 text-sm">Mua sắm nhiều hơn, nhận quà lớn hơn</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Tổng chi tiêu</p>
            <p className="text-2xl font-black">{(totalSpent || 0).toLocaleString()}₫</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Tiến trình nhận quà</span>
            <span>{Math.min(progress || 0, 100).toFixed(0)}%</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(progress || 0, 100)}%` }}
            />
          </div>
          {nextMilestone && (
            <p className="text-xs text-blue-100 italic">
              * Bạn cần thêm {(nextMilestone.threshold - totalSpent).toLocaleString()}₫ để nhận <strong>{nextMilestone.reward}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Rewards List */}
      <div className="p-6">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          Mốc phần thưởng của bạn
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MILESTONES.map((m, idx) => {
            const isUnlocked = totalSpent >= m.threshold;
            return (
              <div 
                key={idx}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isUnlocked 
                    ? "border-green-100 bg-green-50/30 shadow-sm" 
                    : "border-gray-50 bg-gray-50/50 grayscale opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isUnlocked ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"}`}>
                    {m.type === "coupon" ? <Gift className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                  </div>
                  {isUnlocked && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                </div>
                
                <p className="text-xs text-gray-500 font-medium">Mốc {(m.threshold || 0).toLocaleString()}₫</p>
                <p className="font-bold text-gray-800 mb-3">{m.reward}</p>
                
                {isUnlocked ? (
                  m.type === "coupon" ? (
                    <button 
                      onClick={() => copyToClipboard(m.code)}
                      className="w-full py-2 bg-white border border-green-200 text-green-600 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-green-600 hover:text-white transition-all"
                    >
                      <Copy size={14} />
                      Mã: {m.code}
                    </button>
                  ) : (
                    <button 
                      onClick={handleOpenGiftModal}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                      CHỌN QUÀ NGAY
                      <ChevronRight size={14} />
                    </button>
                  )
                ) : (
                  <div className="w-full py-2 bg-gray-200 text-gray-400 rounded-lg text-xs font-bold text-center">
                    CHƯA ĐẠT MỐC
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Gift Selection Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Chọn Quà Tặng VIP (Dưới 2Tr)</h3>
                <p className="text-sm text-gray-500">Chúc mừng! Bạn đạt mốc chi tiêu 10.000.000₫</p>
              </div>
              <button 
                onClick={() => setShowGiftModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                disabled={claiming}
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingProducts ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                  <p className="text-gray-500">Đang lọc danh sách giày...</p>
                </div>
              ) : rewardProducts.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                   Không tìm thấy sản phẩm phù hợp dưới 2.000.000₫
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {rewardProducts.map((p) => {
                    const hasStock = Array.isArray(p.sizes) && p.sizes.some(s => s.stock > 0);
                    return (
                      <div 
                        key={p.id}
                        onClick={() => !claiming && hasStock && setSelectedProduct(p)}
                        className={`group relative cursor-pointer rounded-xl border-2 p-2 transition-all hover:shadow-md ${
                          selectedProduct?.id === p.id 
                            ? "border-blue-600 ring-2 ring-blue-100 bg-blue-50/10" 
                            : "border-gray-100"
                        } ${!hasStock ? "opacity-60 grayscale cursor-not-allowed" : ""}`}
                      >
                        <div className="aspect-square rounded-lg bg-gray-50 overflow-hidden mb-2 relative">
                          <img 
                            src={p.thumbnail_url || (p.images && p.images[0]?.image_url)} 
                            alt={p.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {!hasStock && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                                Hết hàng
                              </span>
                            </div>
                          )}
                        </div> 
                        <p className="text-xs font-bold text-gray-800 line-clamp-2 h-8">{p.name}</p>
                        <p className="text-[10px] text-gray-600 mt-1 font-bold">
                          {(p.price || 0).toLocaleString()}₫
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedProduct && (
              <div className="p-6 bg-blue-50 border-t border-blue-100">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-800">Bạn đang chọn:</p>
                    <p className="text-lg font-bold text-gray-900">{selectedProduct.name}</p>
                    
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Chọn Size giày:</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(selectedProduct.sizes) && selectedProduct.sizes.length > 0 ? (
                          selectedProduct.sizes.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => setSelectedSize(s.size)}
                              className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                                selectedSize === s.size
                                  ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                  : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
                              } ${s.stock === 0 ? "opacity-30 cursor-not-allowed bg-gray-100" : ""}`}
                              disabled={s.stock === 0 || claiming}
                            >
                              {s.size} {s.stock === 0 && "(Hết)"}
                            </button>
                          ))
                        ) : (
                          <p className="text-red-500 font-bold text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                            Sản phẩm này hiện đã hết hàng (không còn size)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleClaim}
                    disabled={claiming || !selectedSize}
                    className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                  >
                    {claiming && <Loader2 className="w-5 h-5 animate-spin" />}
                    {claiming ? "ĐANG XỬ LÝ..." : "XÁC NHẬN NHẬN QUÀ"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
