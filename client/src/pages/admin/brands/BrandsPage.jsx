import React, { useEffect, useState } from "react";
import {
  Tag,
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
import brandAPI from "../../../api/brand.api";
import Breadcrumb from "../../../components/Breadcrumb";
import WarningModal from "../../../components/WarningModal";
import Pagination from "../../../components/Pagination";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  // 🔹 Load danh sách thương hiệu
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await brandAPI.getAll({
        search: search || undefined,
        status: status || undefined,
        page,
        limit: 15,
      });
      setBrands(res.data?.data || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi tải thương hiệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
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
    await fetchBrands();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleDelete = async () => {
    if (!brandToDelete) return;
    try {
      await brandAPI.delete(brandToDelete.id);
      setBrands((prev) => prev.filter((b) => b.id !== brandToDelete.id));
      setWarningOpen(false);
    } catch (error) {
      console.error("Lỗi khi xóa thương hiệu:", error);
    }
  };

  return (
    <div className="w-full min-h-screen p-3 transition-all duration-300 ease-in-out sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="mb-1 text-xl font-bold text-gray-800 sm:text-2xl">
            Quản Lý Thương Hiệu
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            Quản lý tất cả thương hiệu hiển thị trong hệ thống
          </p>
        </div>

        <Breadcrumb
          items={[
            { label: "Trang chủ", icon: <Home className="w-4 h-4" />, href: "/admin/dashboard" },
            { label: "Thương hiệu", icon: <Tag className="w-4 h-4" /> },
          ]}
        />
      </div>

      {/* Danh sách thương hiệu */}
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow hover:scale-[1.01] transition-all duration-300 ease-in-out">
        <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-start">
          <div>
            <h2 className="flex items-center gap-2 mb-1 text-xl font-semibold text-gray-800">
              <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded">
                <Tag className="w-4 h-4 text-blue-600" />
              </div>
              Danh Sách Thương Hiệu
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/brands/add")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Thêm thương hiệu
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md transition-all duration-300 ease-in-out hover:scale-105 ${
                refreshing
                  ? "bg-blue-100 text-blue-600 border-blue-300"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <RefreshCcw
                size={16}
                className={refreshing ? "animate-spin text-blue-500" : ""}
              />
              {refreshing ? "Đang làm mới..." : "Làm mới"}
            </button>
          </div>
        </div>

        {/* Bộ lọc */}
        <div className="p-4 mb-6 rounded-lg border border-gray-200 bg-gray-50 hover:scale-[1.01] transition-transform duration-300">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center w-full overflow-hidden border rounded-md sm:w-64">
                <input
                  type="text"
                  placeholder="Tìm kiếm thương hiệu..."
                  className="flex-1 px-3 py-2 text-sm outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="px-3 text-gray-400">
                  <Search className="w-4 h-4" />
                </div>
              </div>

              <select
                className="px-3 py-2 text-sm border border-gray-300 rounded-md sm:w-48"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Ẩn</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearch("");
                setStatus("");
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 transition-all duration-200 border border-gray-300 rounded-md hover:bg-gray-100 hover:scale-105"
            >
              <Filter className="w-4 h-4" />
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Bảng thương hiệu */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 min-w-[800px]">
            <thead className="text-xs text-gray-600 uppercase bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3">Tên thương hiệu</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-center">Ngày tạo</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-500">
                    <RefreshCcw className="inline w-4 h-4 mr-2 text-blue-500 animate-spin" />
                    Đang tải thương hiệu...
                  </td>
                </tr>
              ) : brands.length > 0 ? (
                brands.map((brand) => (
                  <tr key={brand.id} className="transition border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{brand.name}</td>
                    <td className="px-4 py-3">{brand.slug}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          brand.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {brand.status === "Active" ? "Hoạt động" : "Ẩn"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {new Date(brand.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          title="Xem chi tiết"
                          onClick={() => navigate(`/admin/brands/${brand.id}`)}
                          className="p-2 text-indigo-600 transition-all duration-300 ease-in-out rounded-full hover:bg-indigo-100 hover:scale-110"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          title="Chỉnh sửa"
                          onClick={() => navigate(`/admin/brands/${brand.id}/edit`)}
                          className="p-2 text-blue-600 transition-all duration-300 ease-in-out rounded-full hover:bg-blue-100 hover:scale-110"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          title="Xóa"
                          onClick={() => {
                            setBrandToDelete(brand);
                            setWarningOpen(true);
                          }}
                          className="p-2 text-red-600 transition-all duration-300 ease-in-out rounded-full hover:bg-red-100 hover:scale-110"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-500">
                    Không có thương hiệu nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phân trang */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Modal xác nhận xóa */}
      <WarningModal
        open={warningOpen}
        title="Xác nhận xóa"
        message={`Bạn có chắc muốn xóa thương hiệu "${brandToDelete?.name}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleDelete}
        onCancel={() => setWarningOpen(false)}
      />
    </div>
  );
}
