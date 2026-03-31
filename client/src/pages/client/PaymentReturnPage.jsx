import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import orderAPI from "@/api/order.api";
import { useCart } from "@/context/CartProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function PaymentReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("checking");
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const orderIdParam = searchParams.get("orderId");
      const apptransid = searchParams.get("apptransid");
      const statusCode = searchParams.get("status"); // Mã trạng thái từ ZaloPay
      
      if (!orderIdParam && !apptransid) {
        setStatus("failed");
        setMessage("Không tìm thấy thông tin đơn hàng");
        return;
      }

      try {
        // 1. Proactively query status from server to sync DB even on failure/cancel
        if (apptransid) {
          try {
            await orderAPI.queryZaloPayStatus(apptransid);
          } catch (e) {
            console.error("Query status error:", e);
          }
        }

        // 2. Extract order ID
        const finalOrderId = orderIdParam || (apptransid?.includes("_") ? apptransid.split("_").pop() : null);
        
        if (!finalOrderId) {
            setStatus("failed");
            setMessage("Không thể xác định mã đơn hàng");
            return;
        }

        // 3. Fetch current order state
        const res = await orderAPI.getMyOrderDetail(finalOrderId);
        const orderData = res.data.data;
        setOrder(orderData);

        // 4. Update UI based on status code and final order status
        if (statusCode === "1" || orderData.payment_status === "Paid") {
          setStatus("success");
          setMessage("Thanh toán thành công!");
          clearCart();
        } else if (statusCode === "-49" || orderData.status === "Cancelled") {
          setStatus("cancelled");
          setMessage("Giao dịch đã bị huỷ. Bạn có thể đặt hàng lại bất cứ lúc nào.");
        } else {
          // Failure or Pending
          setStatus("failed");
          setMessage("Giao dịch chưa hoàn thiện. Vui lòng kiểm tra lại phương thức thanh toán.");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setStatus("failed");
        setMessage("Không thể kiểm tra trạng thái thanh toán");
      }
    };

    checkPaymentStatus();
  }, [searchParams, clearCart]);

  const handleRetryPayment = () => {
    if (order?.id) {
      navigate(`/checkout?retry=${order.id}`);
    } else {
      navigate("/cart");
    }
  };

  const handleViewOrder = () => {
    if (order?.id) {
      navigate(`/orders/${order.id}/tracking`);
    } else {
      navigate("/profile");
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const renderContent = () => {
    switch (status) {
      case "checking":
        return (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            <p className="text-lg text-gray-600">Đang kiểm tra trạng thái thanh toán...</p>
          </div>
        );

      case "success":
        return (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
            <h2 className="text-2xl font-bold text-green-600">{message}</h2>
            <p className="text-gray-600">Cảm ơn bạn đã mua hàng!</p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleViewOrder}
                className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Xem đơn hàng
              </button>
              <button
                onClick={handleGoHome}
                className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        );

      case "cancelled":
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <XCircle className="w-16 h-16 text-red-600" />
            <h2 className="text-2xl font-bold text-red-600">{message}</h2>
            <p className="text-gray-600">Đơn hàng của bạn đã được ghi nhận nhưng hiện đã bị hủy do thanh toán không thành công.</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full">
              <button
                onClick={handleRetryPayment}
                className="flex-1 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thanh toán lại
              </button>
              <button
                onClick={handleViewOrder}
                className="flex-1 px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Chi tiết đơn hàng
              </button>
            </div>
            <button
                onClick={handleGoHome}
                className="mt-4 text-sm text-gray-500 hover:text-blue-600 underline"
              >
                Quay về trang chủ
              </button>
          </div>
        );

      case "failed":
        return (
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="w-16 h-16 text-orange-600" />
            <h2 className="text-2xl font-bold text-orange-600">Thanh toán không thành công</h2>
            <p className="text-gray-600">{message}</p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleRetryPayment}
                className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Thử thanh toán lại
              </button>
              <button
                onClick={handleViewOrder}
                className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Xem đơn hàng
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-20">
        <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg">
          {renderContent()}
        </div>
      </div>
      <Footer />
    </>
  );
}
