import React, { useEffect, useState } from "react";
import { Home, Star, Trash2, RefreshCcw, MessageSquare } from "lucide-react";

import Breadcrumb from "@/components/Breadcrumb";
import reviewAPI from "@/api/review.api";
import CustomTooltip from "@/components/CustomTooltip";
import WarningModal from "@/components/WarningModal";
import Pagination from "@/components/Pagination";

export default function AdminReviewProductPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Pagination & Filter
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingFilter, setRatingFilter] = useState(""); // "" means all

  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (ratingFilter) params.rating = ratingFilter;

      const res = await reviewAPI.getAllReviews(params);
      const data = res.data?.data?.data || res.data?.data || [];
      const pagination = res.data?.data?.pagination || {};

      setReviews(Array.isArray(data) ? data : []);
      if (pagination.total) {
        setTotalPages(Math.ceil(pagination.total / pagination.limit));
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, ratingFilter]);

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      await reviewAPI.deleteReview(confirmDelete.id);
      setReviews((prev) => prev.filter((r) => r.id !== confirmDelete.id));
    } catch (err) {
      alert(err.response?.data?.message || "Không thể xóa đánh giá");
    }
    setConfirmDelete(null);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReviews();
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <div className="w-full min-h-screen p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="mb-1 text-xl font-bold text-gray-800 sm:text-2xl">
            Quản Lý Đánh Giá
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            Xem và quản lý phản hồi, nhận xét của khách hàng về sản phẩm
          </p>
        </div>

        <Breadcrumb
          items={[
            {
              label: "Trang chủ",
              icon: <Home className="w-4 h-4" />,
              href: "/admin/dashboard",
            },
            { label: "Đánh giá", icon: <MessageSquare className="w-4 h-4" /> },
          ]}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col justify-between gap-4 p-4 bg-white rounded-lg shadow-sm sm:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-gray-500">Lọc theo sao</label>
            <select
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value);
                setPage(1); // Reset page on filter change
              }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black min-w-[150px]"
            >
              <option value="">Tất cả các sao</option>
              <option value="5">5 Sao</option>
              <option value="4">4 Sao</option>
              <option value="3">3 Sao</option>
              <option value="2">2 Sao</option>
              <option value="1">1 Sao</option>
            </select>
          </div>
        </div>

        <div className="flex items-end gap-2 mt-4 sm:mt-0">
          <CustomTooltip text="Làm mới dữ liệu">
            <button
              onClick={handleRefresh}
              className={`flex items-center justify-center p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition w-full sm:w-auto ${
                refreshing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <RefreshCcw
                size={18}
                className={`text-gray-600 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </CustomTooltip>
        </div>
      </div>

      {/* Error & Loading Messages */}
      {error && <div className="p-4 text-red-500 bg-red-100 rounded-lg">{error}</div>}

      {/* Table */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          {loading && reviews.length === 0 ? (
            <div className="py-20 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : reviews.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              Không tìm thấy đánh giá nào.
            </div>
          ) : (
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Sản phẩm</th>
                  <th className="px-6 py-4 font-semibold">Khách hàng</th>
                  <th className="px-6 py-4 font-semibold">Đánh giá</th>
                  <th className="px-6 py-4 font-semibold max-w-[300px]">Nội dung</th>
                  <th className="px-6 py-4 font-semibold">Ngày tạo</th>
                  <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((r) => (
                  <tr
                    key={r.id}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">#{r.id}</td>
                    
                    <td className="px-6 py-4">
                      {/* Tùy thuộc vào backend có trả về product object hay chỉ product_id */}
                      <span className="font-semibold text-blue-600 line-clamp-1">
                        {r.product?.name || `Product #${r.product_id}`}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 font-bold text-gray-600 uppercase bg-gray-200 rounded-full">
                          {r.user?.username ? r.user.username.charAt(0) : "U"}
                        </div>
                        <span className="font-medium text-gray-900">
                          {r.user?.username || "Ẩn danh"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-yellow-400">
                        {r.rating} <Star size={14} className="fill-current" />
                      </div>
                    </td>

                    <td className="px-6 py-4 max-w-[300px]">
                      <p className="text-gray-600 truncate" title={r.content}>
                        {r.content}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(r.created_at).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <CustomTooltip text="Xóa đánh giá">
                          <button
                            onClick={() => setConfirmDelete(r)}
                            className="p-2 text-gray-400 transition-colors rounded-lg hover:text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </CustomTooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Modal Xóa */}
      <WarningModal
        open={!!confirmDelete}
        title="Xác nhận xóa đánh giá"
        message={`Bạn có chắc chắn muốn xóa đánh giá của khách hàng "${confirmDelete?.user?.username}" về sản phẩm này không? Hành động này không thể hoàn tác.`}
        confirmText="Xóa luôn"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}