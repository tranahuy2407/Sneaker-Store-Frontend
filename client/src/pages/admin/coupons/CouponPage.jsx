import React, { useEffect, useState } from "react";
import {
  Ticket,
  Plus,
  Search,
  Filter,
  RefreshCcw,
  Eye,
  Edit3,
  Trash2,
  Home,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import couponAPI from "../../../api/coupon.api";
import Breadcrumb from "../../../components/Breadcrumb";
import WarningModal from "../../../components/WarningModal";
import Pagination from "../../../components/Pagination";

export default function CouponPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await couponAPI.getAll({
        search: search || undefined,
        status: status || undefined,
        page,
        limit: 10,
      });

      setCoupons(res.data?.data || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi tải coupon:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [search, status, page]);

  const handlePageChange = (newPage) => {
    const params = {};
    if (search) params.search = search;
    if (status) params.status = status;
    params.page = newPage;
    setSearchParams(params);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCoupons();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleDelete = async () => {
    if (!couponToDelete) return;
    try {
      await couponAPI.delete(couponToDelete.id);
      setCoupons((prev) => prev.filter((c) => c.id !== couponToDelete.id));
      setWarningOpen(false);
    } catch (error) {
      console.error("Lỗi khi xóa coupon:", error);
    }
  };

  return (
    <div className="w-full min-h-screen p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="mb-1 text-xl font-bold text-gray-800 sm:text-2xl">
            Quản Lý Mã Giảm Giá
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            Quản lý các coupon trong hệ thống
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
              label: "Coupon",
              icon: <Ticket className="w-4 h-4" />,
            },
          ]}
        />
      </div>

      {/* List */}
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
        <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <div className="flex items-center justify-center w-6 h-6 bg-yellow-100 rounded">
              <Ticket className="w-4 h-4 text-yellow-600" />
            </div>
            Danh Sách Coupon
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/coupons/add")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
            >
              <Plus className="w-4 h-4" />
              Thêm mới
            </button>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-md ${
                refreshing
                  ? "bg-yellow-100 text-yellow-600 border-yellow-300"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <RefreshCcw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Làm mới
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="p-4 mb-6 border rounded-lg bg-gray-50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center w-full border rounded-md sm:w-64">
                <input
                  type="text"
                  placeholder="Tìm mã coupon..."
                  className="flex-1 px-3 py-2 text-sm outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="px-3 text-gray-400">
                  <Search className="w-4 h-4" />
                </div>
              </div>

              <select
                className="px-3 py-2 text-sm border rounded-md sm:w-48"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Ngừng</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearch("");
                setStatus("");
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-100"
            >
              <Filter className="w-4 h-4" />
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3">Mã</th>
                <th className="px-4 py-3 text-center">Loại</th>
                <th className="px-4 py-3 text-center">Giá trị</th>
                <th className="px-4 py-3 text-center">Đã dùng</th>
                <th className="px-4 py-3 text-center">Hiệu lực</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center">
                    <RefreshCcw className="inline w-4 h-4 mr-2 animate-spin" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : coupons.length > 0 ? (
                coupons.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-purple-700">{c.code}</td>
                    <td className="px-4 py-3 text-center">
                      {c.type === "PERCENT" ? "Phần trăm" : "Tiền mặt"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.type === "PERCENT"
                        ? `${c.value}%`
                        : c.value.toLocaleString() + "₫"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.used_count}/{c.usage_limit}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {new Date(c.start_date).toLocaleDateString("vi-VN")} -{" "}
                      {new Date(c.end_date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          c.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {c.is_active ? "Hoạt động" : "Ngừng"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/coupons/${c.id}/detail`)}
                          className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/coupons/${c.id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setCouponToDelete(c);
                            setWarningOpen(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-500">
                    Không có coupon nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <WarningModal
        open={warningOpen}
        title="Xác nhận xóa"
        message={`Bạn có chắc muốn xóa coupon "${couponToDelete?.code}"?`}
        onConfirm={handleDelete}
        onCancel={() => setWarningOpen(false)}
      />
    </div>
  );
}
