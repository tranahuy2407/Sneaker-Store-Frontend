import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Home, Folder, Save, X } from "lucide-react";

import productAPI from "../../../api/product.api";
import categoryAPI from "../../../api/category.api";
import brandAPI from "../../../api/brand.api";

import CKEditorToolbar from "../../../components/CKEditorToolbar";
import ProductImageUpload from "../../../components/ProductImageUpload";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import Breadcrumb from "../../../components/Breadcrumb";
import SuccessNotification from "../../../components/SuccessNotification";
import { generateSlug } from "../../../helpers/generateSlug";

export default function UpdateProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  // STATES
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [brandSearch, setBrandSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [brandDropdown, setBrandDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  const [oldImages, setOldImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const [sizes, setSizes] = useState(
    [36.5, 37, 37.5, 38, 38.5, 39, 40, 40.5, 41, 41.5, 42, 42.5, 43, 43.5, 44, 44.5, 45, 45.5, 46, 46.5]
      .map(size => ({ size, selected: false }))
  );

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  const brandRef = useRef(null);
  const categoryRef = useRef(null);

  // -------------------------------------------------
  // LOAD BRAND + CATEGORY
  // -------------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const b = await brandAPI.getAll({ limit: 1000 });
        const c = await categoryAPI.getAll({ limit: 1000 });
        setBrands(b?.data?.data || []);
        setCategories(c?.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  // -------------------------------------------------
  // LOAD PRODUCT
  // -------------------------------------------------
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await productAPI.getById(productId);
        const p = res.data.data;

        setName(p.name);
        setSlug(p.slug);
        setDescription(p.description || "");
        setStatus(p.status);
        setPrice(p.price);
        setDiscountPrice(p.discountPrice || 0);
        setOldImages(p.images || []);
        setMainImageIndex(p.main_image_index || 0);

        setSelectedBrand(p.brand);
        setSelectedCategories(p.categories || []);

        if (p.sizes) {
          setSizes(prev =>
            prev.map(s => {
              const found = p.sizes.find(ps => ps.size === s.size);
              return found ? { ...s, selected: true } : s;
            })
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProduct();
  }, [productId]);

  // -------------------------------------------------
  // HANDLE INSERT IMAGE (CKEditor)
  // -------------------------------------------------
  const handleInsertImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("image", file);
    const res = await productAPI.uploadDescriptionImage(form);
    setDescription(prev => prev + `<img src="${res.data.url}" alt="image"/>`);
  };

  // -------------------------------------------------
  // SUBMIT
  // -------------------------------------------------
  const handleSubmit = async () => {
    if (!name || !slug || !selectedBrand) {
      setErrors({ form: "Vui lòng nhập đầy đủ thông tin!" });
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("status", status);
    formData.append("price", Number(price));
    formData.append("discountPrice", Number(discountPrice));
    formData.append("brand_id", Number(selectedBrand.id));

    selectedCategories.forEach(c => formData.append("categoryIds", Number(c.id)));

   sizes
  .filter(s => s.selected)
  .forEach(s => formData.append("sizes[]", JSON.stringify({ size: s.size })));

    // ảnh cũ
    oldImages.forEach(img => formData.append("oldImages", img.url));

    // ảnh mới
    imageFiles.forEach(f => formData.append("images", f));

    formData.append("mainImageIndex", Number(mainImageIndex));

    try {
      setLoading(true);
      await productAPI.update(productId, formData);
      setSuccessMessage("Cập nhật sản phẩm thành công!");
      setTimeout(() => navigate("/admin/products"), 1200);
    } catch (err) {
      console.error(err);
      setErrors({ form: "Có lỗi xảy ra khi cập nhật!" });
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------
  // CLICK OUTSIDE DROPDOWN
  // -------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (brandRef.current && !brandRef.current.contains(e.target)) setBrandDropdown(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------------------------------------------------
  // UI
  // -------------------------------------------------
  return (
    <div className="relative w-full min-h-screen p-6 bg-gray-50">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cập nhật sản phẩm</h1>
          <p className="text-gray-500">Chỉnh sửa thông tin sản phẩm</p>
        </div>

        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/admin", icon: <Home className="w-4 h-4" /> },
            { label: "Sản phẩm", href: "/admin/products", icon: <Folder className="w-4 h-4" /> },
            { label: "Cập nhật", icon: <Save className="w-4 h-4" /> },
          ]}
        />
      </div>

      {errors.form && <p className="mb-3 text-red-500">{errors.form}</p>}

      <div className="space-y-6">
        {/* INFO */}
        <div className="p-6 space-y-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Thông tin sản phẩm</h2>

          <div>
            <label className="block mb-1 text-sm font-medium">Tên sản phẩm *</label>
           <Input 
            value={name} 
            onChange={(e) => {
              const val = e.target.value;
              setName(val);
              setSlug(generateSlug(val)); 
            }} 
          />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Slug *</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Giá *</label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Giá giảm</label>
            <Input type="number" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} />
          </div>

          {/* BRAND */}
          <div className="relative grid grid-cols-1 gap-2 md:grid-cols-3" ref={brandRef}>
            <label className="text-sm font-medium">Thương hiệu *</label>
            <div className="relative md:col-span-2">
              <Input
                placeholder="Tìm thương hiệu..."
                value={brandSearch}
                onFocus={() => setBrandDropdown(true)}
                onChange={(e) => { setBrandSearch(e.target.value); setBrandDropdown(true); }}
              />
              {brandDropdown && (
                <ul className="absolute z-50 w-full mt-1 overflow-auto bg-white border rounded shadow max-h-60">
                  {brands
                    .filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
                    .map(b => (
                      <li key={b.id} className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => { setSelectedBrand(b); setBrandSearch(""); setBrandDropdown(false); }}>
                        {b.name}
                      </li>
                    ))}
                </ul>
              )}
              {selectedBrand && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="flex items-center px-3 py-1 text-sm text-white bg-green-500 rounded-full">
                    {selectedBrand.name}
                    <X className="w-4 h-4 ml-2 cursor-pointer" onClick={() => setSelectedBrand(null)} />
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CATEGORY */}
          <div className="relative grid grid-cols-1 gap-2 md:grid-cols-3" ref={categoryRef}>
            <label className="text-sm font-medium">Danh mục</label>
            <div className="relative md:col-span-2">
              <Input
                placeholder="Tìm danh mục..."
                value={categorySearch}
                onFocus={() => setCategoryDropdown(true)}
                onChange={(e) => { setCategorySearch(e.target.value); setCategoryDropdown(true); }}
              />
              {categoryDropdown && (
                <ul className="absolute z-50 w-full mt-1 overflow-auto bg-white border rounded shadow max-h-60">
                  {categories
                    .filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()) && !selectedCategories.some(sc => sc.id === c.id))
                    .map(c => (
                      <li key={c.id} className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => { setSelectedCategories([...selectedCategories, c]); setCategorySearch(""); setCategoryDropdown(false); }}>
                        {c.name}
                      </li>
                    ))}
                </ul>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {selectedCategories.map(c => (
                  <span key={c.id} className="flex items-center px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full">
                    {c.name}
                    <X className="w-4 h-4 ml-2 cursor-pointer" onClick={() => setSelectedCategories(selectedCategories.filter(x => x.id !== c.id))} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SIZES */}
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

          {/* STATUS */}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <label className="text-sm font-medium">Trạng thái</label>
            <div className="flex items-center gap-3 md:col-span-2">
              <div
                className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${status === "Active" ? "bg-green-500" : "bg-gray-300"}`}
                onClick={() => setStatus(status === "Active" ? "Inactive" : "Active")}
              >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${status === "Active" ? "translate-x-6" : "translate-x-1"}`} />
              </div>
              <span>{status === "Active" ? "Hoạt động" : "Ẩn"}</span>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-3 text-lg font-semibold">Mô tả sản phẩm</h2>
          <CKEditorToolbar editorData={description} setEditorData={setDescription} onInsertImage={handleInsertImage} />
        </div>

        {/* IMAGES */}
        <ProductImageUpload
          images={[
            ...oldImages.map((img, i) => ({
              id: `old-${i}`,
              file: null,
              url: img.url,
              name: img.url.split("/").pop(),
              isDefault: mainImageIndex === i,
              isOld: true,
            })),
            ...imageFiles.map((file, i) => ({
              id: `new-${i}`,
              file,
              url: URL.createObjectURL(file),
              name: file.name.replace(/\.\w+$/, ""),
              isDefault: false,
              isOld: false,
            })),
          ]}
          setImages={(imgs) => {
            const newOld = imgs.filter(x => x.isOld);
            const newNew = imgs.filter(x => !x.isOld);
            setOldImages(newOld.map(x => ({ url: x.url })));
            setImageFiles(newNew.map(x => x.file));
            setMainImageIndex(imgs.findIndex(x => x.isDefault));
          }}
        />
      </div>

      {/* FLOATING BUTTONS */}
      <div className="fixed z-50 bottom-6 right-6">
        <div className="flex items-center gap-3 p-4 bg-white shadow-lg rounded-xl">
          <Button variant="secondary" className="px-6 py-3 text-lg" onClick={() => navigate("/admin/products")}>
            Hủy
          </Button>
          <Button className={`px-6 py-3 text-lg ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"}`} onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu cập nhật"}
          </Button>
        </div>
      </div>

      {successMessage && (
        <SuccessNotification message={successMessage} duration={1000} onClose={() => setSuccessMessage("")} />
      )}
    </div>
  );
}
