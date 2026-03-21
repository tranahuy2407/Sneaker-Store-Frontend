import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Image as ImageIcon, Layout, Home, X } from "lucide-react";
import homeSectionAPI from "../../../api/homeSection.api";
import brandAPI from "../../../api/brand.api";
import Breadcrumb from "../../../components/Breadcrumb";
import ProductComboBox from "../../../components/ProductComboBox";
import { toast } from "react-toastify";

export default function AddHomeSectionPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bannerFile, setBannerFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    banner_url: "",
    section_type: "brand",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandAPI.getAll();
        setBrands(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBrands();

    if (isEdit) {
      const fetchDetail = async () => {
        try {
          const res = await homeSectionAPI.getAll();
          const detail = res.data.data.find((s) => s.id == id);
          if (detail) {
            setFormData(detail);
            setPreviewUrl(detail.banner_url);
            if (detail.products) {
              setSelectedProducts(detail.products);
            }
          }
        } catch (err) {
          toast.error("Không thể tải thông tin section");
        }
      };
      fetchDetail();
    }
  }, [id, isEdit]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);
    if (!isEdit && !bannerFile && !formData.banner_url) {
      toast.error("Vui lòng chọn banner");
      return;
    }

    const data = new FormData();

    data.append("title", formData.title);
    data.append("section_type", formData.section_type);
    data.append("display_order", String(formData.display_order));
    data.append("is_active", formData.is_active ? "1" : "0");

    data.append("slug", formData.slug || "");

    if (bannerFile) {
      data.append("banner", bannerFile);
    } else if (formData.banner_url) {
      data.append("banner_url", formData.banner_url);
    }
    const productIds = selectedProducts?.map(p => p.id) || [];

    data.append("productIds", JSON.stringify(productIds)); 

    if (isEdit) {
      await homeSectionAPI.update(id, data);
      toast.success("Cập nhật thành công");
    } else {
      await homeSectionAPI.create(data);
      toast.success("Thêm mới thành công");
    }

    navigate("/admin/home-sections");

  } catch (err) {
    console.error("ERROR:", err.response?.data || err);

    toast.error(
      err.response?.data?.message || "Lỗi khi lưu dữ liệu"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Chỉnh sửa Section" : "Thêm Section Mới"}
          </h1>
          <p className="text-gray-500">Cấu hình hiển thị nội dung cho trang chủ</p>
        </div>
        <button
          onClick={() => navigate("/admin/home-sections")}
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
          { label: "Giao diện trang chủ", href: "/admin/home-sections" },
          { label: isEdit ? "Chỉnh sửa" : "Thêm mới" },
        ]}
      />

      <div className="mt-6 max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm space-y-6">
             <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Thông tin chung</h2>
             
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Tiêu đề hiển thị *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ví dụ: GIÀY NIKE MỚI NHẤT"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Type */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Loại nội dung</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  value={formData.section_type}
                  onChange={(e) => setFormData({ ...formData, section_type: e.target.value })}
                >
                  <option value="brand">Theo thương hiệu (Brand)</option>
                  <option value="sale">Sản phẩm khuyến mãi (Sale)</option>
                  <option value="new_arrival">Sản phẩm mới ra mắt</option>
                  <option value="manual">Chọn sản phẩm thủ công (Manual)</option>
                </select>
              </div>

              {/* Slug / Brand Selection */}
              {formData.section_type === "brand" ? (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Chọn thương hiệu *</label>
                  <select
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.slug}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Slug (định danh URL)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ví dụ: san-pham-sale, hang-moi"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                  <p className="mt-1 text-xs text-gray-400">Để trống nếu không cần slug riêng</p>
                </div>
              )}

              {/* Display Order */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Thứ tự hiển thị (Càng nhỏ càng nằm trên)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                />
              </div>
            </div>

            {/* Banner Upload */}
            <div className="md:col-span-2 space-y-4">
              <label className="block text-sm font-medium text-gray-700">Hình ảnh Banner (Ngang, kích thước lớn)</label>
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
                    <p className="text-sm text-gray-500">Kéo thả hoặc nhấp để chọn ảnh banner</p>
                    <p className="text-xs text-gray-400 mt-1">Hỗ trợ JPG, PNG, WEBP (Tối đa 5MB)</p>
                  </div>
                </div>
                
                {previewUrl && (
                  <div className="w-64 h-32 relative border rounded-lg overflow-hidden shrink-0 group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => { setBannerFile(null); setPreviewUrl(""); }}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Is Active */}
            <div className="flex items-center gap-2">
               <input
                id="is_active"
                type="checkbox"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Hiển thị section này trên trang chủ</label>
            </div>
          </div>

          {/* Product Selection */}
          <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Sản phẩm liên kết</h2>
              <span className="text-xs font-normal text-gray-500 italic">
                (Áp dụng khi chọn loại "Chọn sản phẩm thủ công" hoặc để bổ sung sản phẩm cho khối nội dung)
              </span>
            </div>
            <ProductComboBox
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
            />
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-10 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg transition-all font-bold disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? "Đang xử lý..." : isEdit ? "Lưu thay đổi" : "Tạo Section"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
