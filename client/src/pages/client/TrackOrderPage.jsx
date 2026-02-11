import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import orderAPI from "@/api/order.api";
import { toast } from "react-toastify";

export default function TrackOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [orderCode, setOrderCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.orderCode) {
      setOrderCode(location.state.orderCode);
    }
  }, []);

  const handleSubmit = async () => {
    if (!orderCode || !email) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      const res = await orderAPI.trackGuestOrder({
        order_code: orderCode,
        email
      });

      navigate(`/orders/${res.data.id}/tracking`, {
        state: { guestVerified: true }
      });
    } catch (err) {
      toast.error("Không tìm thấy đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="mb-6 text-xl font-semibold">
        Tra cứu đơn hàng
      </h1>

      <input
        placeholder="Mã đơn hàng"
        value={orderCode}
        onChange={(e) => setOrderCode(e.target.value)}
        className="w-full p-3 mb-3 border rounded"
      />

      <input
        placeholder="Email đặt hàng"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 mb-4 border rounded"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 text-white bg-blue-600 rounded"
      >
        {loading ? "Đang tra cứu..." : "Tra cứu"}
      </button>
    </div>
  );
}
