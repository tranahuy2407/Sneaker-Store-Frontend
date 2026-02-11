"use client";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import promotionAPI from "../../../api/promotion.api";
import { Home, Gift, Edit3, ArrowLeft, Calendar, Tag, Ticket } from "lucide-react";
import Breadcrumb from "../../../components/Breadcrumb";
import { Button } from "../../../components/Button";
import defaultImage from "@/assets/default.jpg";

export default function PromotionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const res = await promotionAPI.getById(id);
        setPromotion(res.data.data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết khuyến mãi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Đang tải dữ liệu...
      </div>
    );

  if (!promotion)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Chương trình không tồn tại.
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chi Tiết Chương Trình Giảm Giá</h1>
          <p className="text-gray-500">Thông tin chi tiết chương trình khuyến mãi</p>
        </div>

        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/admin/dashboard", icon: <Home className="w-4 h-4" /> },
            { label: "Khuyến mãi", href: "/admin/promotions", icon: <Gift className="w-4 h-4" /> },
            { label: "Chi tiết", icon: <Tag className="w-4 h-4" /> },
          ]}
        />
      </div>

      <div className="gap-8 md:flex">
   {/* LEFT: IMAGE */}
      <div className="p-4 space-y-3 bg-white rounded-lg shadow-md md:w-1/2">
        <img
          src={
            promotion.image && promotion.image !== "null"
              ? promotion.image
              : defaultImage
          }
          alt={promotion.name}
          className="object-contain w-full rounded-lg cursor-pointer h-96 hover:opacity-80"
          onClick={() => setShowImageModal(true)}
          onError={(e) => {
            e.currentTarget.onerror = null; 
            e.currentTarget.src = defaultImage;
          }}
        />
      </div>

        {/* RIGHT: INFO */}
        <div className="flex flex-col gap-4 md:w-1/2">
          {/* Basic Info */}
          <div className="p-5 space-y-3 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800">{promotion.name}</h2>

            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                promotion.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {promotion.status === "Active" ? "Đang áp dụng" : "Ngừng áp dụng"}
            </span>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">Ngày bắt đầu</p>
                  <p className="font-semibold">
                    {promotion.start_date
                      ? new Date(promotion.start_date).toLocaleDateString("vi-VN")
                      : "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                <Calendar className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-xs text-gray-500">Ngày kết thúc</p>
                  <p className="font-semibold">
                    {promotion.end_date
                      ? new Date(promotion.end_date).toLocaleDateString("vi-VN")
                      : "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-lg shadow-inner bg-gray-50">
            <h3 className="mb-2 text-lg font-semibold">Mô tả chương trình</h3>
            <p className="text-gray-700">
              {promotion.description || "Chưa có mô tả cho chương trình này."}
            </p>
          </div>

          {/* Coupons */}
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="flex items-center gap-2 mb-3 text-lg font-semibold">
              <Ticket className="w-5 h-5 text-purple-600" />
              Mã giảm giá áp dụng
            </h3>

            {promotion.coupons?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {promotion.coupons.map((c) => (
                  <span
                    key={c.id}
                    className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full"
                  >
                    {c.code}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Chưa có mã giảm giá nào được áp dụng.</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/promotions")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>

            <Button
              onClick={() => navigate(`/admin/promotions/${promotion.id}/edit`)}
              className="flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Chỉnh sửa
            </Button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative p-4 bg-white rounded-lg max-w-3xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute text-gray-600 top-2 right-2 hover:text-red-500"
              onClick={() => setShowImageModal(false)}
            >
              ✕
            </button>
           <img
          src={
            promotion.image && promotion.image !== "null"
              ? promotion.image
              : defaultImage
          }
          alt={promotion.name}
          className="object-contain w-full rounded-lg cursor-pointer h-96 hover:opacity-80"
          onClick={() => setShowImageModal(true)}
          onError={(e) => {
            e.currentTarget.onerror = null; 
            e.currentTarget.src = defaultImage;
          }}
        />
          </div>
        </div>
      )}
    </div>
  );
}
