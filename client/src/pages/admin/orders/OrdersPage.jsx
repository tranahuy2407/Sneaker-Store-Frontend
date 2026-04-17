import React, { useEffect, useState } from "react";
import {
  Package,
  Eye,
  RefreshCcw,
  Filter,
  Home,
  ShoppingCart,
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import orderAPI from "../../../api/order.api";
import Pagination from "../../../components/Pagination";
import Breadcrumb from "../../../components/Breadcrumb";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await orderAPI.getAll({
        page,
        limit,
        status,
      });

      setOrders(res.data?.data || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Lỗi load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit, status]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, limit });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setTimeout(() => setRefreshing(false), 500);
  };

  const statusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatPrice = (v) =>
    v?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  return (
    <div className="w-full min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Đơn Hàng</h1>
          <p className="text-sm text-gray-500">
            Theo dõi và xử lý đơn hàng khách hàng
          </p>
        </div>

        <Breadcrumb
          items={[
            {
              label: "Trang chủ",
              href: "/admin/dashboard",
              icon: <Home className="w-4 h-4" />,
            },
            { label: "Đơn hàng", icon: <ShoppingCart className="w-4 h-4" /> },
          ]}
        />
      </div>

      {/* Box */}
      <div className="p-5 bg-white rounded-lg shadow">
        {/* Actions */}
        <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:justify-between">
          <div className="flex gap-3">
            <select
              className="px-3 py-2 text-sm border rounded-md"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Pending">Chờ xử lý</option>
              <option value="Processing">Đang xử lý</option>
              <option value="Completed">Hoàn thành</option>
              <option value="Cancelled">Đã huỷ</option>
            </select>

            <button
              onClick={() => setStatus("")}
              className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-100"
            >
              <Filter size={16} />
              Xóa lọc
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-gray-100 w-full sm:w-auto"
          >
            <RefreshCcw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Làm mới
          </button>
        </div>

         {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
          <thead className="text-xs text-gray-600 uppercase bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-center">Mã đơn</th>
               <th className="px-4 py-3 text-center">Khách hàng</th>
              <th className="px-4 py-3 text-center">Tổng tiền</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="transition border-b hover:bg-gray-50">
                {/* Mã đơn */}
                <td className="px-4 py-3 font-medium text-center">
                  {o.order_code}
                </td>

                {/* Khách hàng */}
                <td className="px-4 py-3 text-center">
                <div className="font-medium">{o.receiver_name}</div>
                <div className="text-xs text-gray-500">
                  {o.receiver_phone}
                </div>
              </td>
                {/* Tổng tiền */}
                <td className="px-4 py-3 font-semibold text-center text-red-600">
                  {formatPrice(o.total_amount)}
                </td>

                {/* Trạng thái */}
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full ${statusColor(
                      o.status
                    )}`}
                  >
                    {o.status}
                  </span>
                </td>

                {/* Action */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => navigate(`/admin/orders/${o.id}`)}
                    className="inline-flex items-center justify-center p-2 text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-200"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
