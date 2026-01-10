import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Home,
  Package,
  Truck,
  CheckCircle,
  CreditCard,
  MapPin,
} from "lucide-react";

import orderAPI from "@/api/order.api";

import Header from "@/pages/client/components/Header";
import Footer from "@/pages/client/components/Footer";
import Navbar from "./components/Navbar";
import WarningModal from "@/components/WarningModal";
import SuccessNotification from "@/components/SuccessNotification";

const STATUS_FLOW = [
  { key: "Pending", label: "Đang xử lý", icon: Package },
  { key: "Processing", label: "Đang giao", icon: Truck },
  { key: "Completed", label: "Hoàn tất", icon: CheckCircle },
];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const socketRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const CANCEL_REASONS = [
    "Đổi ý, không muốn mua nữa",
    "Đặt nhầm sản phẩm / size",
    "Thời gian giao hàng quá lâu",
    "Tìm được giá tốt hơn",
    "Lý do khác",
  ];

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
    setLoading(true);

    orderAPI
      .getMyOrderDetail(id)
      .then((res) => setOrder(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!order?.id) return;

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });

    socketRef.current.emit("join_order", order.id);

    socketRef.current.on("order_status", ({ orderId, status }) => {
      if (orderId === order.id) {
        setOrder((prev) => ({ ...prev, status }));
      }
    });

    return () => socketRef.current.disconnect();
  }, [order?.id]);
      const handleCancelOrder = async () => {
      try {
        await orderAPI.cancel(order.id, cancelReason);

        setOrder((prev) => ({ ...prev, status: "Cancelled" }));
        setShowCancelWarning(false);
        setShowSuccess(true);
      } catch (error) {
        alert("Huỷ đơn thất bại");
      }
    };

      
  if (loading) {
    return (
      <>
        <Header onHeightChange={setHeaderHeight} />
        <Navbar onHeightChange={setNavbarHeight} />
        <div className="py-20 text-center">Đang tải đơn hàng...</div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header onHeightChange={setHeaderHeight} />
        <Navbar onHeightChange={setNavbarHeight} />
        <div className="py-20 text-center text-red-500">
          Không tìm thấy đơn hàng
        </div>
        <Footer />
      </>
    );
  }

  const formatAddress = () =>
    [order.address_line, order.ward, order.district, order.city]
      .filter(Boolean)
      .join(", ");

  return (
    <>
      <Header onHeightChange={setHeaderHeight} />
      <Navbar onHeightChange={setNavbarHeight} />

      {/* ===== Breadcrumb ===== */}
      <div className="border-b bg-gray-50">
        <div className="container flex items-center gap-2 px-4 py-3 mx-auto text-sm text-gray-600">
          <Home size={16} />
          <Link to="/" className="hover:text-blue-600">
            Trang chủ
          </Link>
          <span>/</span>
          <Link to="/profile" className="hover:text-blue-600">
            Đơn hàng
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-900">#{order.order_code}</span>
        </div>
      </div>

      <div className="container grid max-w-6xl grid-cols-1 gap-6 px-4 py-10 mx-auto lg:grid-cols-3">
        {/* ================= LEFT ================= */}
        <div className="space-y-6 lg:col-span-2">
          {/* ===== STATUS ===== */}
          <div className="p-6 bg-white border rounded-xl">
            <h2 className="mb-6 text-lg font-semibold">Trạng thái đơn hàng</h2>

            <div className="relative flex items-center">
              {/* LINE NỀN */}
              <div className="absolute left-0 right-0 h-0.5 bg-gray-300 top-5" />

              {/* LINE ACTIVE */}
              <div
                className="absolute left-0 h-0.5 bg-blue-600 top-5 transition-all"
                style={{
                  width:
                    STATUS_FLOW.findIndex((x) => x.key === order.status) <= 0
                      ? "0%"
                      : `${
                          (STATUS_FLOW.findIndex(
                            (x) => x.key === order.status
                          ) /
                            (STATUS_FLOW.length - 1)) *
                          100
                        }%`,
                }}
              />

              {STATUS_FLOW.map((s, index) => {
                const currentIndex = STATUS_FLOW.findIndex(
                  (x) => x.key === order.status
                );
                const active = index <= currentIndex;
                const Icon = s.icon;

                return (
                  <div
                    key={s.key}
                    className="relative z-10 flex flex-col items-center flex-1"
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        active
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <p
                      className={`mt-2 text-sm ${
                        active ? "font-semibold text-blue-600" : "text-gray-400"
                      }`}
                    >
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {order.status === "Cancelled" && (
              <p className="mt-4 font-semibold text-red-500">
                Đơn hàng đã bị huỷ
              </p>
            )}
          </div>

          {/* ===== PRODUCTS ===== */}
          <div className="p-6 bg-white border rounded-xl">
            <h2 className="mb-4 text-lg font-semibold">Sản phẩm đã đặt</h2>

            <div className="space-y-4">
              {order.details.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 pb-4 border-b last:border-none"
                >
                  <img
                    src={item.product?.images?.[0]?.url || "/placeholder.png"}
                    alt={item.product?.name}
                    className="object-cover w-20 h-20 border rounded-lg"
                  />

                  <div className="flex-1">
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-sm text-gray-500">
                      Size {item.productSize?.size} × {item.quantity}
                    </p>
                  </div>

                  <div className="font-semibold text-red-600">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </div>
                </div>
              ))}
            </div>

            {/* ===== CANCEL BUTTON ===== */}
            {order.status === "Pending" && (
              <>
                <hr className="my-5" />

                <div className="flex justify-end">
                 <button
                  onClick={() => setShowReasonModal(true)}
                  className="px-6 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Huỷ đơn hàng
                </button>

                </div>
              </>
            )}

            {order.status === "Cancelled" && (
              <p className="mt-4 font-semibold text-red-500">
                Đơn hàng đã bị huỷ
              </p>
            )}
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-6">
          {/* ===== SHIPPING ===== */}
          <div className="p-6 bg-white border rounded-xl">
            <h2 className="flex items-center gap-2 mb-4 font-semibold">
              <MapPin size={18} /> Giao hàng
            </h2>
            <p>
              <b>{order.receiver_name}</b>
            </p>
            <p className="text-sm text-gray-600">{order.receiver_phone}</p>
            <p className="mt-2 text-sm">{formatAddress()}</p>
          </div>

          {/* ===== PAYMENT ===== */}
          <div className="p-6 bg-white border rounded-xl">
            <h2 className="flex items-center gap-2 mb-4 font-semibold">
              <CreditCard size={18} /> Thanh toán
            </h2>
            <p className="text-sm text-gray-600">{order.paymentMethod?.name}</p>
            <p className="mt-4 text-2xl font-bold text-red-600">
              {order.total_amount.toLocaleString()}đ
            </p>
          </div>
        </div>
      </div>

      <Footer />
        {showReasonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md p-6 bg-white rounded-xl">
              <h2 className="mb-4 text-lg font-semibold">Huỷ đơn hàng</h2>

              <p className="mb-3 text-sm text-gray-600">
                Vui lòng chọn lý do huỷ đơn:
              </p>

              <div className="space-y-2">
                {CANCEL_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowReasonModal(false)}
                  className="px-4 py-2 text-gray-700 border rounded-lg"
                >
                  Đóng
                </button>

                <button
                  onClick={() => {
                    if (!cancelReason) {
                      alert("Vui lòng chọn lý do huỷ đơn");
                      return;
                    }
                    setShowReasonModal(false);
                    setShowCancelWarning(true);
                  }}
                  className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg"
                >
                  Huỷ đơn
                </button>
              </div>
            </div>
          </div>
        )}

        <WarningModal
        open={showCancelWarning}
        title="Xác nhận huỷ đơn"
        message="Bạn có chắc chắn muốn huỷ đơn hàng này không?"
        confirmText="Xác nhận huỷ"
        onCancel={() => setShowCancelWarning(false)}
        onConfirm={handleCancelOrder}
      />



      {showSuccess && (
        <SuccessNotification
          message="Huỷ đơn hàng thành công!"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  );
}
