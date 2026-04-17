import React, { useEffect, useState } from "react";
import { Save, Info, MapPin, Phone, Mail, Clock, Facebook, Instagram, Image as ImageIcon, X, Home, Layout } from "lucide-react";
import storeInfoAPI from "../../../api/storeInfo.api";
import Breadcrumb from "../../../components/Breadcrumb";
import { toast } from "react-toastify";

export default function StoreInfoPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    email: "",
    map_url: "",
    working_hours: "",
    facebook_url: "",
    instagram_url: "",
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await storeInfoAPI.get();
        if (res.data.data) {
          const info = res.data.data;
          setFormData({
            address: info.address || "",
            phone: info.phone || "",
            email: info.email || "",
            map_url: info.map_url || "",
            working_hours: info.working_hours || "",
            facebook_url: info.facebook_url || "",
            instagram_url: info.instagram_url || "",
          });
          setPreviewUrl(info.logo_url || "");
        }
      } catch (err) {
        toast.error("Không thể tải thông tin cửa hàng");
      } finally {
        setFetching(false);
      }
    };
    fetchInfo();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (logoFile) {
        data.append("logo", logoFile);
      }

      await storeInfoAPI.update(data);
      toast.success("Cập nhật thông tin thành công");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-6 text-center text-gray-500">Đang tải...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Info className="text-blue-600" />
            Cấu Hình Thông Tin Cửa Hàng
        </h1>
        <p className="text-gray-500 mt-1">Quản lý các thông tin liên hệ, mạng xã hội và thương hiệu hiển thị trên website</p>
      </div>

      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/admin/dashboard", icon: <Home className="w-4 h-4" /> },
          { label: "Website", icon: <Layout className="w-4 h-4" /> },
          { label: "Thông tin cửa hàng" },
        ]}
      />

      <div className="mt-6 max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Thông tin liên hệ */}
            <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                <MapPin size={20} className="text-red-500" />
                Thông tin liên hệ
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Địa chỉ cửa hàng</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Email liên hệ</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <input
                        type="email"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Giờ làm việc</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="VD: 08:00 - 22:00, Thứ 2 - Chủ Nhật"
                        value={formData.working_hours}
                        onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mạng xã hội & Khác */}
            <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                <Layout size={20} className="text-purple-500" />
                Mạng xã hội & Bản đồ
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Facebook URL</label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-2.5 text-blue-600 w-4 h-4" />
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.facebook_url}
                        onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Instagram URL</label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-2.5 text-pink-600 w-4 h-4" />
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.instagram_url}
                        onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Google Maps Embed URL</label>
                  <textarea
                    rows={3}
                    placeholder="Dán link iframe hoặc URL tọa độ Google Maps"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-xs"
                    value={formData.map_url}
                    onChange={(e) => setFormData({ ...formData, map_url: e.target.value })}
                  />
                  <p className="mt-1 text-xs text-gray-400 italic">Dùng để hiển thị bản đồ ở chân trang hoặc trang liên hệ</p>
                </div>
              </div>
            </div>

            {/* Logo Shop */}
            <div className="md:col-span-2 p-8 bg-white border border-gray-200 rounded-xl shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-3">Thương hiệu & Logo</h2>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                 <div className="w-full md:w-1/2">
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center hover:border-blue-500 transition-colors cursor-pointer group">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                        />
                        <ImageIcon className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mb-2" />
                        <p className="text-sm text-gray-500 font-medium">Nhấp để thay đổi Logo cửa hàng</p>
                        <p className="text-xs text-gray-400 mt-1 uppercase">Hỗ trợ PNG, JPG, SVG (Tối ưu: Hình vuông hoặc Ngang)</p>
                    </div>
                 </div>

                 <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-bold text-gray-500">Logo hiện tại:</span>
                    <div className="w-40 h-40 bg-gray-50 border rounded-xl flex items-center justify-center overflow-hidden p-2 group relative">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <ImageIcon className="w-10 h-10 text-gray-200" />
                        )}
                        {logoFile && (
                            <button 
                                type="button"
                                onClick={() => { setLogoFile(null); setPreviewUrl(""); }}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end sticky bottom-0 bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 z-10">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full md:w-auto md:px-12 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xl transition-all font-bold disabled:opacity-50"
            >
              {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Save size={20} />}
              {loading ? "Đang lưu..." : "Lưu Cấu Hình"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
