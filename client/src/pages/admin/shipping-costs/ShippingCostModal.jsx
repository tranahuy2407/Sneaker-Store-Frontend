import React, { useEffect, useState } from "react";
import { X, Truck } from "lucide-react";

export default function ShippingCostModal({
  open,
  onClose,
  onSubmit,
  initialData,
}) {
  const [form, setForm] = useState({
    name: "",
    cost: "",
    is_active: true,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        cost: initialData.cost || "",
        is_active: initialData.is_active ?? true,
      });
    } else {
      setForm({
        name: "",
        cost: "",
        is_active: true,
      });
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit({
        name: form.name.trim(),
        cost: Number(form.cost),
        is_active: form.is_active,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg animate-scale-in">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">
              {initialData ? "Chỉnh sửa phí vận chuyển" : "Thêm phí vận chuyển"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-gray-400 rounded hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {/* KHU VỰC */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Khu vực / Tỉnh thành
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Ví dụ: TP Hồ Chí Minh"
              className="w-full px-3 py-2 text-sm border rounded-md focus:ring focus:ring-blue-200"
            />
          </div>

          {/* PHÍ */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Phí vận chuyển (₫)
            </label>
            <input
              type="number"
              name="cost"
              required
              min={0}
              value={form.cost}
              onChange={handleChange}
              placeholder="30000"
              className="w-full px-3 py-2 text-sm border rounded-md focus:ring focus:ring-blue-200"
            />
          </div>

          {/* TRẠNG THÁI */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Đang áp dụng</span>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting
                ? "Đang lưu..."
                : initialData
                ? "Cập nhật"
                : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
