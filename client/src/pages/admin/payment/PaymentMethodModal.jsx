import React, { useState, useEffect } from "react";
import { UploadCloud, X } from "lucide-react";
import defaultImage from "../../../assets/default.jpg";

export default function PaymentMethodModal({ open, onClose, onSubmit, initialData = null }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(defaultImage);
  const [showImageModal, setShowImageModal] = useState(false);

  // Load dữ liệu nếu chỉnh sửa
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setCode(initialData.code || "");
      setDescription(initialData.description || "");
      setIsActive(initialData.is_active ?? true);
      setLogoPreview(initialData.logo || defaultImage);
      setLogoFile(null);
    } else {
      setName("");
      setCode("");
      setDescription("");
      setIsActive(true);
      setLogoPreview(defaultImage);
      setLogoFile(null);
    }
  }, [initialData]);

  // Thay đổi file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

// Submit
const handleSubmit = () => {
 const formData = new FormData();
  formData.append("name", name);       
  formData.append("code", code);
  formData.append("description", description);
  formData.append("is_active", isActive ? "true" : "false");
  if (logoFile) formData.append("image", logoFile); 

  onSubmit(formData);
};


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-bold">
          {initialData ? "Chỉnh sửa phương thức" : "Thêm phương thức mới"}
        </h2>

        <div className="space-y-4">
          <div>
            <label>Tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label>Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label>Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label>Logo</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Preview"
                className="h-16 mt-2 border rounded cursor-pointer"
                onClick={() => setShowImageModal(true)}
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <span>Hoạt động</span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                isActive ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                  isActive ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {initialData ? "Lưu thay đổi" : "Thêm mới"}
          </button>
        </div>

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
              <img src={logoPreview} alt="Full Preview" className="object-contain w-full h-[80vh]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
