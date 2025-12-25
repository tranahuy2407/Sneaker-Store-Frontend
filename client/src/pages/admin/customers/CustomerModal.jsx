import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CustomerModal({ open, onClose, onSubmit, initialData = null }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Active");
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    if (initialData) {
      setUsername(initialData.username || "");
      setEmail(initialData.email || "");
      setStatus(initialData.status || "Active");
      setCreatedAt(initialData.created_at || "");
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit({
      id: initialData?.id,
      username,
      email,
      status,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {initialData ? "Chi tiết khách hàng" : "Thông tin khách hàng"}
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* USERNAME */}
        <div className="mb-3">
          <label className="font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded"
          />
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="font-medium">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded"
          />
        </div>

        {/* CREATED DATE */}
        <div className="mb-3">
          <label className="font-medium">Ngày tạo</label>
          <input
            type="text"
            value={createdAt?.slice(0, 10)}
            disabled
            className="w-full px-3 py-2 mt-1 bg-gray-100 border rounded"
          />
        </div>

        {/* STATUS TOGGLE */}
        <div className="flex items-center gap-3 my-4">
          <span className="font-medium">Trạng thái</span>

          <button
            type="button"
            onClick={() => setStatus(status === "Active" ? "Inactive" : "Active")}
            className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors ${
              status === "Active" ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            <span
              className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform ${
                status === "Active" ? "translate-x-7" : ""
              }`}
            />
          </button>

          <span className="text-sm">{status === "Active" ? "Đang hoạt động" : "Đã khóa"}</span>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Đóng
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
