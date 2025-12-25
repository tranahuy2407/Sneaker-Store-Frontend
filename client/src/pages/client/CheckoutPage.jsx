import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartProvider";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/redux/slices/userAuthSlice";
import paymentAPI from "@/api/payment_method.api";
import { fetchProvinces, fetchDistricts, fetchWards } from "@/api/address.api";
import orderAPI from "@/api/order.api";

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

/* ================== COMPONENT ================== */
const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useCart();
  const { isAuthenticated, user } = useSelector((s) => s.userAuth);

  /* ================== ORDER ================== */
  const [items, setItems] = useState([]);

  /* ================== PAYMENT ================== */
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);


  /* ================== ADDRESS BOOK ================== */
  const [addressBook, setAddressBook] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("other");

  /* ================== ADDRESS API ================== */
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [wardId, setWardId] = useState("");

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
    address_line: shippingInfo.address,
    ward: shippingInfo.ward,
    district: shippingInfo.district,
    city: shippingInfo.province,
    note: shippingInfo.note,
  });

  const isUsingSavedAddress = selectedAddressId !== "other";

  /* ================== LOAD CART ================== */
  useEffect(() => {
  if (location.state?.buyNow && location.state?.items) {
    setItems(location.state.items);
  } else {
    setItems(
      cart.map((i) => ({
        product_size_id: i.productSizeId,  
        quantity: i.quantity,
        price: i.product.discountPrice ?? i.product.price,
        product: i.product,
        size: i.size,
      }))
    );
  }
}, [cart, location]);
useEffect(() => {
  if (location.state?.buyNow && location.state?.items) {
    setItems(location.state.items);
  } else {
    setItems(
      cart.map((i) => ({
        product_size_id: i.productSizeId, 
        quantity: i.quantity,
        price: i.product.discountPrice ?? i.product.price,
        product: i.product,
        size: i.size,
      }))
    );
  }
}, [cart, location]);


  /* ================== LOAD PROVINCES ================== */
  useEffect(() => {
    fetchProvinces().then(setProvinces);
  }, []);

  /* ================== LOAD DISTRICTS ================== */
  useEffect(() => {
    if (!provinceId) {
      setDistricts([]);
      setWards([]);
      return;
    }
    fetchDistricts(provinceId).then(setDistricts);
  }, [provinceId]);

  /* ================== LOAD WARDS ================== */
  useEffect(() => {
    if (!districtId) {
      setWards([]);
      return;
    }
    fetchWards(districtId).then(setWards);
  }, [districtId]);

  /* ================== LOAD USER ADDRESS ================== */
useEffect(() => {
  if (!isAuthenticated || !user) return;

  setShippingInfo((p) => ({
    ...p,
    email: user.email || "",
  }));

  const addresses = user.addresses || [];
  setAddressBook(addresses);

  const def = addresses.find((a) => a.is_default);
  if (def) setSelectedAddressId(def.id);
}, [isAuthenticated, user]);


  /* ================== APPLY ADDRESS WHEN SELECT ================== */
  useEffect(() => {
    if (selectedAddressId === "other") return;

    const addr = addressBook.find(
      (a) => String(a.id) === String(selectedAddressId)
    );
    if (!addr || !provinces.length) return;

    const pId = getIdByName(provinces, addr.city);
    setProvinceId(pId);

    setShippingInfo({
      name: addr.receiver_name,
      phone: addr.receiver_phone,
      address: addr.address_line,
      province: addr.city,
      district: addr.district,
      ward: addr.ward,
      note: addr.note || "",
    });
  }, [selectedAddressId, addressBook, provinces]);

  /* ================== SYNC DISTRICT / WARD ================== */
  useEffect(() => {
    if (!districts.length || selectedAddressId === "other") return;

    const addr = addressBook.find(
      (a) => String(a.id) === String(selectedAddressId)
    );
    if (!addr) return;

    const dId = getIdByName(districts, addr.district);
    setDistrictId(dId);
  }, [districts]);

  useEffect(() => {
    if (!wards.length || selectedAddressId === "other") return;

    const addr = addressBook.find(
      (a) => String(a.id) === String(selectedAddressId)
    );
    if (!addr) return;

    const wId = getIdByName(wards, addr.ward);
    setWardId(wId);
  }, [wards]);

  /* ================== PAYMENT ================== */
  useEffect(() => {
    paymentAPI.getAll({ is_active: true }).then((res) => {
      setPaymentMethods(res.data?.data || []);
    });
  }, []);

  /* ================== TOTAL ================== */
  const subtotal = useMemo(
    () =>
      items.reduce((sum, i) => {
        const price = i.product.discountPrice ?? i.product.price ?? 0;
        return sum + price * i.quantity;
      }, 0),
    [items]
  );

  /* ================== ACTIONS ================== */
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

const handlePlaceOrder = async () => {
  if (!paymentMethod) {
    alert("Vui lòng chọn phương thức thanh toán");
    return;
  }
  if (!shippingInfo.email) {
    alert("Vui lòng nhập email nhận đơn hàng");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(shippingInfo.email)) {
    alert("Email không đúng định dạng");
    return;
  }

  try {
    await orderAPI.create({
      items: items.map((i) => ({
        product_size_id: i.product_size_id,
        quantity: i.quantity,
        price: i.price,
      })),
      payment_method_id: paymentMethod,
      shippingInfo: buildShippingPayload(),
      total: subtotal,
    });

    alert("Đặt hàng thành công");
    navigate("/");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Đặt hàng thất bại");
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
              <option value="other">➕ Địa chỉ khác</option>

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
                <Link to="/login" className="text-sm text-blue-500">
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
                <p className="text-sm text-gray-500">Size: {i.size}</p>
              </div>
              <span className="font-semibold">
                {(i.product.discountPrice ?? i.product.price).toLocaleString()}đ
              </span>
            </div>
          ))}

          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <span>Tổng cộng</span>
              <span className="font-semibold text-blue-600">
                {subtotal.toLocaleString()}đ
              </span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full py-3 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            ĐẶT HÀNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
