import React, { useEffect, useState } from "react";
import { Home, FileText, RefreshCcw } from "lucide-react";
import Breadcrumb from "../../../components/Breadcrumb";
import invoiceAPI from "@/api/invoice.api";
import { formatDate } from "@/helpers/formatDate";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await invoiceAPI.getAll();
      setInvoices(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInvoices();
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="w-full min-h-screen p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="mb-1 text-xl font-bold text-gray-800 sm:text-2xl">
            Quản Lý Hóa Đơn
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            Danh sách hóa đơn được phát hành từ hệ thống
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
              label: "Hóa đơn",
              icon: <FileText className="w-4 h-4" />,
            },
          ]}
        />
      </div>

      {/* Action */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md transition hover:scale-105 ${
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

      {/* Table */}
      <div className="p-4 overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <p className="py-6 text-center text-gray-500">
            <RefreshCcw className="inline w-4 h-4 mr-2 animate-spin" />
            Đang tải hóa đơn...
          </p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : invoices.length === 0 ? (
          <p className="py-6 text-center text-gray-500">
            Chưa có hóa đơn nào.
          </p>
        ) : (
          <table className="w-full text-sm text-left text-gray-700 min-w-[900px]">
            <thead className="text-xs text-gray-600 uppercase bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Mã đơn hàng</th>
                <th className="px-4 py-3 text-right">Tổng tiền</th>
                <th className="px-4 py-3 text-center">Ngày phát hành</th>
                <th className="px-4 py-3 text-center">Ngày tạo</th>
                <th className="px-4 py-3 text-center">Cập nhật</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="transition border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">{invoice.id}</td>

                  <td className="px-4 py-3">{invoice.order.order_code}</td>

                  <td className="px-4 py-3 text-right font-semibold text-blue-600">
                    {invoice.total_amount.toLocaleString()} ₫
                  </td>

                  <td className="px-4 py-3 text-center">
                    {formatDate(invoice.issued_at)}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {formatDate(invoice.created_at)}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {formatDate(invoice.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
