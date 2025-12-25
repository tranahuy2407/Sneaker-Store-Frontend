import React, { useEffect, useState } from "react";
import warehouseHistoryAPI from "../../../api/warehouseHistory.api";
import Breadcrumb from "@/components/Breadcrumb";
import CustomTooltip from "@/components/CustomTooltip";

export default function WarehouseHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await warehouseHistoryAPI.getAll();
        setHistory(res.data.data);
        console.log(history)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-3">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-10 bg-gray-200 animate-pulse rounded-lg"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 mb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Lịch Sử Điều Chỉnh Kho</h1>
          <p className="text-gray-500">Theo dõi các thay đổi tồn kho</p>
        </div>
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/admin" },
            { label: "Quản lý kho" },
            { label: "Lịch sử điều chỉnh" },
          ]}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white border shadow rounded-xl">
        <table className="min-w-full table-auto border-collapse">
          <thead className="sticky top-0 bg-gray-100">
            <tr className="font-semibold text-gray-600 text-sm">
              <th className="p-3 text-center w-[60px]">ID</th>
              <th className="p-3 text-center w-[120px]">
                <CustomTooltip text="ID sản phẩm">Sản phẩm (ID)</CustomTooltip>
              </th>
              <th className="p-3 text-center w-[120px]">
                <CustomTooltip text="ID sản phẩm">Size</CustomTooltip>
              </th>
              <th className="p-3 text-center w-[140px]">
                <CustomTooltip text="Người thực hiện điều chỉnh">Người điều chỉnh</CustomTooltip>
              </th>
              <th className="p-3 text-center w-[80px]">Tồn cũ</th>
              <th className="p-3 text-center w-[80px]">Tồn mới</th>
              <th className="p-3 text-center w-[100px]">
                <CustomTooltip text="Thay đổi số lượng kho">Thay đổi</CustomTooltip>
              </th>
              <th className="p-3 text-center w-[160px]">Thời gian</th>
            </tr>
          </thead>

          <tbody>
            {history.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  Không có dữ liệu lịch sử
                </td>
              </tr>
            )}

            {history.map((h) => (
              <tr
                key={h.id}
                className="transition border-t hover:bg-gray-50 text-sm text-gray-700"
              >
                <td className="p-2 text-center">{h.id}</td>
                <td className="p-2 text-center">
                  {h.size?.product?.name || "Unknown"} ({h.size?.product?.id || "-"})
                </td>
                <td className="p-2 text-center">
                  Size {h.size?.size}
                </td>

                <td className="p-2 text-center">{h.admin?.username || "Unknown"}</td>
                <td className="p-2 text-center">{h.old_quantity}</td>
                <td className="p-2 text-center">{h.new_quantity}</td>
                <td
                  className={`p-2 text-center font-semibold ${
                    h.change_quantity < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {h.change_quantity < 0 ? "−" : "+"}
                  {Math.abs(h.change_quantity)}
                </td>
                <td className="p-2 text-center">
                  {new Date(h.created_at).toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
