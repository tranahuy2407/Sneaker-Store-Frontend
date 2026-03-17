import React, { useEffect, useState } from "react";
import couponAPI from "../api/coupon.api";

const CouponComboBox = ({ selectedCoupons, setSelectedCoupons }) => {
  const [coupons, setCoupons] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await couponAPI.getAll({ page: 1, limit: 999 });
      const list = res.data.data || res.data || [];

      const now = new Date();

      const valid = list.filter(
        (c) =>
          new Date(c.end_date) >= now &&
          (c.is_active === true || c.is_active === 1)
      );

      setCoupons(valid);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleCoupon = (coupon) => {
    const exists = selectedCoupons.find((c) => c.id === coupon.id);

    if (exists) {
      setSelectedCoupons(
        selectedCoupons.filter((c) => c.id !== coupon.id)
      );
    } else {
      setSelectedCoupons([...selectedCoupons, coupon]);
    }
  };

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="p-6 space-y-3 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Coupon áp dụng</h2>

      {/* input select */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full p-2 border rounded-lg cursor-pointer"
      >
        {selectedCoupons.length
          ? selectedCoupons.map((c) => c.code).join(", ")
          : "Chọn coupon"}
      </div>

      {/* dropdown */}
      {open && (
        <div className="border rounded-lg shadow max-h-60 overflow-y-auto">
          <input
            className="w-full p-2 border-b"
            placeholder="Tìm coupon..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          {filtered.map((c) => {
            const active = selectedCoupons.find(
              (x) => x.id === c.id
            );

            return (
              <div
                key={c.id}
                onClick={() => toggleCoupon(c)}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  active ? "bg-green-100" : ""
                }`}
              >
                <div className="font-semibold">{c.code}</div>
                <div className="text-xs text-gray-500">
                  Hết hạn:{" "}
                  {new Date(c.end_date).toLocaleDateString()}
                </div>
              </div>
            );
          })}

          {!filtered.length && (
            <div className="p-3 text-sm text-gray-400">
              Không có coupon hợp lệ
            </div>
          )}
        </div>
      )}

      {/* badge */}
      <div className="flex flex-wrap gap-2">
        {selectedCoupons.map((c) => (
          <span
            key={c.id}
            onClick={() => toggleCoupon(c)}
            className="px-3 py-1 text-sm text-white bg-green-500 rounded-full cursor-pointer"
          >
            {c.code} ✕
          </span>
        ))}
      </div>
    </div>
  );
};

export default CouponComboBox;