import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../redux/slices/userAuthSlice";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import {
  MapPin,
  Smartphone,
  Map,
  Building,
  Globe,
  Home,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { userAPI } from "@/api/user.api";
import { EditProfileModal } from "./components/EditProfileModal";
import { AddAddressModal } from "./components/AddAddressModal";
import {
  checkUserAuth,
  refreshUserProfile,
} from "../../redux/slices/userAuthSlice";
import orderAPI from "@/api/order.api";
import LoyaltySection from "./components/LoyaltySection";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, checkingAuth, profileLoaded } = useSelector(
    (state) => state.userAuth
  );
  const [headerHeight, setHeaderHeight] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const addresses = user?.addresses || [];
  
  useEffect(() => {
    if (!checkingAuth && user?.id && !profileLoaded) {
      dispatch(refreshUserProfile());
    }
  }, [checkingAuth, user?.id, profileLoaded, dispatch]);
  useEffect(() => {
    if (!checkingAuth && user?.id) {
      setLoadingOrders(true);
      orderAPI
        .getMyOrders()
        .then((res) => {
          setOrders(res.data.data || []);
        })
        .catch(() => {
          setOrders([]);
        })
        .finally(() => {
          setLoadingOrders(false);
        });
    }
  }, [checkingAuth, user?.id]);
  const formatAddress = (order) => {
    return [
      order.address_line,
      order.ward,
      order.district,
      order.city,
    ]
      .filter(Boolean)
      .join(", ");
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center py-20">
        Đang tải thông tin tài khoản...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center text-red-500">
        Không thể tải thông tin người dùng
      </div>
    );
  }
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/", icon: <Home size={14} /> },
    { label: "Trang khách hàng", icon: <User size={14} /> },
  ];
  const defaultAddress = user?.addresses?.find(
    (addr) => addr.is_default === true
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header onHeightChange={setHeaderHeight} />
      <Navbar onHeightChange={setNavbarHeight} />

      <div className="container px-4 py-10 mx-auto md:px-16">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Trang cá nhân</h1>
            <p className="text-gray-500 mt-1">
            Xin chào, <span className="font-bold text-blue-600">{user?.name || user?.username}!</span>
            </p>
        </div>

        {/* Loyalty Section */}
        <LoyaltySection orders={orders} user={user} />

        <div className="flex flex-col gap-8 md:flex-row">
          {/* LEFT: Orders */}
          <div className="flex-1">
            <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                Đơn hàng của bạn 
                <span className="text-sm font-normal text-gray-400">({orders.length})</span>
            </h2>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3">Đơn hàng</th>
                    <th className="p-3">Ngày đặt</th>
                    <th className="p-3">Tổng tiền</th>
                    <th className="p-3 text-center">Thanh toán</th>
                    <th className="p-3 text-center">Theo dõi</th>
                  </tr>
                </thead>

                <tbody>
                  {loadingOrders ? (
                    <tr>
                      <td colSpan="6" className="p-4 text-center">
                        Đang tải đơn hàng...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-500">
                        Không có đơn hàng nào.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="border-b">
                  <td className="p-3 font-medium">
                    #{order.order_code || order.id}
                  </td>

                  <td className="p-3">
                    {new Date(order.created_at).toLocaleDateString("vi-VN")}
                  </td>

                  <td className="p-3 font-semibold text-red-500">
                    {(order.total_amount || 0).toLocaleString()}đ
                  </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status === "Completed"
                          ? "Đã thanh toán"
                          : order.status === "Cancelled"
                          ? "Đã huỷ"
                          : "Chưa thanh toán"}
                      </span>
                    </td>

                  <td className="p-3 text-center">
                    <Link
                      to={`/orders/${order.id}/tracking`}
                      className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white"
                    >
                      Theo dõi
                    </Link>
                  </td>
                </tr>

                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: Account info */}
          <div className="w-full p-4 border rounded-lg md:w-1/3">
            <h2 className="mb-4 text-lg font-semibold">TÀI KHOẢN CỦA TÔI</h2>

            <p>
              <strong>Tên tài khoản:</strong> {user?.username}
            </p>

            <p className="flex items-center gap-2">
              <MapPin size={16} />
              Địa chỉ:{" "}
              {defaultAddress
                ? `${defaultAddress.address_line}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.city}`
                : ""}
            </p>

            <p className="flex items-center gap-2">
              <Smartphone size={16} />
              Điện thoại: {defaultAddress?.receiver_phone || ""}
            </p>

            <p className="flex items-center gap-2">
              <Map size={16} />
              Người nhận: {defaultAddress?.receiver_name || ""}
            </p>

            <p className="flex items-center gap-2">
              <Building size={16} />
              Ghi chú: {defaultAddress?.note || ""}
            </p>

            <p className="flex items-center gap-2">
              <Globe size={16} />
              Quốc gia: {defaultAddress?.country || "Vietnam"}
            </p>

            <p className="flex items-center gap-2">
              <span>⭐</span>
              Trạng thái:{" "}
              {defaultAddress?.is_default ? "Địa chỉ mặc định" : "Địa chỉ phụ"}
            </p>

            <button
              onClick={() => setShowEditProfile(true)}
              className="w-full py-2 mt-4 font-semibold text-white bg-blue-600 rounded"
            >
              Chỉnh sửa hồ sơ
            </button>

            <button
              onClick={() => setShowAddAddress(true)}
              className="w-full py-2 mt-2 font-semibold text-white bg-gray-800 rounded"
            >
              Sổ địa chỉ ({addresses.length})
            </button>

            <button
              onClick={() => dispatch(logoutUser())}
              className="w-full py-2 mt-2 font-semibold text-white bg-black rounded"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
      {/* Edit profile modal */}
      {showEditProfile && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSuccess={() => dispatch(refreshUserProfile())}
        />
      )}

      {/* Add address modal */}
      {showAddAddress && (
        <AddAddressModal
          onClose={() => setShowAddAddress(false)}
          onSuccess={() => dispatch(refreshUserProfile())}
        />
      )}
    </div>
  );
}
