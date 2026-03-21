import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import orderAPI from "@/api/order.api";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useSelector((s) => s.userAuth);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const state = location.state;
  const orderIdFromUrl = searchParams.get("orderId");

  useEffect(() => {
    const fetchOrderData = async () => {
      if (state && state.email) {
        setOrder({
          email: state.email,
          total_amount: state.total,
          receiver_name: state.name || "Khách hàng",
          order_code: state.orderCode || "N/A",
          address_line: state.address,
          ward: state.ward,
          district: state.district,
          city: state.city,
        });
        setLoading(false);
        return;
      }

      if (orderIdFromUrl) {
        try {
          const res = await orderAPI.getDetail(orderIdFromUrl);
          setOrder(res.data.data);
        } catch (err) {
          console.error("Lỗi lấy thông tin đơn hàng:", err);
        } finally {
          setLoading(false);
        }
        return;
      }
      navigate("/", { replace: true });
    };

    fetchOrderData();
  }, [state, orderIdFromUrl, navigate]);

  const handleTrack = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/track-order", {
        state: { email: order?.email },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onHeightChange={() => {}} />
      
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-green-500 py-12 text-center text-white relative">
            <CheckCircle size={80} className="mx-auto mb-4 animate-bounce" />
            <h1 className="text-4xl font-extrabold mb-2">Đặt hàng thành công!</h1>
            <p className="text-green-100 text-lg">Cảm ơn bạn đã tin tưởng SneakerStore</p>
            
            <div className="absolute -bottom-6 left-0 right-0 overflow-hidden line-height-0">
               <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-[50px] w-full fill-white">
                 <path d="M0.00,49.98 C150.00,150.00 349.20,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"></path>
               </svg>
            </div>
          </div>

          <div className="p-8 md:p-12 pt-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-gray-100 gap-4">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-1">Mã đơn hàng</p>
                <p className="text-2xl font-bold text-gray-800">#{order?.order_code || "N/A"}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-1">Tổng cộng</p>
                <p className="text-3xl font-black text-blue-600">{Number(order?.total_amount || 0).toLocaleString()}đ</p>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-500">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Xác nhận đơn hàng</h3>
                  <p className="text-gray-600">Chúng tôi đã nhận được đơn hàng của bạn và đang tiến hành chuẩn bị đóng gói.</p>
                </div>
              </div>
              
              {order?.receiver_name && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl">
                   <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Người nhận</h4>
                      <p className="font-semibold text-gray-800">{order.receiver_name}</p>
                   </div>
                   {order.address_line && (
                     <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Địa chỉ giao hàng</h4>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {order.address_line}, {order.ward}, {order.district}, {order.city}
                        </p>
                     </div>
                   )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button 
                onClick={handleTrack} 
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all transform hover:-translate-y-1 shadow-lg"
              >
                Tra cứu đơn hàng <ArrowRight size={18} />
              </button>
              <Link 
                to="/" 
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-800 font-bold border-2 border-gray-100 rounded-2xl hover:border-gray-200 transition-all transform hover:-translate-y-1"
              >
                Tiếp tục mua sắm <Home size={18} />
              </Link>
            </div>
            
            <p className="text-center text-gray-400 text-sm mt-8">
              Thông tin chi tiết đã được gửi đến email <b>{order?.email}</b>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
