import React, { useEffect, useState } from "react";
import {
  Gift,
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
import promotionAPI from "../../../api/promotion.api";
import Breadcrumb from "../../../components/Breadcrumb";
import WarningModal from "../../../components/WarningModal";
import Pagination from "../../../components/Pagination";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res = await promotionAPI.getAll({
        search: search || undefined,
        isActive: isActive !== "" ? isActive : undefined,
        page,
        limit: 15,
      });

      setPromotions(res.data?.data || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi tải chương trình giảm giá:", error);
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
      fetchPromotions();
    }, [search, isActive, page]);

  const handlePageChange = (newPage) => {
  const params = {};
  if (search) params.search = search;
  if (isActive !== "") params.isActive = isActive;
  params.page = newPage;
  setSearchParams(params);
};

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPromotions();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleDelete = async () => {
    if (!promotionToDelete) return;
    try {
      await promotionAPI.delete(promotionToDelete.id);
      setPromotions((prev) =>
        prev.filter((p) => p.id !== promotionToDelete.id)
      );
      setWarningOpen(false);
    } catch (error) {
      console.error("Lỗi khi xóa chương trình giảm giá:", error);
    }
  };

  return (
    <div className="w-full min-h-screen p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="mb-1 text-xl font-bold text-gray-800 sm:text-2xl">
            Quản Lý Chương Trình Giảm Giá
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            Quản lý các chương trình giảm giá trong hệ thống
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
              label: "Giảm giá",
              icon: <Gift className="w-4 h-4" />,
            },
          ]}
        />
      </div>

      {/* Danh sách */}
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
        <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <div className="flex items-center justify-center w-6 h-6 bg-purple-100 rounded">
              <Gift className="w-4 h-4 text-purple-600" />
            </div>
            Danh Sách Chương Trình
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/promotions/add")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              Thêm mới
            </button>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-md ${
                refreshing
                  ? "bg-purple-100 text-purple-600 border-purple-300"
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
                  placeholder="Tìm kiếm chương trình..."
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
                value={isActive}
                onChange={(e) => setIsActive(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Đang áp dụng</option>
                <option value="false">Ngừng áp dụng</option>
              </select>
            </div>

            <button
              onClick={() => {
              setSearch("");
              setIsActive("");
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
                <th className="px-4 py-3">Tên chương trình</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-center">Ngày bắt đầu</th>
                <th className="px-4 py-3 text-center">Ngày kết thúc</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center">
                    <RefreshCcw className="inline w-4 h-4 animate-spin mr-2" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : promotions.length > 0 ? (
                promotions.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          p.is_active === true
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.is_active === true ? "Đang áp dụng" : "Ngừng"}
                      </span>
                      </td>

                    <td className="px-4 py-3 text-center">
                      {new Date(p.start_date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {new Date(p.end_date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/admin/promotions/${p.id}/detail`)
                          }
                          className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/promotions/${p.id}/edit`)
                          }
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setPromotionToDelete(p);
                            setWarningOpen(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full"
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
                    Không có chương trình giảm giá nào.
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
        message={`Bạn có chắc muốn xóa chương trình "${promotionToDelete?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setWarningOpen(false)}
      />
    </div>
  );
}
