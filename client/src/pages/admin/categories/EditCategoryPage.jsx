import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import categoryAPI from "../../../api/category.api";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { UploadCloud, Home, Folder, X , Edit } from "lucide-react";
import Breadcrumb from "../../../components/Breadcrumb";
import { generateSlug } from "../../../helpers/generateSlug";
import SuccessNotification from "../../../components/SuccessNotification";
import defaultImage from '../../../assets/default.jpg';
    
export default function EditCategoryPage() {
  const { categoryId } = useParams();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await categoryAPI.getById( categoryId );
        const cat = res.data.data;
        setName(cat.name || "");
        setSlug(cat.slug || "");
        setStatus(cat.status || "Active");
        if (cat.image) setImagePreview(cat.image) 
         else setImagePreview(defaultImage);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategory();
  }, [ categoryId]);

 useEffect(() => {
  if (!slug) setSlug(generateSlug(name));
}, [name]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !slug) {
      setErrors({ form: "Vui lòng nhập tên và slug." });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("status", status);
    if (imageFile) formData.append("image", imageFile);

    try {
      setLoading(true);
      await categoryAPI.update( categoryId, formData);
      setSuccessMessage("Cập nhật danh mục thành công!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/admin/categories");
      }, 1000);
    } catch (error) {
      console.error(error);
      setErrors({ form: "Có lỗi xảy ra khi cập nhật danh mục." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen p-6 bg-gray-50">
      {/* Breadcrumb */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chỉnh Sửa Danh Mục</h1>
          <p className="text-gray-500">Quản lý danh mục của bạn</p>
        </div>
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/admin", icon: <Home className="w-4 h-4" /> },
            { label: "Danh mục", href: "/admin/categories", icon: <Folder className="w-4 h-4" /> },
            { label: "Chỉnh sửa", icon: <Edit className="w-4 h-4" /> },
          ]}
        />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-6 bg-white rounded-lg shadow-md"
      >
        {/* Tên */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <label className="text-sm font-medium text-gray-700">
            Tên danh mục <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-2">
            <Input
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên danh mục"
            error={errors.name}
            />
          </div>
        </div>

        {/* Slug */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <label className="text-sm font-medium text-gray-700">
            Slug <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-2">
           <Input
            value={slug || ""}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="nhap-slug-danh-muc"
            error={errors.slug}
            />
            <p className="mt-1 text-sm text-gray-400">
              Slug tự động sinh từ tên, có thể chỉnh tay.
            </p>
          </div>
        </div>

        {/* Trạng thái */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <label className="text-sm font-medium text-gray-700">Trạng thái</label>
          <div className="flex items-center gap-3 md:col-span-2">
            <div
              onClick={() => setStatus(status === "Active" ? "Inactive" : "Active")}
              className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer ${
                status === "Active" ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full ${
                  status === "Active" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </div>
            <span className="text-sm text-gray-700">{status === "Active" ? "Hoạt động" : "Ẩn"}</span>
          </div>
        </div>

        {/* Ảnh */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <label className="text-sm font-medium text-gray-700">Ảnh đại diện</label>
          <div className="flex flex-col gap-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100">
                <UploadCloud className="w-5 h-5 text-gray-500" />
                {imageFile ? imageFile.name : "Chọn ảnh..."}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>

              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="px-3 py-2 text-sm text-red-600 border border-red-400 rounded-md hover:bg-red-100"
                >
                  Xoá ảnh
                </button>
              )}
            </div>

            {imagePreview && (
              <div className="relative w-40 mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-cover w-40 h-40 border rounded-md cursor-pointer hover:opacity-80 hover:scale-105"
                  onClick={() => setShowImageModal(true)}
                />
                <p className="mt-1 text-sm text-gray-400">Nhấp vào ảnh để phóng to</p>
              </div>
            )}
          </div>
        </div>

        {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
      </form>

      {/* Floating Buttons */}
      <div className="fixed z-50 bottom-6 right-6">
                   <div className="flex items-center gap-3 p-4 bg-white shadow-lg rounded-xl">
                     <Button
                       type="button"
                       variant="secondary"
                       className="px-6 py-3 text-lg"
                       onClick={() => navigate("/admin/brands")}
                     >
                       Hủy
                     </Button>
                     <Button
                       type="button"
                       className={`px-6 py-3 text-lg ${
                         loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
                       }`}
                       onClick={handleSubmit}
                       disabled={loading}
                     >
                       {loading ? "Đang cập nhật..." : "Cập nhật"}
                     </Button>
                   </div>
                 </div>
      {/* Success Notification */}
      {successMessage && (
        <SuccessNotification
          message={successMessage}
          onClose={() => setSuccessMessage("")}
          duration={1000}
        />
      )}

      {/* Modal ảnh */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative p-4 bg-white rounded-lg max-w-3xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute text-gray-600 top-2 right-2 hover:text-red-500"
              onClick={() => setShowImageModal(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={imagePreview}
              alt="Full Preview"
              className="object-contain w-full h-[80vh] rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}
