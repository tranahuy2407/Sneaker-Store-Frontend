import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import productAPI from "../api/product.api";

export default function InventoryModal({
open,
onClose,
product,
loading,
onSubmit,
}) {
const [sizes, setSizes] = useState([]);
const [quantities, setQuantities] = useState({});

// Tổng tồn kho (an toàn nếu sizes chưa load)
const totalStock = (sizes || []).reduce(
(sum, s) => sum + (s.stock || 0) + (quantities[s.id] || 0),
0
);

useEffect(() => {
if (product) {
const fetchSizes = async () => {
try {
const res = await productAPI.getById(product.id);
const productSizes = res.data.data?.sizes || [];
setSizes(productSizes);
      const initialQuantities = {};
      productSizes.forEach((s) => {
        initialQuantities[s.id] = 0;
      });
      setQuantities(initialQuantities);
    } catch (err) {
      console.error(err);
    }
  };
  fetchSizes();
}

}, [product]);

const handleChangeQuantity = (sizeId, value) => {
const numberValue = Number(value);
setQuantities((prev) => ({ ...prev, [sizeId]: isNaN(numberValue) ? 0 : numberValue }));
};

const handleSubmit = async () => {
const changes = (sizes || [])
.map((s) => ({ size_id: s.id, change_quantity: quantities[s.id] }))
.filter((c) => c.change_quantity !== 0);

if (changes.length === 0) {
  alert("Nhập ít nhất 1 size với số lượng khác 0!");
  return;
}

try {
  await onSubmit(changes);
  // Reset quantities sau khi submit
  const reset = {};
  Object.keys(quantities).forEach((k) => (reset[k] = 0));
  setQuantities(reset);
  onClose();
} catch (err) {
  console.error(err);
  alert("Cập nhật kho thất bại!");
}

};

if (!open || !product) return null;

return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"> <div className="w-[460px] p-6 bg-white rounded-xl shadow-xl overflow-y-auto max-h-[80vh]"> <h2 className="mb-4 text-xl font-bold text-gray-800">
Nhập kho: <span className="text-blue-600">{product.name}</span> </h2> <p className="mb-4 font-semibold">
Tổng tồn kho hiện tại (tất cả size + thay đổi): {totalStock} </p>
    {(sizes || []).map((s) => (
      <div key={s.id} className="flex justify-between items-center mb-3">
        <span>Size {s.size} (Tồn: {s.stock || 0})</span>
        <input
          type="number"
          className="w-20 p-1 border rounded-lg text-right"
          value={quantities[s.id] || 0}
          onChange={(e) => handleChangeQuantity(s.id, e.target.value)}
        />
      </div>
    ))}

    <div className="flex justify-end gap-3 mt-4">
      <Button variant="secondary" onClick={onClose}>
        Hủy
      </Button>
      <Button variant="primary" onClick={handleSubmit} disabled={loading}>
        {loading ? "Đang lưu..." : "Cập nhật"}
      </Button>
    </div>
  </div>
</div>
);
}
