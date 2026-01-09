import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Truck,
  User,
  MapPin,
  CreditCard,
  ShoppingCart,
  Package,
} from "lucide-react";
import orderAPI from "../../../api/order.api";
import Breadcrumb from "../../../components/Breadcrumb";
import SuccessNotification from "../../../components/SuccessNotification";
import WarningModal from "../../../components/WarningModal";

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
const [showCancelModal, setShowCancelModal] = useState(false);
const [cancelReason, setCancelReason] = useState("");
const [cancelling, setCancelling] = useState(false);
const CANCEL_REASONS = [
  "Đặt nhầm sản phẩm",
  "Muốn thay đổi sản phẩm",
  "Thời gian giao hàng quá lâu",
  "Tìm được giá tốt hơn",
  "Lý do khác",
];

  useEffect(() => {
    (async () => {
      try {
        const res = await orderAPI.getDetail(id);
        setOrder(res.data?.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

const handleChangeStatus = (status) => {
  if (status === order.status) return;

  setPendingStatus(status);
  setShowWarning(true);
};

const confirmUpdateStatus = async () => {
  try {
    setUpdating(true);

    await orderAPI.updateStatus(order.id, pendingStatus);

    setOrder({ ...order, status: pendingStatus });
    setShowSuccess(true);
  } catch (e) {
    console.error(e);
  } finally {
    setUpdating(false);
    setShowWarning(false);
    setPendingStatus(null);
  }
};


  const formatPrice = (v) =>
    v?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  const formatDateTime = (v) =>
    new Date(v).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  if (loading) return <p className="p-6">Đang tải...</p>;
  if (!order) return <p className="p-6 text-red-500">Không tìm thấy đơn</p>;

  return (
    <div className="relative p-5 space-y-6">
        <WarningModal
            open={showWarning}
            title="Xác nhận thay đổi trạng thái"
            message={`Bạn có chắc muốn chuyển đơn hàng sang trạng thái "${pendingStatus}" không?`}
            confirmText="Xác nhận"
            onConfirm={confirmUpdateStatus}
            onCancel={() => {
                setShowWarning(false);
                setPendingStatus(null);
            }}
            />

      {showSuccess && (
        <SuccessNotification
          message="Cập nhật trạng thái thành công"
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-800 hover:scale-105"
          >
            <ArrowLeft size={16} /> Quay lại
          </button>

          <h1 className="mt-1 text-2xl font-bold">
            Đơn hàng #{order.order_code}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Đặt lúc: <b>{formatDateTime(order.created_at)}</b>
          </p>
        </div>

        <Breadcrumb
          items={[
            {
              label: "Đơn hàng",
              href: "/admin/orders",
              icon: <ShoppingCart size={16} />,
            },
            { label: "Chi tiết", icon: <Package size={16} /> },
          ]}
        />
      </div>

      {/* STATUS */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow transition-transform duration-200 hover:scale-[1.01]">
        <span className="font-medium">Trạng thái:</span>
        <select
        value={order.status}
        disabled={updating}
        onChange={(e) => handleChangeStatus(e.target.value)}
        className="px-4 py-2 text-sm font-medium transition border rounded-md bg-gray-50 hover:scale-105 disabled:opacity-60"
        >
        <option value="Pending">Chờ xử lý</option>
        <option value="Processing">Đang xử lý</option>
        <option value="Completed">Hoàn thành</option>
        <option value="Cancelled">Đã huỷ</option>
        </select>
      </div>
      {["Pending", "Processing"].includes(order.status) && (
        <button
          onClick={() => setShowCancelModal(true)}
          className="px-4 py-2 text-sm font-medium text-red-600 border border-red-500 rounded-md hover:bg-red-50"
        >
          Huỷ đơn hàng
        </button>
      )}
{showCancelModal && (
  <WarningModal
    open={showCancelModal}
    title="Huỷ đơn hàng"
    message={
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Vui lòng chọn lý do huỷ đơn:
        </p>

        {CANCEL_REASONS.map((r) => (
          <label
            key={r}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="radio"
              name="cancelReason"
              value={r}
              checked={cancelReason === r}
              onChange={() => setCancelReason(r)}
            />
            {r}
          </label>
        ))}
      </div>
    }
    confirmText="Xác nhận huỷ"
    onConfirm={async () => {
      if (!cancelReason) return;

      try {
        setCancelling(true);
        await orderAPI.cancel(order.id, cancelReason);
        setOrder({ ...order, status: "Cancelled" });
        setShowSuccess(true);
      } catch (e) {
        console.error(e);
      } finally {
        setCancelling(false);
        setShowCancelModal(false);
        setCancelReason("");
      }
    }}
    onCancel={() => {
      setShowCancelModal(false);
      setCancelReason("");
    }}
  />
)}

      {/* INFO */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 space-y-2 bg-white rounded-lg shadow transition-transform duration-300 hover:scale-[1.02]">
          <h3 className="flex items-center gap-2 font-semibold">
            <User size={16} /> Khách hàng
          </h3>
          <p><b>Tên:</b> {order.receiver_name}</p>
          <p><b>SĐT:</b> {order.receiver_phone}</p>
          <p><b>Email:</b> {order.email}</p>
        </div>

        <div className="p-4 space-y-2 bg-white rounded-lg shadow transition-transform duration-300 hover:scale-[1.02]">
          <h3 className="flex items-center gap-2 font-semibold">
            <MapPin size={16} /> Địa chỉ giao hàng
          </h3>
          <p>{order.address_line}</p>
          <p className="text-sm text-gray-600">
            {order.ward}, {order.district}, {order.city}
          </p>
        </div>
      </div>

      {/* PAYMENT */}
      <div className="p-5 bg-white rounded-lg shadow transition-transform duration-300 hover:scale-[1.02]">
        <h3 className="flex items-center gap-2 mb-3 font-semibold">
          <CreditCard size={16} /> Thanh toán
        </h3>

        <div className="flex items-center gap-4">
          {order.paymentMethod?.logo && (
            <img
              src={order.paymentMethod.logo}
              alt={order.paymentMethod.name}
              className="object-contain w-12 h-12 transition-transform duration-300 hover:scale-110"
            />
          )}
          <div>
            <p className="font-medium">{order.paymentMethod?.name}</p>
            <p className="text-sm text-gray-500">
              {order.paymentMethod?.description}
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-4 mt-4 border-t">
          <span className="text-lg font-semibold">Tổng thanh toán</span>
          <span className="text-2xl font-bold text-red-600 transition hover:scale-110">
            {formatPrice(order.total_amount)}
          </span>
        </div>
      </div>

      {/* ITEMS */}
      <div className="p-5 bg-white rounded-lg shadow transition-transform duration-300 hover:scale-[1.01]">
        <h3 className="flex items-center gap-2 mb-4 font-semibold">
          <Truck size={16} /> Sản phẩm
        </h3>

        <div className="space-y-4">
          {order.details.map((d) => {
            const img = d.product?.images?.[0]?.url;
            return (
              <div
                key={d.id}
                className="flex items-center gap-4 pb-4 border-b last:border-0 transition hover:scale-[1.01]"
              >
                <div className="w-20 h-20 overflow-hidden border rounded-lg">
                  <img
                    src={img}
                    alt={d.product?.name}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-medium">{d.product?.name}</p>
                  <p className="text-sm text-gray-500">
                    Size: {d.productSize?.size}
                  </p>
                  <p className="text-sm text-gray-500">
                    Số lượng: {d.quantity}
                  </p>
                </div>

                <div className="font-semibold text-right text-red-600 transition hover:scale-110">
                  {formatPrice(d.price * d.quantity)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
