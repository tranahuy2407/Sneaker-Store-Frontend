import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartProvider";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/redux/slices/userAuthSlice";
import paymentAPI from "@/api/payment_method.api";
import { fetchProvinces, fetchDistricts, fetchWards } from "@/api/address.api";
import orderAPI from "@/api/order.api";
import SuccessNotification from "@/components/SuccessNotification";
import WarningNotification from "@/components/WarningNotification";
import { refreshUserProfile } from "@/redux/slices/userAuthSlice";
import CouponModal from "./components/CouponModal";
import { Ticket } from "lucide-react";
import { userAPI } from "@/api/user.api";

const normalize = (str = "") =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^(tinh|thanh pho|quan|huyen|phuong|xa)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();

const getIdByName = (list, name) =>
  list.find((i) => normalize(i.label) === normalize(name))?.value || "";

const getNameById = (list, id) =>
  list.find((i) => String(i.value) === String(id))?.label || "";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, clearCart, coupon, setCoupon, clearCoupon } = useCart();
  const [openCoupon, setOpenCoupon] = useState(false);
  const { isAuthenticated, user } = useSelector((s) => s.userAuth);
  const [items, setItems] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState("other");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [warningMsg, setWarningMsg] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [wardId, setWardId] = useState("");
  const { profileLoaded } = useSelector((s) => s.userAuth);

  const addressBook = useMemo(() => {
    if (!isAuthenticated || !profileLoaded) return [];
    return Array.isArray(user?.addresses) ? user.addresses : [];
  }, [isAuthenticated, profileLoaded, user]);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    note: "",
  });
  const buildShippingPayload = () => ({
    name: shippingInfo.name,
    phone: shippingInfo.phone,
    email: shippingInfo.email,
    address_line: shippingInfo.address,
    ward: shippingInfo.ward,
    district: shippingInfo.district,
    city: shippingInfo.province,
    note: shippingInfo.note,
  });

  const isUsingSavedAddress = selectedAddressId !== "other";

  useEffect(() => {
    if (location.state?.buyNow && location.state?.items) {
      setItems(
        location.state.items.map((i) => ({
          ...i,
          product_size_id: i.product_size_id || i.productSizeId || i.id,
        })),
      );
    } else {
      setItems(
        cart.map((i) => ({
          product_size_id: i.productSizeId,
          quantity: i.quantity,
          price: i.product.discountPrice ?? i.product.price,
          product: i.product,
          size: i.size,
        })),
      );
    }
  }, [cart, location]);

  useEffect(() => {
    if (isAuthenticated && !user?.addresses) {
      dispatch(refreshUserProfile());
    }
  }, [isAuthenticated, user, dispatch]);
  useEffect(() => {
    fetchProvinces().then(setProvinces);
  }, []);
  useEffect(() => {
    if (!provinceId) {
      setDistricts([]);
      setWards([]);
      return;
    }
    fetchDistricts(provinceId).then(setDistricts);
  }, [provinceId]);
  useEffect(() => {
    if (!districtId) {
      setWards([]);
      return;
    }
    fetchWards(districtId).then(setWards);
  }, [districtId]);
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    setShippingInfo((p) => ({
      ...p,
      email: user.email || "",
    }));
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!profileLoaded) return;
    if (!addressBook.length) return;

    const def = addressBook.find((a) => a.is_default);
    if (def) {
      setSelectedAddressId(def.id);
    }
  }, [profileLoaded, addressBook]);

  useEffect(() => {
    if (
      selectedAddressId === "other" ||
      !provinces.length ||
      !addressBook.length
    )
      return;

    const addr = addressBook.find(
      (a) => String(a.id) === String(selectedAddressId),
    );
    if (!addr) return;

    setSelectedAddress(addr);

    const pId = getIdByName(provinces, addr.city);
    setProvinceId(pId);

    setShippingInfo((prev) => ({
      ...prev,
      name: addr.receiver_name || "",
      phone: addr.receiver_phone || "",
      address: addr.address_line || "",
      province: addr.city || "",
      district: "",
      ward: "",
      note: addr.note || "",
    }));
  }, [selectedAddressId, provinces, addressBook]);

  useEffect(() => {
    if (!districts.length || !selectedAddress) return;

    const dId = getIdByName(districts, selectedAddress.district);
    setDistrictId(dId);

    setShippingInfo((p) => ({
      ...p,
      district: selectedAddress.district || "",
    }));
  }, [districts, selectedAddress]);

  useEffect(() => {
    if (!wards.length || !selectedAddress) return;

    const wId = getIdByName(wards, selectedAddress.ward);
    setWardId(wId);

    setShippingInfo((p) => ({
      ...p,
      ward: selectedAddress.ward || "",
    }));
  }, [wards, selectedAddress]);

  useEffect(() => {
    paymentAPI.getAll({ is_active: true }).then((res) => {
      setPaymentMethods(res.data?.data || []);
    });
  }, []);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, i) => {
        const price = i.product.discountPrice ?? i.product.price ?? 0;
        return sum + price * i.quantity;
      }, 0),
    [items],
  );

  const discountAmount = coupon?.data?.discountAmount || 0;
  const finalTotal = Math.max(subtotal - discountAmount, 0);
  const productIds = useMemo(() => cart.map((i) => i.product?.id || i.id), [cart]);
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      setWarningMsg("Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (!shippingInfo.email) {
      setWarningMsg("Vui lòng nhập email nhận đơn hàng");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      setWarningMsg("Email không đúng định dạng");
      return;
    }

    if (
      !shippingInfo.name ||
      !shippingInfo.phone ||
      !shippingInfo.address ||
      !shippingInfo.province ||
      !shippingInfo.district ||
      !shippingInfo.ward
    ) {
      setWarningMsg("Vui lòng nhập đầy đủ thông tin giao hàng");
      return;
    }

    // Auto-save address if it's the user's first address
    if (isAuthenticated && selectedAddressId === "other" && addressBook.length === 0) {
      try {
        await userAPI.addAddress({
          receiver_name: shippingInfo.name,
          receiver_phone: shippingInfo.phone,
          address_line: shippingInfo.address,
          ward: shippingInfo.ward,
          district: shippingInfo.district,
          city: shippingInfo.province,
          note: shippingInfo.note,
          is_default: true,
        });
        dispatch(refreshUserProfile());
      } catch (err) {
        console.error("Lỗi tự động lưu địa chỉ:", err);
      }
    }

    try {
      const res = await orderAPI.create({
        items: items.map((i) => ({
          product_id: i.product.id,
          product_size_id: i.product_size_id,
          quantity: i.quantity,
          price: i.price,
        })),
        payment_method_id: paymentMethod,
        shippingInfo: buildShippingPayload(),
        total: finalTotal,
        coupon_code: coupon?.data?.coupon?.code || null,
      });

      const { paymentUrl } = res.data;
      
      await clearCart();
      if (coupon) clearCoupon();

      if (paymentUrl) {
        window.location.href = paymentUrl;
        return;
      }

      setSuccessMsg("Đặt hàng thành công !");

      setTimeout(() => {
        navigate("/order-success", {
          state: {
            email: shippingInfo.email,
            total: finalTotal,
            items: items.map((i) => ({
              name: i.product.name,
              size: i.size,
              quantity: i.quantity,
              price: i.price,
            })),
          },
          replace: true,
        });
      }, 1200);
    } catch (err) {
      setWarningMsg(err.response?.data?.message || "Đặt hàng thất bại");
    }
  };

  /* ================== UI ================== */
  return (
    <div className="min-h-screen bg-white">
      <div className="grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 mx-auto md:grid-cols-3">
        {/* ================= LEFT ================= */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-blue-600">SNEAKERSTORE</h1>

          {/* ADDRESS BOOK */}
          {isAuthenticated && (
            <select
              className="w-full p-3 border rounded"
              value={selectedAddressId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedAddressId(id);

                if (id === "other") {
                  setProvinceId("");
                  setDistrictId("");
                  setWardId("");
                  setShippingInfo({
                    name: "",
                    phone: "",
                    email: isAuthenticated ? user?.email || "" : "",
                    address: "",
                    province: "",
                    district: "",
                    ward: "",
                    note: "",
                  });
                }
              }}
            >
              <option value="other">Địa chỉ khác</option>

              {addressBook.map((a) => (
                <option key={`addr-${a.id}`} value={a.id}>
                  {a.address_line}, {a.ward}, {a.district}, {a.city}
                </option>
              ))}
            </select>
          )}

          {/* INFO */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <h2 className="font-semibold">Thông tin nhận hàng</h2>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-sm text-blue-500"
                >
                  Đăng xuất
                </button>
              ) : (
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  className="text-sm text-blue-500"
                >
                  Đăng nhập
                </Link>
              )}
            </div>

            {/* EMAIL */}
            {isAuthenticated ? (
              <input
                disabled
                value={user?.email || ""}
                className="w-full p-3 bg-gray-100 border rounded"
              />
            ) : (
              <input
                placeholder="Email nhận đơn hàng"
                value={shippingInfo.email}
                onChange={(e) =>
                  setShippingInfo((p) => ({ ...p, email: e.target.value }))
                }
                className="w-full p-3 border rounded"
              />
            )}

            <input
              disabled={isUsingSavedAddress}
              placeholder="Họ và tên"
              value={shippingInfo.name}
              onChange={(e) =>
                setShippingInfo((p) => ({ ...p, name: e.target.value }))
              }
              className="w-full p-3 border rounded"
            />

            <input
              disabled={isUsingSavedAddress}
              placeholder="Số điện thoại"
              value={shippingInfo.phone}
              onChange={(e) =>
                setShippingInfo((p) => ({ ...p, phone: e.target.value }))
              }
              className="w-full p-3 border rounded"
            />

            {/* PROVINCE */}
            <select
              disabled={isUsingSavedAddress}
              value={provinceId}
              className="w-full p-3 border rounded"
              onChange={(e) => {
                const v = e.target.value;
                setProvinceId(v);
                setDistrictId("");
                setWardId("");
                setShippingInfo((p) => ({
                  ...p,
                  province: getNameById(provinces, v),
                  district: "",
                  ward: "",
                }));
              }}
            >
              <option value="">Tỉnh / Thành</option>
              {provinces.map((p) => (
                <option key={`p-${p.value}`} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>

            {/* DISTRICT */}
            <select
              disabled={isUsingSavedAddress || !districts.length}
              value={districtId}
              className="w-full p-3 border rounded"
              onChange={(e) => {
                const v = e.target.value;
                setDistrictId(v);
                setWardId("");
                setShippingInfo((p) => ({
                  ...p,
                  district: getNameById(districts, v),
                  ward: "",
                }));
              }}
            >
              <option value="">Quận / Huyện</option>
              {districts.map((d) => (
                <option key={`d-${d.value}`} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>

            {/* WARD */}
            <select
              disabled={isUsingSavedAddress || !wards.length}
              value={wardId}
              className="w-full p-3 border rounded"
              onChange={(e) => {
                const v = e.target.value;
                setWardId(v);
                setShippingInfo((p) => ({
                  ...p,
                  ward: getNameById(wards, v),
                }));
              }}
            >
              <option value="">Phường / Xã</option>
              {wards.map((w) => (
                <option key={`w-${w.value}`} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>

            <input
              disabled={isUsingSavedAddress}
              placeholder="Địa chỉ chi tiết"
              value={shippingInfo.address}
              onChange={(e) =>
                setShippingInfo((p) => ({ ...p, address: e.target.value }))
              }
              className="w-full p-3 border rounded"
            />

            <textarea
              disabled={isUsingSavedAddress}
              placeholder="Ghi chú"
              value={shippingInfo.note}
              onChange={(e) =>
                setShippingInfo((p) => ({ ...p, note: e.target.value }))
              }
              className="w-full p-3 border rounded"
            />
          </div>
        </div>

        {/* ================= MIDDLE ================= */}
        <div className="space-y-4">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Vận chuyển</h2>{" "}
            <div className="px-4 py-3 text-blue-700 border border-blue-200 rounded bg-blue-50">
              {" "}
              Vui lòng nhập đầy đủ địa chỉ giao hàng{" "}
            </div>{" "}
          </div>
          <h2 className="text-lg font-semibold">Thanh toán</h2>

          {paymentMethods.map((m) => {
            const isSelected = paymentMethod === m.id;

            return (
              <label
                key={`pay-${m.id}`}
                className={`block p-4 border rounded cursor-pointer ${
                  isSelected ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={() => setPaymentMethod(m.id)}
                  />
                  <img src={m.logo} alt={m.name} className="w-8 h-8" />
                  <span className="font-medium">{m.name}</span>
                </div>

                {isSelected && m.description && (
                  <p className="mt-2 text-sm text-gray-600 ml-7">
                    {m.description}
                  </p>
                )}
              </label>
            );
          })}
        </div>

        {/* ================= RIGHT ================= */}
        <div className="pl-6 space-y-4 border-l">
          <h2 className="font-semibold">Đơn hàng</h2>

          {items.map((i) => (
            <div
              key={`${i.product.id}-${i.size}`}
              className="flex items-center gap-4"
            >
              <img
                src={i.product.images?.[0]?.url}
                className="w-16 h-16 border rounded"
              />
              <div className="flex-1">
                <p>{i.product.name}</p>
                <p className="text-sm font-bold text-gray-500">
                  Size: {i.size}
                </p>
              </div>
              <span className="font-semibold">
                {(i.product.discountPrice ?? i.product.price).toLocaleString()}{" "}
                đ x {i.quantity}
              </span>
            </div>
          ))}

          {/* COUPON SECTION */}
          <div className="py-3 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-blue-500" />
                {coupon ? (
                  <span className="text-sm font-medium text-green-600">
                    {coupon.data?.coupon?.code} — Giảm {coupon.data?.discountAmount?.toLocaleString()}đ
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">Chưa có mã giảm giá</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setOpenCoupon(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {coupon ? "Đổi mã" : "Chọn mã"}
                </button>
                {coupon && (
                  <button
                    onClick={clearCoupon}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Huỷ
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span className="font-semibold text-gray-700">
                {subtotal.toLocaleString()}đ
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between mt-1">
                <span className="text-green-600">Mã giảm giá</span>
                <span className="font-semibold text-green-600">
                  -{discountAmount.toLocaleString()}đ
                </span>
              </div>
            )}
            <div className="flex justify-between mt-2">
              <span className="font-semibold">Tổng cộng</span>
              <span className="font-bold text-blue-600">
                {finalTotal.toLocaleString()}đ
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <span
              onClick={() => navigate("/cart")}
              className="py-2 text-sm text-blue-600 cursor-pointer hover:underline"
            >
              ← Quay về giỏ hàng
            </span>
            <button
              onClick={handlePlaceOrder}
              className="flex-1 py-3 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>
      {successMsg && (
        <SuccessNotification
          message={successMsg}
          onClose={() => setSuccessMsg("")}
        />
      )}

      {warningMsg && (
        <WarningNotification
          message={warningMsg}
          onClose={() => setWarningMsg("")}
        />
      )}

      <CouponModal
        open={openCoupon}
        onClose={() => setOpenCoupon(false)}
        orderTotal={subtotal}
        productIds={productIds}
        selectedCode={coupon?.data?.coupon?.code}
        onApply={(data) => setCoupon(data)}
      />
    </div>
  );
};

export default CheckoutPage;
