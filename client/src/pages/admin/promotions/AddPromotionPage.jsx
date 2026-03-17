import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Gift, Plus } from "lucide-react";

import Breadcrumb from "../../../components/Breadcrumb";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import SuccessNotification from "../../../components/SuccessNotification";
import CouponComboBox from "../../../components/CouponComboBox";
import promotionAPI from "../../../api/promotion.api";

export default function AddPromotionPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !startDate || !endDate) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      setLoading(true);

      const res = await promotionAPI.create({
        name,
        image,
        description,
        start_date: startDate,
        end_date: endDate,
        is_active: isActive,
      });

      const promotionId = res.data?.data?.id || res.data?.id;

      if (promotionId && selectedCoupons.length) {
        await promotionAPI.addCoupons(
          promotionId,
          selectedCoupons.map((c) => c.id),
        );
      }

      setSuccessMessage("Tạo chương trình khuyến mãi thành công!");
      setTimeout(() => navigate("/admin/promotions"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen p-6 bg-gray-50">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Thêm chương trình khuyến mãi
          </h1>
        </div>

        <Breadcrumb
          items={[
            {
              label: "Trang chủ",
              href: "/admin",
              icon: <Home className="w-4 h-4" />,
            },
            {
              label: "Khuyến mãi",
              href: "/admin/promotions",
              icon: <Gift className="w-4 h-4" />,
            },
            { label: "Thêm mới", icon: <Plus className="w-4 h-4" /> },
          ]}
        />
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="p-6 space-y-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Thông tin chương trình</h2>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Tên chương trình *
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Hình ảnh</label>
            <input
              type="file"
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Mô tả</label>
            <textarea
              className="w-full p-2 border rounded-lg"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Ngày bắt đầu *
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Ngày kết thúc *
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
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

        <CouponComboBox
          selectedCoupons={selectedCoupons}
          setSelectedCoupons={setSelectedCoupons}
        />

        <div className="fixed z-50 bottom-6 right-6">
          <div className="flex items-center gap-3 p-4 bg-white shadow-lg rounded-xl">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/admin/promotions")}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Tạo chương trình"}
            </Button>
          </div>
        </div>
        {successMessage && (
          <SuccessNotification message={successMessage} duration={1200} />
        )}

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
