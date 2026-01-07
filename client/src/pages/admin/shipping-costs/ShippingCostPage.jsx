import React, { useEffect, useState } from "react";
import {
  Home,
  Truck,
  Plus,
  RefreshCcw,
  Edit3,
  Trash2,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import shippingCostAPI from "@/api/shippingCost.api";
import CustomTooltip from "@/components/CustomTooltip";
import { formatDate } from "@/helpers/formatDate";
import ShippingCostModal from "./ShippingCostModal";
import WarningModal from "@/components/WarningModal";

export default function ShippingCostPage() {
  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* ===== PAGINATION (BACKEND) ===== */
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  /* ===== FETCH DATA ===== */
  const fetchShippingCosts = async (pageParam = page) => {
    setLoading(true);
    try {
      const res = await shippingCostAPI.getAll({
        page: pageParam,
        limit: pagination.limit,
      });

      const rawData = res.data.data || [];

      const mappedData = rawData.map((item) => ({
        ...item,
        createdAt: item.createdAt || item.created_at || null,
        updatedAt: item.updatedAt || item.updated_at || null,
      }));

      setCosts(mappedData);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippingCosts(page);
  }, [page]);

  /* ===== CREATE / UPDATE ===== */
  const handleSubmitModal = async (data) => {
    try {
      if (editing) {
        await shippingCostAPI.update(editing.id, data);
      } else {
        await shippingCostAPI.create(data);
      }

      setShowModal(false);
      setEditing(null);
      fetchShippingCosts(page);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  /* ===== DELETE ===== */
  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await shippingCostAPI.delete(confirmDelete.id);
      fetchShippingCosts(page);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
    setConfirmDelete(null);
  };

  /* ===== REFRESH ===== */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchShippingCosts(page);
    setTimeout(() => setRefreshing(false), 400);
  };

  return (
    <div className="w-full min-h-screen p-4 space-y-4">
      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="mb-1 text-xl font-bold text-gray-800 sm:text-2xl">
            Quản Lý Phí Vận Chuyển
          </h1>
          <p className="text-sm text-gray-500">
            Thiết lập phí giao hàng theo khu vực
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
              label: "Phí vận chuyển",
              icon: <Truck className="w-4 h-4" />,
            },
          ]}
        />
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Plus size={16} />
          Thêm khu vực
        </button>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md"
        >
          <RefreshCcw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Làm mới
        </button>
      </div>

      {/* TABLE */}
      <div className="p-4 overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <p className="py-6 text-center text-gray-500">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Khu vực</th>
                <th className="px-4 py-3 text-center">Phí ship</th>
                <th className="px-4 py-3 text-center">Ngày tạo</th>
                <th className="px-4 py-3 text-center">Cập nhật</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {costs.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3 text-center text-blue-600">
                    {item.cost.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="px-4 py-3 text-center">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {formatDate(item.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <CustomTooltip text="Chỉnh sửa">
                        <button
                          onClick={() => {
                            setEditing(item);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600"
                        >
                          <Edit3 size={18} />
                        </button>
                      </CustomTooltip>

                      <CustomTooltip text="Xóa">
                        <button
                          onClick={() => setConfirmDelete(item)}
                          className="p-2 text-red-600"
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

        {/* PAGINATION */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-gray-500">
            Hiển thị {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(
              pagination.page * pagination.limit,
              pagination.total
            )}{" "}
            / {pagination.total}
          </span>

          <div className="flex gap-2">
            <button
              disabled={pagination.page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded-md"
            >
              Trước
            </button>

            <span className="px-3 py-1 border rounded-md bg-gray-50">
              {pagination.page} / {pagination.totalPages}
            </span>

            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded-md"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <ShippingCostModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitModal}
        initialData={editing}
      />

      <WarningModal
        open={!!confirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc muốn xóa khu vực "${confirmDelete?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
