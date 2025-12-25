import React, { useEffect, useState } from "react";
import {
  Home,
  CreditCard,
  Plus,
  RefreshCcw,
  Trash2,
  Edit3,
} from "lucide-react";
import Breadcrumb from "../../../components/Breadcrumb";
import paymentAPI from "@/api/payment_method.api";
import CustomTooltip from "@/components/CustomTooltip";
import { formatDate } from "@/helpers/formatDate";
import PaymentMethodModal from "./PaymentMethodModal";
import WarningModal from "@/components/WarningModal";

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const res = await paymentAPI.getAll();
      setMethods(res.data.data || res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitModal = async (data) => {
    try {
      let res;
      if (editing) {
        res = await paymentAPI.update(editing.id, data);
        setMethods(
          methods.map((m) =>
            m.id === editing.id ? (res.data.data || res.data) : m
          )
        );
      } else {
        res = await paymentAPI.create(data);
        const newMethod = res.data.data || res.data;
        setMethods([...methods, newMethod]);
      }

      setShowModal(false);
      setEditing(null);
    } catch (err) {
      console.error("Submit error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          JSON.stringify(err.response?.data, null, 2) ||
          err.message ||
          "Có lỗi xảy ra"
      );
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await paymentAPI.delete(confirmDelete.id);
      setMethods(methods.filter((m) => m.id !== confirmDelete.id));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
    setConfirmDelete(null);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPaymentMethods();
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return (
    <div className="w-full min-h-screen p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="mb-1 text-xl font-bold text-gray-800 sm:text-2xl">
            Quản Lý Thanh Toán
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            Quản lý các phương thức thanh toán hiển thị trong hệ thống
          </p>
        </div>

        <Breadcrumb
          items={[
            { label: "Trang chủ", icon: <Home className="w-4 h-4" />, href: "/admin/dashboard" },
            { label: "Thanh toán", icon: <CreditCard className="w-4 h-4" /> },
          ]}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Thêm phương thức
        </button>

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

      {/* Table container */}
      <div className="p-4 overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <p className="py-6 text-center text-gray-500">
            <RefreshCcw className="inline w-4 h-4 mr-2 text-blue-500 animate-spin" />
            Đang tải phương thức...
          </p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : methods.length === 0 ? (
          <p className="py-6 text-center text-gray-500">
            Chưa có phương thức thanh toán nào.
          </p>
        ) : (
          <table className="w-full text-sm text-left text-gray-700 min-w-[900px]">
            <thead className="text-xs text-gray-600 uppercase bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Mã</th>
                <th className="px-4 py-3">Mô tả</th>
                <th className="px-4 py-3">Logo</th>
                <th className="px-4 py-3 text-center">Hoạt động</th>
                <th className="px-4 py-3 text-center">Ngày tạo</th>
                <th className="px-4 py-3 text-center">Cập nhật</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {methods.map((method) => (
                <tr key={method.id} className="transition border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{method.id}</td>

                  <td className="px-4 py-3 max-w-[150px] truncate" title={method.name}>
                    {method.name}
                  </td>

                  <td className="px-4 py-3 max-w-[120px] truncate" title={method.code}>
                    {method.code || "-"}
                  </td>

                  <td className="px-4 py-3 max-w-[200px] truncate" title={method.description}>
                    {method.description || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {method.logo ? (
                      <img src={method.logo} alt={method.name} className="h-10" />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        method.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {method.is_active ? "Hoạt động" : "Ẩn"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">{formatDate(method.createdAt)}</td>
                  <td className="px-4 py-3 text-center">{formatDate(method.updatedAt)}</td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <CustomTooltip text="Chỉnh sửa">
                        <button
                          onClick={() => {
                            setEditing(method);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 rounded-full hover:bg-blue-100 hover:scale-110"
                        >
                          <Edit3 size={18} />
                        </button>
                      </CustomTooltip>

                      <CustomTooltip text="Xóa">
                        <button
                          onClick={() => setConfirmDelete(method)}
                          className="p-2 text-red-600 rounded-full hover:bg-red-100 hover:scale-110"
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

      <PaymentMethodModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitModal}
        initialData={editing}
      />

      <WarningModal
        open={!!confirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc muốn xóa phương thức "${confirmDelete?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
