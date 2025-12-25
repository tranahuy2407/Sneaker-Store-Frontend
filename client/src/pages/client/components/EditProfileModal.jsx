import { useEffect, useState } from "react";
import { userAPI } from "@/api/user.api";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
} from "@/api/address.api";
import WarningModal from "@/components/WarningModal";
import SuccessNotification from "@/components/SuccessNotification";

/* ================== HELPERS ================== */
const normalize = (str = "") =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^(tinh|thanh pho|quan|huyen|phuong|xa)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();

// API trả { value, label }
const getIdByName = (list, name) =>
  list.find((i) => normalize(i.label) === normalize(name))?.value || "";

const getNameById = (list, value) =>
  list.find((i) => String(i.value) === String(value))?.label || "";

/* ================== COMPONENT ================== */
export function EditProfileModal({ user, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: user.username || "",
    newPassword: "",
    confirmPassword: "",
    addresses: user.addresses || [],
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [showWarning, setShowWarning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const selectedAddress = form.addresses[selectedIndex];

  /* ========== LOAD PROVINCES ========== */
  useEffect(() => {
    fetchProvinces().then(setProvinces);
  }, []);

  /* ========== MAP NAME → VALUE KHI INIT ========== */
  useEffect(() => {
    if (!provinces.length || !form.addresses.length || initialized) return;

    const init = async () => {
      const mapped = await Promise.all(
        form.addresses.map(async (addr) => {
          const cityValue = getIdByName(provinces, addr.city);

          let districtValue = "";
          let wardValue = "";

          if (cityValue) {
            const dList = await fetchDistricts(cityValue);
            districtValue = getIdByName(dList, addr.district);

            if (districtValue) {
              const wList = await fetchWards(districtValue);
              wardValue = getIdByName(wList, addr.ward);
            }
          }

          return {
            ...addr,
            city: cityValue,
            district: districtValue,
            ward: wardValue,
          };
        })
      );

      setForm((prev) => ({ ...prev, addresses: mapped }));
      setInitialized(true);
    };

    init();
  }, [provinces]);

  /* ========== LOAD DISTRICTS ========== */
  useEffect(() => {
    if (!selectedAddress?.city) {
      setDistricts([]);
      setWards([]);
      return;
    }

    fetchDistricts(selectedAddress.city).then(setDistricts);
  }, [selectedIndex, selectedAddress?.city]);

  /* ========== LOAD WARDS ========== */
  useEffect(() => {
    if (!selectedAddress?.district) {
      setWards([]);
      return;
    }

    fetchWards(selectedAddress.district).then(setWards);
  }, [selectedAddress?.district]);

  /* ========== HELPERS ========== */
  const updateSelectedAddress = (field, value) => {
    setForm((prev) => {
      const updated = [...prev.addresses];
      updated[selectedIndex] = {
        ...updated[selectedIndex],
        [field]: value,
      };
      return { ...prev, addresses: updated };
    });
  };

  const setDefaultAddress = (index) => {
    setForm((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a, i) => ({
        ...a,
        is_default: i === index,
      })),
    }));
  };

  /* ========== SUBMIT ========== */
  const submitProfile = async () => {
    const addresses = await Promise.all(
      form.addresses.map(async (addr) => {
        const dList = addr.city ? await fetchDistricts(addr.city) : [];
        const wList = addr.district ? await fetchWards(addr.district) : [];

        return {
          ...addr,
          city: getNameById(provinces, addr.city),
          district: getNameById(dList, addr.district),
          ward: getNameById(wList, addr.ward),
        };
      })
    );

    await userAPI.updateProfile({
      name: form.name,
      addresses,
    });

    setShowSuccess(true);
    onSuccess?.();
  };

  const handleSubmit = async () => {
    if (
      form.newPassword &&
      form.newPassword !== form.confirmPassword
    ) {
      alert("Mật khẩu không khớp");
      return;
    }

    if (form.newPassword) {
      setShowWarning(true);
      return;
    }

    await submitProfile();
  };

  if (!selectedAddress) return null;

  /* ================== UI ================== */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg">
        <h2 className="mb-4 text-xl font-semibold">Chỉnh sửa hồ sơ</h2>

        {/* USER INFO */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <input
            className="p-2 border rounded"
            placeholder="Tên"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="password"
            className="p-2 border rounded"
            placeholder="Mật khẩu mới"
            value={form.newPassword}
            onChange={(e) =>
              setForm({ ...form, newPassword: e.target.value })
            }
          />

          <input
            type="password"
            className="col-span-2 p-2 border rounded"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value,
              })
            }
          />
        </div>

        {/* ADDRESS */}
        <div className="grid grid-cols-3 gap-4">
          {/* LIST */}
          <div className="space-y-2">
            {form.addresses.map((addr, i) => (
              <div
                key={addr.id}
                onClick={() => setSelectedIndex(i)}
                className={`p-3 border rounded cursor-pointer ${
                  selectedIndex === i
                    ? "border-black bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <p className="font-medium">{addr.receiver_name}</p>
                <p className="text-sm text-gray-600">
                  {addr.address_line}
                </p>
                {addr.is_default && (
                  <span className="text-xs text-green-600">
                    Mặc định
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDefaultAddress(i);
                  }}
                  className="block mt-2 text-xs text-blue-600"
                >
                  Đặt mặc định
                </button>
              </div>
            ))}
          </div>

          {/* FORM */}
          <div className="col-span-2 p-4 border rounded bg-gray-50">
            <input
              className="w-full p-2 mb-2 border rounded"
              placeholder="Tên người nhận"
              value={selectedAddress.receiver_name || ""}
              onChange={(e) =>
                updateSelectedAddress("receiver_name", e.target.value)
              }
            />

            <input
              className="w-full p-2 mb-2 border rounded"
              placeholder="Số điện thoại"
              value={selectedAddress.receiver_phone || ""}
              onChange={(e) =>
                updateSelectedAddress("receiver_phone", e.target.value)
              }
            />

            <input
              className="w-full p-2 mb-2 border rounded"
              placeholder="Địa chỉ chi tiết"
              value={selectedAddress.address_line || ""}
              onChange={(e) =>
                updateSelectedAddress("address_line", e.target.value)
              }
            />

            {/* PROVINCE */}
            <select
              className="w-full p-2 mb-2 border rounded"
              value={selectedAddress.city || ""}
              onChange={(e) => {
                updateSelectedAddress("city", e.target.value);
                updateSelectedAddress("district", "");
                updateSelectedAddress("ward", "");
              }}
            >
              <option value="">-- Tỉnh / Thành --</option>
              {provinces.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>

            {/* DISTRICT */}
            <select
              className="w-full p-2 mb-2 border rounded"
              value={selectedAddress.district || ""}
              disabled={!districts.length}
              onChange={(e) => {
                updateSelectedAddress("district", e.target.value);
                updateSelectedAddress("ward", "");
              }}
            >
              <option value="">-- Quận / Huyện --</option>
              {districts.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>

            {/* WARD */}
            <select
              className="w-full p-2 border rounded"
              value={selectedAddress.ward || ""}
              disabled={!wards.length}
              onChange={(e) =>
                updateSelectedAddress("ward", e.target.value)
              }
            >
              <option value="">-- Phường / Xã --</option>
              {wards.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-black rounded"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>

      <WarningModal
        open={showWarning}
        title="Xác nhận đổi mật khẩu"
        message="Bạn có chắc chắn muốn đổi mật khẩu không?"
        confirmText="Đổi"
        onCancel={() => setShowWarning(false)}
        onConfirm={async () => {
          setShowWarning(false);
          await submitProfile();
        }}
      />

      {showSuccess && (
        <SuccessNotification
          message="Cập nhật hồ sơ thành công!"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
