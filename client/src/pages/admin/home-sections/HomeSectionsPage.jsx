import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Home,
  Layout,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import homeSectionAPI from "../../../api/homeSection.api";
import Breadcrumb from "../../../components/Breadcrumb";
import { toast } from "react-toastify";

export default function HomeSectionsPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await homeSectionAPI.getAll();
      setSections(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách section");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleToggleStatus = async (section) => {
    try {
      const fd = new FormData();
      fd.append("is_active", section.is_active ? "0" : "1");
      await homeSectionAPI.update(section.id, fd);
      toast.success("Cập nhật trạng thái thành công");
      fetchSections();
    } catch (err) {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa section này?")) return;
    try {
      await homeSectionAPI.delete(id);
      toast.success("Đã xóa section");
      fetchSections();
    } catch (err) {
      toast.error("Xóa thất bại");
    }
  };

  const handleMove = async (section, direction) => {
    const currentIndex = sections.indexOf(section);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= sections.length) return;

    const otherSection = sections[newIndex];

    const fd1 = new FormData();
    fd1.append("display_order", String(otherSection.display_order));
    const fd2 = new FormData();
    fd2.append("display_order", String(section.display_order));

    try {
      await Promise.all([
        homeSectionAPI.update(section.id, fd1),
        homeSectionAPI.update(otherSection.id, fd2),
      ]);
      fetchSections();
    } catch (err) {
      toast.error("Sắp xếp thất bại");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Giao Diện Trang Chủ</h1>
          <p className="text-gray-500">Quản lý các khối sản phẩm, banner trên trang chủ</p>
        </div>
        <button
          onClick={() => navigate("/admin/home-sections/add")}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Thêm Section
        </button>
      </div>

      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/admin/dashboard", icon: <Home className="w-4 h-4" /> },
          { label: "Website", icon: <Layout className="w-4 h-4" /> },
          { label: "Giao diện trang chủ" },
        ]}
      />

      <div className="mt-6 overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 uppercase">
              <th className="px-6 py-4">Thứ tự</th>
              <th className="px-6 py-4">Khối Nội Dung / Tiêu Đề</th>
              <th className="px-6 py-4">Loại</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Đang tải...</td>
              </tr>
            ) : sections.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Chưa có section nào</td>
              </tr>
            ) : (
              sections.map((section, idx) => (
                <tr key={section.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="font-medium text-gray-900">{section.display_order}</span>
                       <div className="flex flex-col">
                          <button onClick={() => handleMove(section, "up")} disabled={idx === 0} className="text-gray-400 hover:text-blue-600 disabled:opacity-0">
                            <MoveUp size={14} />
                          </button>
                          <button onClick={() => handleMove(section, "down")} disabled={idx === sections.length - 1} className="text-gray-400 hover:text-blue-600 disabled:opacity-0">
                            <MoveDown size={14} />
                          </button>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 overflow-hidden bg-gray-100 rounded border border-gray-200">
                        {section.banner_url ? (
                          <img src={section.banner_url} alt="" className="object-cover w-full h-full" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-400">
                            <ImageIcon size={16} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{section.title}</div>
                        <div className="text-xs text-gray-500">Slug: {section.slug || "N/A"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                      {section.section_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button onClick={() => handleToggleStatus(section)} title={section.is_active ? "Ẩn" : "Hiện"}>
                        {section.is_active ? (
                          <CheckCircle className="text-green-500" size={24} />
                        ) : (
                          <XCircle className="text-gray-300" size={24} />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/home-sections/${section.id}/edit`)}
                        className="p-2 text-blue-600 rounded-full hover:bg-blue-50"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(section.id)}
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
