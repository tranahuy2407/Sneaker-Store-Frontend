import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Home,
  Gift,
  Edit3,
  X,
} from "lucide-react";

import Breadcrumb from "../../../components/Breadcrumb";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import SuccessNotification from "../../../components/SuccessNotification";
import promotionAPI from "../../../api/promotion.api";
import couponAPI from "../../../api/coupon.api";
import defaultImage from "@/assets/default.jpg";
import CouponComboBox from "../../../components/CouponComboBox";

export default function UpdatePromotionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    is_active: true,
    image: null,
  });

  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [couponSearch, setCouponSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const [promoRes, couponRes] = await Promise.all([
          promotionAPI.getById(id),
          couponAPI.getAll({ page: 1, limit: 999 }),
        ]);

        const promo = promoRes.data?.data;
        const coupons = couponRes.data?.data || [];

        const validCoupons = coupons.filter(
          (c) => new Date(c.end_date) > new Date()
        );

        setAvailableCoupons(validCoupons);

        if (promo) {
          setForm({
            name: promo.name || "",
            description: promo.description || "",
            start_date: promo.start_date?.slice(0, 10) || "",
            end_date: promo.end_date?.slice(0, 10) || "",
            is_active: promo.is_active ?? true,
            image: null,
          });

            setSelectedCoupons(promo.coupons || []);
        }
      } catch (err) {
        setError("Lỗi tải dữ liệu");
      } finally {
        setLoadingData(false);
      }
    };

    fetch();
  }, [id]);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const data = new FormData();

    data.append("name", form.name);
    data.append("description", form.description);
    data.append("start_date", form.start_date);
    data.append("end_date", form.end_date);
    data.append("is_active", form.is_active ? 1 : 0);

    if (form.image) data.append("image", form.image);

    await promotionAPI.update(id, data);

    await promotionAPI.addCoupons(
      id,
      selectedCoupons.map((c) => c.id)
    );

    setSuccessMessage("Cập nhật thành công");
    setTimeout(() => navigate("/admin/promotions"), 1200);

  } catch (err) {
    console.log(err);
    setError("Lỗi cập nhật");
  } finally {
    setLoading(false);
  }
};

  const filteredCoupons = availableCoupons.filter((c) =>
    c.code.toLowerCase().includes(couponSearch.toLowerCase())
  );

  if (loadingData) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Chỉnh sửa chương trình</h1>
          <p className="text-gray-500">Cập nhật thông tin promotion</p>
        </div>

        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/admin/dashboard", icon: <Home size={16} /> },
            { label: "Khuyến mãi", href: "/admin/promotions", icon: <Gift size={16} /> },
            { label: "Edit", icon: <Edit3 size={16} /> },
          ]}
        />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-6">
        {/* LEFT IMAGE */}
        <div className="w-1/2 bg-white p-4 rounded-lg shadow">
          <img
            src={form.preview || defaultImage}
            className="h-96 w-full object-contain rounded-lg"
            onError={(e) => (e.target.src = defaultImage)}
          />

          <Input
            type="file"
            className="mt-3"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setForm({
                  ...form,
                  image: file,
                  preview: URL.createObjectURL(file),
                });
              }
            }}
          />
        </div>

        {/* RIGHT FORM */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow space-y-4">
          <Input
            placeholder="Tên chương trình"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <textarea
            className="w-full border p-2 rounded-lg"
            placeholder="Mô tả"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              value={form.start_date}
              onChange={(e) =>
                setForm({ ...form, start_date: e.target.value })
              }
            />
            <Input
              type="date"
              value={form.end_date}
              onChange={(e) =>
                setForm({ ...form, end_date: e.target.value })
              }
            />
          </div>

          <CouponComboBox
            selectedCoupons={selectedCoupons}
            setSelectedCoupons={setSelectedCoupons}
          />

          {/* ACTIVE */}
          <div
            onClick={() =>
              setForm({ ...form, is_active: !form.is_active })
            }
            className={`w-12 h-6 rounded-full cursor-pointer flex items-center ${
              form.is_active ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                form.is_active ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Cập nhật"}
          </Button>

          {error && <p className="text-red-500">{error}</p>}
        </div>
      </form>

      {successMessage && (
        <SuccessNotification message={successMessage} duration={1200} />
      )}
    </div>
  );
}