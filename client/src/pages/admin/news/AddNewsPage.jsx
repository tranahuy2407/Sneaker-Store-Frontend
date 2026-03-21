import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Image as ImageIcon, Home, Layout, X } from "lucide-react";
import newsAPI from "../../../api/news.api";
import Breadcrumb from "../../../components/Breadcrumb";
import CKEditorToolbar from "../../../components/CKEditorToolbar";
import { toast } from "react-toastify";

export default function AddNewsPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    author: "",
    status: "Active",
  });

  useEffect(() => {
    if (isEdit) {
      const fetchDetail = async () => {
        try {
          const res = await newsAPI.getById(id);
          const detail = res.data.data;
          if (detail) {
            setFormData({
              title: detail.title || "",
              summary: detail.summary || "",
              content: detail.content || "",
              author: detail.author || "",
              status: detail.status || "Active",
            });
            setPreviewUrl(detail.image_url || "");
          }
        } catch {
          toast.error("Không thể tải thông tin bài viết");
        }
      };
      fetchDetail();
    }
  }, [id, isEdit]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error("Vui lòng nhập tiêu đề"); return; }
    if (!formData.content.trim()) { toast.error("Vui lòng nhập nội dung"); return; }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("summary", formData.summary);
      fd.append("content", formData.content);
      fd.append("author", formData.author);
      fd.append("status", formData.status);
      if (imageFile) fd.append("image", imageFile);

      if (isEdit) {
        await newsAPI.update(id, fd);
        toast.success("Cập nhật thành công");
      } else {
        await newsAPI.create(fd);
        toast.success("Thêm mới thành công");
      }
      navigate("/admin/news");
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
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
          </h1>
          <p className="text-gray-500">Quản lý tin tức và bài viết của cửa hàng</p>
        </div>
        <button
          onClick={() => navigate("/admin/news")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>
      </div>

      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/admin/dashboard", icon: <Home className="w-4 h-4" /> },
          { label: "Website", icon: <Layout className="w-4 h-4" /> },
          { label: "Tin tức", href: "/admin/news" },
          { label: isEdit ? "Chỉnh sửa" : "Thêm mới" },
        ]}
      />

      <div className="mt-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cơ bản */}
          <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Thông tin bài viết</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tiêu đề */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Tiêu đề *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nhập tiêu đề bài viết"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Tác giả */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Tác giả</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Tên tác giả"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Trạng thái</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Hiển thị</option>
                  <option value="Inactive">Ẩn</option>
                </select>
              </div>

              {/* Tóm tắt */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Tóm tắt</label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Mô tả ngắn về bài viết..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                />
              </div>
            </div>

            {/* Ảnh đại diện */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Ảnh đại diện</label>
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-500 transition-colors cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                    <ImageIcon className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-2" />
                    <p className="text-sm text-gray-500">Kéo thả hoặc nhấp để chọn ảnh</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (Tối đa 5MB)</p>
                  </div>
                </div>
                {previewUrl && (
                  <div className="w-40 h-28 relative border rounded-lg overflow-hidden shrink-0 group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setPreviewUrl(""); }}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Nội dung */}
          <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                <Layout size={20} className="text-blue-500" />
                Nội dung bài viết *
            </h2>
            <CKEditorToolbar
              editorData={formData.content}
              setEditorData={(data) => setFormData({ ...formData, content: data })}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-10 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg transition-all font-bold disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? "Đang xử lý..." : isEdit ? "Lưu thay đổi" : "Đăng bài viết"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
