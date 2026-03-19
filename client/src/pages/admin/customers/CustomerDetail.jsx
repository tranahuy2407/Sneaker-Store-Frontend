import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Mail,
  Calendar,
  MapPin,
  ShoppingBag,
  DollarSign,
  PackageCheck,
  PackageX,
  ArrowLeft
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import userAPI from "@/api/user.api";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      setLoading(true);
      try {
        const res = await userAPI.getUserById(id);
        const data = res.data?.data || res.data;
        // Sắp xếp đơn hàng mới nhất lên đầu
        if (data && Array.isArray(data.orders)) {
          data.orders = data.orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        setCustomer(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        <span className="ml-3 text-gray-500">Đang tải dữ liệu khách hàng...</span>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="mb-4 text-red-500">{error || "Không tìm thấy khách hàng"}</p>
        <button
          onClick={() => navigate("/admin/customers")}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          <ArrowLeft size={16} /> Quay lại danh sách
        </button>
      </div>
    );
  }

  const orders = customer.orders || [];
  const addresses = customer.addresses || [];
  const defaultAddress = addresses.find((a) => a.is_default) || addresses[0];

  const totalOrders = orders.length;
  // Đơn thành công (Completed)
  const completedOrders = orders.filter((o) => o.status === "Completed");
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled");
  
  // Tổng tiền đã chi tiêu tính trên các đơn Completed
  const totalSpent = completedOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case "Completed":
        return "Hoàn thành";
      case "Pending":
        return "Chờ xử lý";
      case "Processing":
        return "Đang xử lý";
      case "Cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className="w-full min-h-screen p-4 space-y-6">
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="flex items-center gap-3 mb-1 text-xl font-bold text-gray-800 sm:text-2xl">
            <button 
              onClick={() => navigate(-1)} 
              className="p-1 hover:bg-gray-100 rounded-full mr-1 transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-500" />
            </button>
            Hồ Sơ Khách Hàng: {customer.username}
          </h1>
          <p className="pl-11 text-sm text-gray-500 sm:text-base">
            Xem thông tin tài khoản và phân tích lịch sử mua hàng
          </p>
        </div>

        <Breadcrumb
          items={[
            {
              label: "Trang chủ",
              icon: <Home className="w-4 h-4" />,
              href: "/admin/dashboard",
            },
            {
              label: "Khách hàng",
              icon: <User className="w-4 h-4" />,
              href: "/admin/customers",
            },

            { 
              label: "Chi tiết khách hàng",
              icon: <User className="w-4 h-4" />,
            },
          ]}
        />
      </div>

      {/* Thẻ thống kê (Stats Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center p-5 transition-shadow bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md">
          <div className="p-3 mr-4 text-blue-600 bg-blue-100 rounded-full">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tổng chi tiêu</p>
            <p className="text-xl font-bold text-gray-800">
              {totalSpent.toLocaleString()}đ
            </p>
          </div>
        </div>
        <div className="flex items-center p-5 transition-shadow bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md">
          <div className="p-3 mr-4 text-purple-600 bg-purple-100 rounded-full">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tổng số đơn</p>
            <p className="text-xl font-bold text-gray-800">{totalOrders} đơn</p>
          </div>
        </div>
        <div className="flex items-center p-5 transition-shadow bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md">
          <div className="p-3 mr-4 text-green-600 bg-green-100 rounded-full">
            <PackageCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Đơn thành công</p>
            <p className="text-xl font-bold text-gray-800">
              {completedOrders.length} đơn
            </p>
          </div>
        </div>
        <div className="flex items-center p-5 transition-shadow bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md">
          <div className="p-3 mr-4 text-red-600 bg-red-100 rounded-full">
            <PackageX size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Đơn đã hủy</p>
            <p className="text-xl font-bold text-gray-800">
              {cancelledOrders.length} đơn
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cột trái: Thông tin các nhân */}
        <div className="space-y-6 lg:col-span-1">
          {/* Box thông tin cơ bản */}
          <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-gray-800 border-b pb-2">
              Thông tin tài khoản
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <User className="text-gray-500" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tên đăng nhập</p>
                  <p className="font-semibold text-gray-800">
                    {customer.username}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-500" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Calendar className="text-gray-500" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ngày tham gia</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(customer.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
              <div className="pt-3 uppercase">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    customer.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {customer.status === "Active"
                    ? "Đang hoạt động"
                    : "Đã khóa"}
                </span>
              </div>
            </div>
          </div>

          {/* Box địa chỉ mặc định */}
          <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-gray-800 border-b pb-2">
              Địa chỉ giao hàng mặc định
            </h2>
            {defaultAddress ? (
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-800 text-base">
                      {defaultAddress.receiver_name}
                    </p>
                    <p className="text-sm font-medium text-gray-600 mt-1">
                      {defaultAddress.receiver_phone}
                    </p>
                  </div>
                  {defaultAddress.is_default && (
                    <span className="px-2 py-1 text-[10px] font-bold text-blue-700 bg-blue-100 rounded uppercase">
                      Mặc định
                    </span>
                  )}
                </div>
                
                <div className="flex items-start gap-2 text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
                  <p className="leading-relaxed">
                    {defaultAddress.address_line}, {defaultAddress.ward},{" "}
                    {defaultAddress.district}, <br/> {defaultAddress.city}
                  </p>
                </div>
                {defaultAddress.note && (
                  <p className="p-2.5 mt-2 text-sm italic bg-yellow-50 text-yellow-800 rounded border border-yellow-100">
                    <span className="font-semibold not-italic">Lưu ý:</span> {defaultAddress.note}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg border border-dashed">
                Chưa có địa chỉ nào được lưu.
              </p>
            )}
            
            {addresses.length > 1 && (
               <div className="mt-4 text-center">
                 <span className="text-sm font-semibold text-blue-600">
                   Và {addresses.length - 1} địa chỉ khác
                 </span>
               </div>
            )}
          </div>
        </div>

        {/* Cột phải: Orders */}
        <div className="lg:col-span-2">
          <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-gray-800 border-b pb-2">
              Lịch sử mua hàng
            </h2>
            {orders.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm text-left text-gray-700 min-w-[650px]">
                  <thead className="text-xs text-gray-600 uppercase bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-4 font-bold">Mã đơn</th>
                      <th className="px-5 py-4 font-bold">Ngày đặt</th>
                      <th className="px-5 py-4 font-bold text-right">Tổng tiền</th>
                      <th className="px-5 py-4 font-bold text-center">Trạng thái</th>
                      <th className="px-5 py-4 font-bold text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-5 py-4 font-bold text-gray-800">
                          {order.order_code}
                        </td>
                        <td className="px-5 py-4 text-gray-500">
                          {new Date(order.created_at).toLocaleString("vi-VN", {
                             hour: '2-digit', minute: '2-digit',
                             day: '2-digit', month: '2-digit', year: 'numeric'
                          })}
                        </td>
                        <td className="px-5 py-4 font-bold text-right text-gray-800">
                          {Number(order.total_amount).toLocaleString()}đ
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span
                            className={`px-3 py-1.5 text-xs font-bold rounded-full ${getOrderStatusBadge(
                              order.status
                            )}`}
                          >
                            {getOrderStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <button 
                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline px-3 py-1 bg-blue-50 rounded-md transition-colors"
                         >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500 border border-dashed rounded-xl bg-gray-50">
                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                  <ShoppingBag size={40} className="text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-600">Khách hàng chưa có đơn hàng nào</p>
                <p className="text-sm text-gray-400 mt-1">Lịch sử giao dịch sẽ hiển thị ở đây</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}