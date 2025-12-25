"use client";
import React, { useRef } from "react";
import { XCircle } from "lucide-react";

const ProductImageUpload = ({ images, setImages }) => {
  const fileInputRef = useRef(null);

  const addImages = (files) => {
    const newImgs = files.map((file, i) => ({
      file,
      name: file.name.replace(/\.\w+$/, ""),
      alt: "",
      isDefault: images.length === 0 && i === 0, // ảnh đầu tiên mặc định
    }));
    setImages([...images, ...newImgs]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    addImages(Array.from(e.dataTransfer.files));
  };

  const handleSelectFiles = (e) => {
    addImages(Array.from(e.target.files));
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    if (!updated.some(img => img.isDefault) && updated.length > 0) {
      updated[0].isDefault = true;
    }
    setImages(updated);
  };

  const setPrimary = (index) => {
    const updated = images.map((img, i) => ({ ...img, isDefault: i === index }));
    setImages(updated);
  };

  return (
    <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Hình Ảnh Sản Phẩm</h2>

      {/* Dropzone */}
      <div
        className="flex flex-col items-center justify-center p-10 border-2 border-dashed cursor-pointer rounded-xl bg-gray-50 hover:bg-gray-100"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        <p className="font-medium text-gray-600">Kéo & thả ảnh vào đây hoặc click để chọn</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleSelectFiles}
        />
        <p className="mt-2 text-sm text-gray-500">Hỗ trợ JPG, PNG, WebP — Tối đa 2MB/ảnh</p>
      </div>

      {/* Previews */}
      {images.length > 0 && (
        <div className="grid gap-4 mt-6 md:grid-cols-2">
          {images.map((img, index) => (
            <div key={index} className="relative p-4 border rounded-xl bg-gray-50">
              <button
                onClick={() => removeImage(index)}
                className="absolute text-red-500 -top-3 -right-3 hover:text-red-700"
              >
                <XCircle size={26} />
              </button>

              <div className="flex justify-center">
                <img
                  src={img.file ? URL.createObjectURL(img.file) : img.url}
                  className="object-cover w-48 h-48 rounded-lg shadow"
                  alt={img.alt || img.name}
                />
              </div>

              <div className="mt-4 space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Tên hiển thị</label>
                  <input
                    className="w-full px-3 py-2 mt-1 border rounded-md"
                    value={img.name}
                    onChange={(e) => {
                      const updated = [...images];
                      updated[index].name = e.target.value;
                      setImages(updated);
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Alt Text (SEO)</label>
                  <input
                    className="w-full px-3 py-2 mt-1 border rounded-md"
                    value={img.alt || ""}
                    onChange={(e) => {
                      const updated = [...images];
                      updated[index].alt = e.target.value;
                      setImages(updated);
                    }}
                    placeholder="Để trống sẽ dùng tên sản phẩm"
                  />
                </div>

                <label className="flex items-center gap-2 mt-2 text-purple-600">
                  <input
                    type="radio"
                    checked={img.isDefault}
                    onChange={() => setPrimary(index)}
                  />
                  Đặt làm ảnh chính
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
