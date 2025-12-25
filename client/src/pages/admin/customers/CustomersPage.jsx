import React, { useEffect, useState } from "react";
import {
  Home,
  User,
  Plus,
  RefreshCcw,
  Trash2,
  Edit3,
} from "lucide-react";

import Breadcrumb from "@/components/Breadcrumb";
import userAPI from "@/api/user.api";
import CustomTooltip from "@/components/CustomTooltip";
import CustomerModal from "./CustomerModal";
import WarningModal from "@/components/WarningModal";

export default function CustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getAllUsers();

      // đồng nhất kiểu dữ liệu
      const data = res.data?.data || res.data || [];

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmitModal = async (data) => {
    try {
      const res = await userAPI.updateUserStatus(data.id, data.status);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === data.id ? { ...u, status: data.status } : u
        )
      );

      setOpenModal(false);
      setEditing(null);
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi cập nhật khách hàng");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      await userAPI.deleteUser(confirmDelete.id);

      setUsers((prev) => prev.filter((u) => u.id !== confirmDelete.id));
    } catch (err) {
      alert(err.response?.data?.message || "Không thể xóa khách hàng");
    }

    setConfirmDelete(null);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <div className="w-full min-h-screen p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="mb-1 text-xl font-bold text-gray-800 sm:text-2xl">
            Quản Lý Khách Hàng
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            Xem, chỉnh sửa và quản lý trạng thái tài khoản người dùng
          </p>
        </div>

        <Breadcrumb
          items={[
            { label: "Trang chủ", icon: <Home className="w-4 h-4" />, href: "/admin/dashboard" },
            { label: "Khách hàng", icon: <User className="w-4 h-4" /> },
          ]}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md transition hover:scale-105 ${
            refreshing
              ? "bg-blue-100 text-blue-600 border-blue-300"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          <RefreshCcw size={16} className={refreshing ? "animate-spin text-blue-500" : ""} />
          {refreshing ? "Đang làm mới..." : "Làm mới"}
        </button>
      </div>

      {/* Table */}
      <div className="p-4 overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <p className="py-6 text-center text-gray-500">
            <RefreshCcw className="inline w-4 h-4 mr-2 text-blue-500 animate-spin" />
            Đang tải dữ liệu...
          </p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : users.length === 0 ? (
          <p className="py-6 text-center text-gray-500">
            Không có khách hàng nào.
          </p>
        ) : (
          <table className="w-full text-sm text-left text-gray-700 min-w-[900px]">
            <thead className="text-xs text-gray-600 uppercase bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tên đăng nhập</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="transition border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{u.id}</td>
                  <td className="px-4 py-3">{u.username}</td>
                  <td className="px-4 py-3">{u.email}</td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        u.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* EDIT */}
                      <CustomTooltip text="Cập nhật khách hàng">
                        <button
                          onClick={() => {
                            setEditing(u);
                            setOpenModal(true);
                          }}
                          className="p-2 text-blue-600 transition rounded-full hover:bg-blue-100 hover:scale-110"
                        >
                          <Edit3 size={18} />
                        </button>
                      </CustomTooltip>

                      {/* DELETE */}
                      <CustomTooltip text="Xóa khách hàng">
                        <button
                          onClick={() => setConfirmDelete(u)}
                          className="p-2 text-red-600 transition rounded-full hover:bg-red-100 hover:scale-110"
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

      {/* MODAL UPDATE */}
      <CustomerModal
        open={openModal}
        initialData={editing}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmitModal}
      />

      {/* MODAL DELETE */}
      <WarningModal
        open={!!confirmDelete}
        title="Xóa khách hàng"
        message={`Bạn có chắc muốn xóa khách hàng "${confirmDelete?.username}" không?`}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
