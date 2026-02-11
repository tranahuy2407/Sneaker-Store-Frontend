import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, TicketPercent, Plus } from "lucide-react";

import Breadcrumb from "../../../components/Breadcrumb";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import SuccessNotification from "../../../components/SuccessNotification";
import couponAPI from "../../../api/coupon.api";

export default function AddPromotionPage() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [type, setType] = useState("PERCENT");
  const [value, setValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code || !value || !startDate || !endDate) {
      setErrors({ form: "Vui lòng nhập đầy đủ thông tin bắt buộc!" });
      return;
    }

    try {
      setLoading(true);
        await couponAPI.create({
        code,
        type,
        value: Number(value),
        min_order_value: Number(minOrderValue) || 0,
        max_discount: type === "PERCENT" ? Number(maxDiscount) || 0 : null,
        usage_limit: Number(usageLimit) || 0,
        start_date: startDate,
        end_date: endDate,
        is_active: isActive,
        });
      setSuccessMessage("Tạo mã giảm giá thành công!");
      setTimeout(() => navigate("/admin/coupons"), 1200);
    } catch (err) {
      setErrors({
        form: err.response?.data?.message || "Có lỗi xảy ra khi tạo coupon!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Thêm mã giảm giá</h1>
          <p className="text-gray-500">Tạo coupon cho chương trình khuyến mãi</p>
        </div>
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/admin", icon: <Home className="w-4 h-4" /> },
            { label: "Coupon", href: "/admin/coupons", icon: <TicketPercent className="w-4 h-4" /> },
            { label: "Thêm mới", icon: <Plus className="w-4 h-4" /> },
          ]}
        />
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="p-6 space-y-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Thông tin coupon</h2>

          {/* Code */}
          <div>
            <label className="block mb-1 text-sm font-medium">Mã coupon *</label>
            <Input
              placeholder="VD: SALE50"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block mb-1 text-sm font-medium">Loại giảm giá</label>
            <select
            className="w-full p-2 border rounded-lg"
            value={type}
            onChange={(e) => setType(e.target.value)}
            >
            <option value="PERCENT">Giảm theo %</option>
            <option value="FIXED">Giảm số tiền</option>
            </select>

          </div>

          {/* Value */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Giá trị giảm {type === "percent" ? "(%)" : "(VND)"} *
            </label>
            <Input
              type="number"
              placeholder="Nhập giá trị giảm"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          {/* Min Order */}
          <div>
            <label className="block mb-1 text-sm font-medium">Giá trị đơn tối thiểu</label>
            <Input
              type="number"
              placeholder="0"
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(e.target.value)}
            />
          </div>

        {type === "PERCENT" && (
        <div>
            <label className="block mb-1 text-sm font-medium">Giảm tối đa</label>
            <Input
            type="number"
            placeholder="Giới hạn số tiền giảm"
            value={maxDiscount}
            onChange={(e) => setMaxDiscount(e.target.value)}
            />
        </div>
        )}

          {/* Usage limit */}
          <div>
            <label className="block mb-1 text-sm font-medium">Số lượt sử dụng</label>
            <Input
              type="number"
              placeholder="Không giới hạn nếu để 0"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
            />
          </div>

          {/* Date range */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium">Ngày bắt đầu *</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Ngày kết thúc *</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* Status toggle */}
          <div className="flex items-center gap-3 mt-2">
            <div
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition ${
                isActive ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </div>
            <span>{isActive ? "Đang hoạt động" : "Đã tắt"}</span>
          </div>
        </div>

        {/* Floating buttons */}
        <div className="fixed z-50 bottom-6 right-6">
          <div className="flex items-center gap-3 p-4 bg-white shadow-lg rounded-xl">
            <Button type="button" variant="secondary" onClick={() => navigate("/admin/coupons")}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Tạo coupon"}
            </Button>
          </div>
        </div>

        {successMessage && (
          <SuccessNotification
            message={successMessage}
            duration={1200}
            onClose={() => setSuccessMessage("")}
          />
        )}
        {errors.form && <p className="mt-3 text-red-500">{errors.form}</p>}
      </form>
    </div>
  );
}
