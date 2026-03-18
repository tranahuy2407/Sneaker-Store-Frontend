import React, { useEffect, useState } from "react";
import { X, Ticket, Percent, DollarSign } from "lucide-react";
import couponAPI from "@/api/coupon.api";

const CouponModal = ({ open, onClose, onApply, orderTotal, productIds, selectedCode }) => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) fetchCoupons();
  }, [open]);

  const fetchCoupons = async () => {
    try {
      const res = await couponAPI.getAll();
      setCoupons(res.data.data || []);
    } catch (e) {
      console.log(e);
    }
  };
  const handleApplyCode = async () => {
    if (!code) return alert("Nhập mã");

    setLoading(true);
    try {
      const res = await couponAPI.apply(code, orderTotal, productIds);

      onApply(res.data);
      onClose();
    } catch (e) {
      alert(e?.response?.data?.message || "Mã không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCoupon = async (c) => {
    setLoading(true);
    try {
      const res = await couponAPI.apply(c.code, orderTotal, productIds);

      onApply(res.data);
      onClose();
    } catch (e) {
      alert(e?.response?.data?.message || "Không đủ điều kiện");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Chọn mã giảm giá</h3>
          <X className="cursor-pointer hover:text-red-500" onClick={onClose} />
        </div>

        {/* INPUT */}
        <div className="flex gap-2 mb-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Nhập mã giảm giá"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            disabled={loading}
            onClick={handleApplyCode}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Đang áp dụng..." : "Áp dụng"}
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-3 overflow-y-auto max-h-80">
          {coupons.map((c) => {
            const isValid = orderTotal >= (c.min_order_value || 0);

            const isSelected = selectedCode === c.code;

            return (
              <div
                key={c.id}
                className={`p-3 border-2 rounded cursor-pointer transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : isValid
                    ? "border-gray-200 hover:border-blue-400"
                    : "border-gray-200 opacity-50"
                }`}
                onClick={() => isValid && handleSelectCoupon(c)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket className={isSelected ? "text-blue-600" : "text-purple-500"} />
                    <span className={`font-bold ${isSelected ? "text-blue-700" : ""}`}>{c.code}</span>
                    {isSelected && (
                      <span className="px-2 py-0.5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                        Đang dùng
                      </span>
                    )}
                  </div>

                  {c.type === "PERCENT" ? (
                    <Percent className={isSelected ? "text-blue-500" : "text-yellow-500"} />
                  ) : (
                    <DollarSign className={isSelected ? "text-blue-500" : "text-green-500"} />
                  )}
                </div>

                <p className="mt-1 text-sm text-gray-600">
                  Giảm {c.type === "PERCENT" ? `${c.value}%` : `${c.value}đ`}
                  {c.max_discount &&
                    ` (tối đa ${c.max_discount.toLocaleString()}đ)`}
                </p>

                <p className="text-xs text-gray-400">
                  Đơn tối thiểu: {c.min_order_value?.toLocaleString()}đ
                </p>

                {!isValid && (
                  <p className="text-xs text-red-500">Bạn chưa đủ điều kiện</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
