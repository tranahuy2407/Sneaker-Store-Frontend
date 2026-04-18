import { Eye, Trash2, Home, Layout, Mail, Clock, CheckCheck, MessageSquare, Plus } from "lucide-react";
import contactAPI from "../../../api/contact.api";
import Breadcrumb from "../../../components/Breadcrumb";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const STATUS_CONFIG = {
  new: { label: "Mới", color: "bg-blue-100 text-blue-700" },
  read: { label: "Đã đọc", color: "bg-yellow-100 text-yellow-700" },
  replied: { label: "Đã trả lời", color: "bg-green-100 text-green-700" },
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const navigate = useNavigate();

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await contactAPI.getAll();
      setContacts(res.data.data || []);
    } catch {
      toast.error("Không thể tải danh sách liên hệ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleView = async (contact) => {
    setSelected(contact);
    if (contact.status === "new") {
      try {
        await contactAPI.updateStatus(contact.id, "read");
        setContacts((prev) =>
          prev.map((c) => (c.id === contact.id ? { ...c, status: "read" } : c))
        );
      } catch { /* silently ignore */ }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await contactAPI.updateStatus(id, status);
      toast.success("Đã cập nhật trạng thái");
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
      if (selected?.id === id) setSelected((prev) => ({ ...prev, status }));
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return toast.warn("Vui lòng nhập nội dung phản hồi");
    try {
      setReplyLoading(true);
      await contactAPI.reply(selected.id, replyText);
      toast.success("Đã gửi phản hồi và mail cho khách hàng");
      setContacts((prev) =>
        prev.map((c) => (c.id === selected.id ? { ...c, status: "replied" } : c))
      );
      setSelected((prev) => ({ ...prev, status: "replied" }));
      setShowReplyModal(false);
      setReplyText("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gửi phản hồi thất bại");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa liên hệ này?")) return;
    try {
      await contactAPI.delete(id);
      toast.success("Đã xóa liên hệ");
      if (selected?.id === id) setSelected(null);
      fetchContacts();
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Liên Hệ</h1>
          <p className="text-gray-500">Xem và xử lý các tin nhắn liên hệ từ khách hàng</p>
        </div>
        <button
          onClick={() => navigate("/admin/contacts/add")}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Thêm liên hệ
        </button>
      </div>

      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/admin/dashboard", icon: <Home className="w-4 h-4" /> },
          { label: "Website", icon: <Layout className="w-4 h-4" /> },
          { label: "Liên hệ" },
        ]}
      />

      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        {/* Danh sách liên hệ */}
        <div className="flex-1 overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                <th className="px-4 py-4">Họ tên</th>
                <th className="px-4 py-4">Tiêu đề</th>
                <th className="px-4 py-4 text-center">Trạng thái</th>
                <th className="px-4 py-4">Ngày gửi</th>
                <th className="px-4 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Đang tải...</td></tr>
              ) : contacts.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Chưa có liên hệ nào</td></tr>
              ) : (
                contacts.map((item) => {
                  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleView(item)}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${selected?.id === item.id ? "bg-blue-50" : ""} ${item.status === "new" ? "font-semibold" : ""}`}
                    >
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-800 flex items-center gap-2">
                          {item.status === "new" && <span className="w-2 h-2 bg-blue-500 rounded-full inline-block flex-shrink-0" />}
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-400">{item.email}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 max-w-[160px] truncate">{item.subject || "—"}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleView(item)}
                            className="p-2 text-blue-600 rounded-full hover:bg-blue-50"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 rounded-full hover:bg-red-50"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Chi tiết liên hệ */}
        {selected && (
          <div className="w-full lg:w-96 flex-shrink-0 bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4 self-start lg:sticky lg:top-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-lg">Chi tiết liên hệ</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={14} className="text-gray-400" />
                <span className="font-medium">{selected.name}</span>
                <span className="text-gray-400">—</span>
                <span className="text-blue-600">{selected.email}</span>
              </div>
              {selected.phone && (
                <div className="text-gray-500">📞 {selected.phone}</div>
              )}
              <div className="flex items-center gap-2 text-gray-500">
                <Clock size={13} />
                {new Date(selected.created_at).toLocaleString("vi-VN")}
              </div>
            </div>

            {selected.subject && (
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Tiêu đề</div>
                <div className="text-sm font-medium text-gray-800">{selected.subject}</div>
              </div>
            )}

            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Nội dung</div>
              <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto">
                {selected.message}
              </div>
            </div>

            {/* Cập nhật trạng thái */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Cập nhật trạng thái</div>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(STATUS_CONFIG).map(([key, { label, color }]) => (
                  <button
                    key={key}
                    onClick={() => handleUpdateStatus(selected.id, key)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border-2 transition-all ${
                      selected.status === key
                        ? `${color} border-current`
                        : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {key === "new" && <Clock size={10} className="inline mr-1" />}
                    {key === "read" && <Eye size={10} className="inline mr-1" />}
                    {key === "replied" && <CheckCheck size={10} className="inline mr-1" />}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setShowReplyModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-sm group"
              >
                <MessageSquare size={16} className="group-hover:scale-110 transition-transform" />
                Trả lời khách hàng
              </button>

              <button
                onClick={() => handleDelete(selected.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
                Xóa liên hệ này
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => !replyLoading && setShowReplyModal(false)} 
          />
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Trả lời khách hàng</h3>
                <p className="text-sm text-gray-500">Đến: {selected.email}</p>
              </div>
              <button 
                onClick={() => setShowReplyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 text-sm border border-gray-100">
                <span className="font-bold text-gray-700 block mb-1">Nội dung khách gửi:</span>
                <p className="text-gray-600 italic">"{selected.message}"</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nội dung phản hồi (Sẽ được gửi qua mail):</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Nhập nội dung bạn muốn phản hồi cho khách hàng..."
                  rows={6}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all resize-none text-sm"
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                disabled={replyLoading}
                onClick={() => setShowReplyModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                disabled={replyLoading}
                onClick={handleReply}
                className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {replyLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Đang gửi mail...
                  </>
                ) : (
                  <>
                    <Mail size={16} />
                    Gửi phản hồi ngay
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
