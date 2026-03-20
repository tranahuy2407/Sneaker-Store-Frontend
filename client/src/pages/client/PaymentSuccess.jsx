import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import orderAPI from "@/api/order.api";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getDetail(orderId);
        setOrder(res.data.data);
      } catch (err) {
        console.error("Lỗi lấy thông tin đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

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
            <h1 className="text-4xl font-extrabold mb-2">Thanh toán thành công!</h1>
            <p className="text-green-100 text-lg">Cảm ơn bạn đã tin tưởng SneakerStore</p>
            
            {/* Decorative waves or accents could go here */}
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
                <p className="text-2xl font-bold text-gray-800">#{order?.order_code || orderId}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-1">Tổng thanh toán</p>
                <p className="text-3xl font-black text-blue-600">{Number(order?.total_amount || 0).toLocaleString()}đ</p>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-500">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Trạng thái đơn hàng</h3>
                  <p className="text-gray-600">Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl">
                 <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Người nhận</h4>
                    <p className="font-semibold text-gray-800">{order?.receiver_name}</p>
                    <p className="text-gray-600 text-sm">{order?.receiver_phone}</p>
                 </div>
                 <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Địa chỉ giao hàng</h4>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {order?.address_line}, {order?.ward}, {order?.district}, {order?.city}
                    </p>
                 </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link 
                to="/profile" 
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all transform hover:-translate-y-1 shadow-lg"
              >
                Quản lý đơn hàng <ArrowRight size={18} />
              </Link>
              <Link 
                to="/" 
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-800 font-bold border-2 border-gray-100 rounded-2xl hover:border-gray-200 transition-all transform hover:-translate-y-1"
              >
                Về trang chủ <Home size={18} />
              </Link>
            </div>
            
            <p className="text-center text-gray-400 text-sm mt-8">
              Đơn hàng xác nhận sẽ được gửi đến email <b>{order?.email}</b>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
