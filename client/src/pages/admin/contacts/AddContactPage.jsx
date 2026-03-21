import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, User, Mail, Phone, MessageSquare, Home, Layout, Info } from "lucide-react";
import contactAPI from "../../../api/contact.api";
import Breadcrumb from "../../../components/Breadcrumb";
import CKEditorToolbar from "../../../components/CKEditorToolbar";
import { toast } from "react-toastify";

export default function AddContactPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    status: "new",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    try {
      setLoading(true);
      // Backend typically expects a simple object for contacts (no multipart/form-data needed usually)
      await contactAPI.create(formData);
      toast.success("Thêm liên hệ thành công");
      navigate("/admin/contacts");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Thêm liên hệ mới</h1>
          <p className="text-gray-500">Ghi nhận thủ công các yêu cầu hoặc liên hệ từ khách hàng</p>
        </div>
        <button
          onClick={() => navigate("/admin/contacts")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>
      </div>

      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/admin/dashboard", icon: <Home className="w-4 h-4" /> },
          { label: "Website", icon: <Layout className="w-4 h-4" /> },
          { label: "Liên hệ", href: "/admin/contacts" },
          { label: "Thêm mới" },
        ]}
      />

      <div className="mt-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Thông tin khách hàng */}
            <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                <User size={20} className="text-blue-500" />
                Thông tin khách hàng
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Họ tên *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="09xx xxx xxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Chi tiết liên hệ */}
            <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                <Info size={20} className="text-pink-500" />
                Chi tiết yêu cầu
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Tiêu đề</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Hỏi về sản phẩm, giao hàng..."
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Trạng thái xử lý</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="new">Mới nhận</option>
                    <option value="read">Đã xem</option>
                    <option value="replied">Đã phản hồi</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Nội dung tin nhắn */}
          <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                <MessageSquare size={20} className="text-orange-500" />
                Nội dung tin nhắn *
            </h2>
            <div className="min-h-[300px]">
                <CKEditorToolbar
                    editorData={formData.message}
                    setEditorData={(data) => setFormData({ ...formData, message: data })}
                />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-10 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg transition-all font-bold disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? "Đang xử lý..." : "Lưu liên hệ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
