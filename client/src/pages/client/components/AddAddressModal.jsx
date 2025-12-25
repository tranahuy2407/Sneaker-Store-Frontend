import { useEffect, useState } from "react";
import { userAPI } from "@/api/user.api";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
} from "@/api/address.api";
import WarningModal from "@/components/WarningModal";
import SuccessNotification from "@/components/SuccessNotification";

export function AddAddressModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    receiver_name: "",
    receiver_phone: "",
    address_line: "",
    ward: "",
    district: "",
    city: "",
    country: "Vietnam",
    note: "",
    is_default: false,
  });

  const [showWarning, setShowWarning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");

  /* ===================== LOAD PROVINCES ===================== */
  useEffect(() => {
    fetchProvinces().then(setProvinces).catch(console.error);
  }, []);

  /* ===================== AUTO CLOSE SUCCESS ===================== */
  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [showSuccess, onClose]);

  /* ===================== PROVINCE ===================== */
  const handleProvinceChange = async (e) => {
    const id = e.target.value;
    setProvinceId(id);
    setDistrictId("");
    setDistricts([]);
    setWards([]);

    const province = provinces.find(p => p.value === id);

    setForm(prev => ({
      ...prev,
      city: province?.label || "",
      district: "",
      ward: "",
    }));

    if (id) {
      const data = await fetchDistricts(id);
      setDistricts(data);
    }
  };

  /* ===================== DISTRICT ===================== */
  const handleDistrictChange = async (e) => {
    const id = e.target.value;
    setDistrictId(id);
    setWards([]);

    const district = districts.find(d => d.value === id);

    setForm(prev => ({
      ...prev,
      district: district?.label || "",
      ward: "",
    }));

    if (id) {
      const data = await fetchWards(id);
      setWards(data);
    }
  };

  /* ===================== SUBMIT ===================== */
  const handleSubmit = () => setShowWarning(true);

  const handleConfirmSubmit = async () => {
    try {
      await userAPI.addAddress(form);
      setShowWarning(false);
      setShowSuccess(true);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      setShowWarning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg">
        <h2 className="mb-4 text-xl font-semibold">Thêm địa chỉ mới</h2>

        {/* TÊN */}
        <input
          className="w-full p-2 mb-2 border rounded"
          placeholder="Tên người nhận"
          value={form.receiver_name}
          onChange={(e) =>
            setForm({ ...form, receiver_name: e.target.value })
          }
        />

        {/* SĐT */}
        <input
          className="w-full p-2 mb-2 border rounded"
          placeholder="Số điện thoại"
          value={form.receiver_phone}
          onChange={(e) =>
            setForm({ ...form, receiver_phone: e.target.value })
          }
        />

        {/* TỈNH */}
        <select
          className="w-full p-2 mb-2 border rounded"
          value={provinceId}
          onChange={handleProvinceChange}
        >
          <option value="">Chọn Tỉnh / Thành phố</option>
          {provinces.map(p => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        {/* HUYỆN */}
        <select
          className="w-full p-2 mb-2 border rounded"
          value={districtId}
          disabled={!districts.length}
          onChange={handleDistrictChange}
        >
          <option value="">Chọn Quận / Huyện</option>
          {districts.map(d => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        {/* PHƯỜNG */}
        <select
          className="w-full p-2 mb-2 border rounded"
          disabled={!wards.length}
          onChange={(e) => {
            const ward = wards.find(w => w.value === e.target.value);
            setForm({ ...form, ward: ward?.label || "" });
          }}
        >
          <option value="">Chọn Phường / Xã</option>
          {wards.map(w => (
            <option key={w.value} value={w.value}>
              {w.label}
            </option>
          ))}
        </select>

        {/* ĐỊA CHỈ */}
        <input
          className="w-full p-2 mb-2 border rounded"
          placeholder="Số nhà, tên đường"
          value={form.address_line}
          onChange={(e) =>
            setForm({ ...form, address_line: e.target.value })
          }
        />

        {/* NOTE */}
        <textarea
          className="w-full p-2 mb-2 border rounded"
          placeholder="Ghi chú (tuỳ chọn)"
          value={form.note}
          onChange={(e) =>
            setForm({ ...form, note: e.target.value })
          }
        />

        {/* DEFAULT */}
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={form.is_default}
            onChange={(e) =>
              setForm({ ...form, is_default: e.target.checked })
            }
          />
          Đặt làm địa chỉ mặc định
        </label>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-black rounded"
          >
            Thêm
          </button>
        </div>
      </div>

      <WarningModal
        open={showWarning}
        title="Xác nhận thêm địa chỉ"
        message="Bạn có chắc chắn muốn thêm địa chỉ mới không?"
        confirmText="Thêm"
        variant="primary"
        onCancel={() => setShowWarning(false)}
        onConfirm={handleConfirmSubmit}
      />

      {showSuccess && (
        <SuccessNotification
          message="Thêm địa chỉ thành công!"
          onClose={() => {
            setShowSuccess(false);
            onClose();
          }}
        />
      )}
    </div>
  );
}
