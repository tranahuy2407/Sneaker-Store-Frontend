import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Home, Layout, Newspaper, CheckCircle, XCircle } from "lucide-react";
import newsAPI from "../../../api/news.api";
import Breadcrumb from "../../../components/Breadcrumb";
import { toast } from "react-toastify";

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await newsAPI.getAll();
      setNewsList(res.data.data || []);
    } catch (err) {
      toast.error("Không thể tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin này?")) return;
    try {
      await newsAPI.delete(id);
      toast.success("Đã xóa tin tức");
      fetchNews();
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const fd = new FormData();
      fd.append("status", item.status === "Active" ? "Inactive" : "Active");
      await newsAPI.update(item.id, fd);
      toast.success("Đã cập nhật trạng thái");
      fetchNews();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Tin Tức</h1>
          <p className="text-gray-500">Quản lý bài viết và tin tức của cửa hàng</p>
        </div>
        <button
          onClick={() => navigate("/admin/news/add")}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Thêm tin tức
        </button>
      </div>

      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/admin/dashboard", icon: <Home className="w-4 h-4" /> },
          { label: "Website", icon: <Layout className="w-4 h-4" /> },
          { label: "Tin tức" },
        ]}
      />

      <div className="mt-6 overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
              <th className="px-6 py-4">Ảnh</th>
              <th className="px-6 py-4">Tiêu đề</th>
              <th className="px-6 py-4">Tác giả</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4">Ngày tạo</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">Đang tải...</td></tr>
            ) : newsList.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">Chưa có tin tức nào</td></tr>
            ) : (
              newsList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-12 overflow-hidden bg-gray-100 rounded border border-gray-200">
                      {item.image_url ? (
                        <img src={item.image_url} alt="" className="object-cover w-full h-full" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-300">
                          <Newspaper size={16} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800 max-w-xs line-clamp-1">{item.title}</div>
                    {item.summary && (
                      <div className="text-xs text-gray-400 mt-1 line-clamp-1">{item.summary}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.author || "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button onClick={() => handleToggleStatus(item)} title={item.status === "Active" ? "Ẩn" : "Hiện"}>
                        {item.status === "Active" ? (
                          <CheckCircle className="text-green-500" size={24} />
                        ) : (
                          <XCircle className="text-gray-300" size={24} />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/news/${item.id}/edit`)}
                        className="p-2 text-blue-600 rounded-full hover:bg-blue-50"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 rounded-full hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
