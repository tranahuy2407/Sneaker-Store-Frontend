import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Folder, Plus, X, UploadCloud } from "lucide-react";

import CKEditorToolbar from "../../../components/CKEditorToolbar";
import categoryAPI from "../../../api/category.api";
import brandAPI from "../../../api/brand.api";
import productAPI from "../../../api/product.api";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import Breadcrumb from "../../../components/Breadcrumb";
import SuccessNotification from "../../../components/SuccessNotification";
import { generateSlug } from "../../../helpers/generateSlug";
import ProductImageUpload from "../../../components/ProductImageUpload";

export default function AddProductPage() {
  const navigate = useNavigate();

  // Product states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("Active");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [price, setPrice] = useState("");

  // Dropdown & search
  const [brandSearch, setBrandSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [brandDropdown, setBrandDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  // Image & editor
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [editorData, setEditorData] = useState("");

  // UI & errors
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState("");

  // Refs for click outside
  const brandRef = useRef(null);
  const categoryRef = useRef(null);

  //sizes & giá giảm
  const [discountPrice, setDiscountPrice] = useState("");
  const [sizes, setSizes] = useState([
  36.5, 37, 37.5, 38, 38.5, 39, 40, 40.5, 41, 41.5, 42, 42.5, 43, 43.5, 44, 44.5, 45, 45.5, 46, 46.5
].map(size => ({ size, selected: false, stock: 0 })));


  useEffect(() => setSlug(generateSlug(name)), [name]);

  // Load brands & categories
  useEffect(() => {
    const loadData = async () => {
      try {
        const b = await brandAPI.getAll({ limit: 1000 });
        setBrands(b?.data?.data || []);
        const c = await categoryAPI.getAll({ limit: 1000 });
        setCategories(c?.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (brandRef.current && !brandRef.current.contains(e.target)) setBrandDropdown(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddCategory = (id) => {
    const cat = categories.find((c) => c.id === id);
    if (cat && !selectedCategories.some((c) => c.id === cat.id)) {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const removeCategory = (id) =>
    setSelectedCategories(selectedCategories.filter((c) => c.id !== id));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageFiles([...imageFiles, ...files]);
    setImagePreviews([...imagePreviews, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    if (mainImageIndex === index) setMainImageIndex(0);
  };

  const handleInsertImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("image", file);
    const res = await productAPI.uploadDescriptionImage(form);
    setEditorData((prev) => prev + `<img src="${res.data.url}" alt="image"/>`);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name || !slug || !selectedBrand) {
    setErrors({ form: "Vui lòng nhập đầy đủ thông tin!" });
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("slug", slug);
  formData.append("status", status);
  formData.append("description", editorData);
  formData.append("brand_id", selectedBrand.id);
  formData.append("price", price);
  formData.append("discountPrice", discountPrice || 0);
  formData.append("mainImageIndex", mainImageIndex);
  selectedCategories.forEach(c => formData.append("categoryIds", c.id));
  imageFiles.forEach(f => formData.append("images", f));
  sizes
    .filter(s => s.selected)
    .forEach(s => formData.append("sizes[]", s.size)); 

  try {
    setLoading(true);
    await productAPI.create(formData); 
    setSuccessMessage("Thêm sản phẩm thành công!");
    setTimeout(() => navigate("/admin/products"), 1200);
  } catch (err) {
    console.error("Axios error:", err.response || err);
    setErrors({ form: err.response?.data?.message || "Có lỗi xảy ra khi thêm sản phẩm!" });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative w-full min-h-screen p-6 bg-gray-50">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Thêm sản phẩm mới</h1>
          <p className="text-gray-500">Quản lý sản phẩm của bạn</p>
        </div>
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/admin", icon: <Home className="w-4 h-4" /> },
            { label: "Sản phẩm", href: "/admin/products", icon: <Folder className="w-4 h-4" /> },
            { label: "Thêm mới", icon: <Plus className="w-4 h-4" /> },
          ]}
        />
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
   {/* Product Info */}
<div className="p-6 space-y-4 bg-white rounded-lg shadow-md">
  <h2 className="text-lg font-semibold">Thông tin sản phẩm</h2>

  {/* Name */}
  <div>
    <label className="block mb-1 text-sm font-medium text-gray-700">Tên sản phẩm *</label>
    <Input
      placeholder="Nhập tên sản phẩm"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  </div>

  {/* Slug */}
  <div>
    <label className="block mb-1 text-sm font-medium text-gray-700">Slug *</label>
    <Input
      placeholder="Slug tự động hoặc nhập thủ công"
      value={slug}
      onChange={(e) => setSlug(e.target.value)}
    />
  </div>

  <div>
  <label className="block mb-1 text-sm font-medium text-gray-700">Giá *</label>
  <Input
    placeholder="Nhập giá sản phẩm"
    type="number"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
  />
</div>

<div>
  <label className="block mb-1 text-sm font-medium text-gray-700">Giá giảm</label>
  <Input
    placeholder="Nhập giá giảm"
    type="number"
    value={discountPrice}
    onChange={(e) => setDiscountPrice(e.target.value)}
  />
</div>



  {/* Brand */}
  <div className="relative grid grid-cols-1 gap-2 md:grid-cols-3" ref={brandRef}>
    <label className="text-sm font-medium text-gray-700">Thương hiệu *</label>
    <div className="relative md:col-span-2">
      <Input
        placeholder="Tìm thương hiệu..."
        value={brandSearch}
        onChange={(e) => {
          setBrandSearch(e.target.value);
          setBrandDropdown(true);
        }}
        onFocus={() => setBrandDropdown(true)}
      />
      {brandDropdown && (
        <ul className="absolute z-50 w-full mt-1 overflow-auto bg-white border rounded shadow max-h-60">
          {brands
            .filter((b) => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
            .map((b) => (
              <li
                key={b.id}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSelectedBrand(b);
                  setBrandSearch("");
                  setBrandDropdown(false);
                }}
              >
                {b.name}
              </li>
            ))}
        </ul>
      )}
      {selectedBrand && (
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="flex items-center px-3 py-1 text-sm text-white bg-green-500 rounded-full">
            {selectedBrand.name}
            <X
              size={16}
              className="ml-2 cursor-pointer hover:text-gray-200"
              onClick={() => setSelectedBrand(null)}
            />
          </span>
        </div>
      )}
    </div>
  </div>

  

  {/* Categories */}
  <div className="relative grid grid-cols-1 gap-2 md:grid-cols-3" ref={categoryRef}>
    <label className="text-sm font-medium text-gray-700">Danh mục</label>
    <div className="relative md:col-span-2">
      <Input
        placeholder="Tìm danh mục..."
        value={categorySearch}
        onChange={(e) => {
          setCategorySearch(e.target.value);
          setCategoryDropdown(true);
        }}
        onFocus={() => setCategoryDropdown(true)}
      />
      {categoryDropdown && (
        <ul className="absolute z-50 w-full mt-1 overflow-auto bg-white border rounded shadow max-h-60">
          {categories
            .filter(
              (c) =>
                c.name.toLowerCase().includes(categorySearch.toLowerCase()) &&
                !selectedCategories.some((sc) => sc.id === c.id)
            )
            .map((c) => (
              <li
                key={c.id}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  handleAddCategory(c.id);
                  setCategorySearch("");
                  setCategoryDropdown(false);
                }}
              >
                {c.name}
              </li>
            ))}
        </ul>
      )}

      {/* Selected category tags */}
      <div className="flex flex-wrap items-center gap-2 mt-2">
        {selectedCategories.map((c) => (
          <span
            key={c.id}
            className="flex items-center px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full"
          >
            {c.name}
            <X
              size={16}
              className="ml-2 cursor-pointer hover:text-blue-400"
              onClick={() => removeCategory(c.id)}
            />
          </span>
        ))}
      </div>
    </div>
  </div>
  <div className="mt-4">
  <label className="block mb-2 text-sm font-medium text-gray-700">Chọn size</label>
  <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
    {sizes.map((s, idx) => (
      <div key={s.size} className="flex flex-col items-start">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={s.selected}
            onChange={(e) => {
              const newSizes = [...sizes];
              newSizes[idx].selected = e.target.checked;
              setSizes(newSizes);
            }}
          />
          <span>{s.size}</span>
        </label>
      </div>
    ))}
  </div>
</div>


  {/* Status */}
  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
    <label className="text-sm font-medium text-gray-700">Trạng thái</label>
    <div className="flex items-center gap-3 md:col-span-2">
      <div
        className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
          status === "Active" ? "bg-green-500" : "bg-gray-300"
        }`}
        onClick={() => setStatus(status === "Active" ? "Inactive" : "Active")}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
            status === "Active" ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </div>
      <span>{status === "Active" ? "Hoạt động" : "Ẩn"}</span>
    </div>
  </div>
</div>


        {/* Description */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-3 text-lg font-semibold">Mô tả sản phẩm</h2>
          <CKEditorToolbar
            editorData={editorData}
            setEditorData={setEditorData}
            onInsertImage={handleInsertImage}
          />
        </div>

          <ProductImageUpload
            images={imageFiles.map((file, i) => ({
              file,
              name: file.name.replace(/\.\w+$/, ""),
              isDefault: i === mainImageIndex,
            }))}
            setImages={(imgs) => {
              setImageFiles(imgs.map(img => img.file));
              setMainImageIndex(imgs.findIndex(img => img.isDefault));
            }}
          />

        {/* Floating buttons */}
        <div className="fixed z-50 bottom-6 right-6">
          <div className="flex items-center gap-3 p-4 bg-white shadow-lg rounded-xl">
            <Button
              type="button"
              variant="secondary"
              className="px-6 py-3 text-lg"
              onClick={() => navigate("/admin/products")}
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
              {loading ? "Đang thêm..." : "Thêm sản phẩm"}
            </Button>
          </div>
        </div>

        {successMessage && (
          <SuccessNotification
            message={successMessage}
            duration={1000}
            onClose={() => setSuccessMessage("")}
          />
        )}
        {errors.form && <p className="mt-3 text-red-500">{errors.form}</p>}

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
                src={modalImage}
                alt="Full Preview"
                className="object-contain w-full h-[80vh] rounded-md"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
