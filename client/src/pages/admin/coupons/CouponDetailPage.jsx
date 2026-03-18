import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import couponAPI from "../../../api/coupon.api";
import { Home, Ticket, Percent, DollarSign, Calendar, ArrowLeft, Edit3 } from "lucide-react";
import Breadcrumb from "../../../components/Breadcrumb";
import { Button } from "../../../components/Button";

export default function CouponDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await couponAPI.getById(id);
        setCoupon(res.data);
      } catch (err) {
        console.error("Lỗi load coupon:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Đang tải dữ liệu...
      </div>
    );


  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* HEADER */}
      <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chi Tiết Mã Giảm Giá</h1>
          <p className="text-gray-500">Thông tin chi tiết coupon</p>
        </div>

        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/admin/dashboard", icon: <Home className="w-4 h-4" /> },
            { label: "Coupons", href: "/admin/coupons", icon: <Ticket className="w-4 h-4" /> },
            { label: "Chi tiết coupon", icon: <Ticket className="w-4 h-4" /> },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* LEFT */}
        <div className="p-5 space-y-4 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-purple-700">{coupon.code}</h2>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              coupon.is_active
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {coupon.is_active ? "Đang hoạt động" : "Ngưng hoạt động"}
          </span>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
              {coupon.type === "PERCENT" ? (
                <Percent className="text-blue-500" />
              ) : (
                <DollarSign className="text-green-500" />
              )}
              <div>
                <p className="text-xs text-gray-500">Loại giảm</p>
                <p className="font-semibold">
                  {coupon.type === "PERCENT" ? "Phần trăm" : "Tiền mặt"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
              <Ticket className="text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Giá trị</p>
                <p className="font-semibold">
                  {coupon.type === "PERCENT"
                    ? `${coupon.value}%`
                    : `${coupon.value?.toLocaleString()}đ`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="mb-3 text-lg font-semibold">Điều kiện áp dụng</h3>

            <div className="space-y-2 text-gray-700">
              <p>
                Giá trị đơn tối thiểu:{" "}
                <b>{coupon.min_order_value?.toLocaleString()}đ</b>
              </p>

              <p>
                Giảm tối đa:{" "}
                <b>
                  {coupon.max_discount
                    ? `${coupon.max_discount.toLocaleString()}đ`
                    : "Không giới hạn"}
                </b>
              </p>

              <p>
                Giới hạn sử dụng:{" "}
                <b>{coupon.usage_limit || "Không giới hạn"}</b>
              </p>

              <p>
                Đã dùng: <b>{coupon.used_count}</b>
              </p>
            </div>
          </div>

          {/* DATE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
              <Calendar className="text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Ngày bắt đầu</p>
                <p className="font-semibold">
                  {coupon.start_date
                    ? new Date(coupon.start_date).toLocaleDateString("vi-VN")
                    : "Không có"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
              <Calendar className="text-red-500" />
              <div>
                <p className="text-xs text-gray-500">Ngày kết thúc</p>
                <p className="font-semibold">
                  {coupon.end_date
                    ? new Date(coupon.end_date).toLocaleDateString("vi-VN")
                    : "Không có"}
                </p>
              </div>
            </div>
          </div>

          {/* ACTION */}
          <div className="flex gap-3 mt-4">
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/coupons")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Quay lại
            </Button>

            <Button
              onClick={() => navigate(`/admin/coupons/${coupon.id}/edit`)}
              className="flex items-center gap-2"
            >
              <Edit3 size={16} />
              Chỉnh sửa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}