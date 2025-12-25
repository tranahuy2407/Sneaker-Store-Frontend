"use client";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productAPI from "../../../api/product.api";
import { Home, Folder, X, Edit, Star } from "lucide-react";
import Breadcrumb from "../../../components/Breadcrumb";
import { Button } from "../../../components/Button";
import defaultImage from '../../../assets/default.jpg';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productAPI.getById(productId);
        const p = res.data.data;
        setProduct(p);
        const defaultImg = p.images?.find((img) => img.isDefault)?.url || defaultImage;
        setSelectedImage(defaultImg);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();

  }, [productId]);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-500">Đang tải dữ liệu...</div>;
  if (!product) return <div className="flex items-center justify-center min-h-screen text-red-500">Sản phẩm không tồn tại.</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Breadcrumb */}
      <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chi Tiết Sản Phẩm</h1>
          <p className="text-gray-500">Thông tin chi tiết sản phẩm</p>
        </div>
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/admin", icon: <Home className="w-4 h-4" /> },
            { label: "Sản phẩm", href: "/admin/products", icon: <Folder className="w-4 h-4" /> },
            { label: "Chi tiết", icon: <Edit className="w-4 h-4" /> },
          ]}
        />
      </div>

      <div className="gap-8 md:flex">
        {/* Left Frame: Image Gallery */}
        <div className="p-4 space-y-3 bg-white rounded-lg shadow-md md:w-1/2">
          <img
            src={selectedImage}
            alt={product.name}
            className="object-contain w-full rounded-lg cursor-pointer h-96 hover:opacity-80"
            onClick={() => setShowImageModal(true)}
          />
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img.url || defaultImage}
                alt={img.name || product.name}
                onClick={() => setSelectedImage(img.url)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  selectedImage === img.url ? "border-purple-600" : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Frame: Product Info */}
        <div className="flex flex-col gap-4 md:w-1/2">
          {/* Basic Info */}
          <div className="p-4 space-y-2 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
            {/* Price */}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-2xl font-semibold text-blue-600">{product.discountPrice?.toLocaleString()}₫</span>
                  {product.discountPrice > 0 && (
                    <span className="text-xl font-semibold text-red-500 line-through">{product.price?.toLocaleString()}₫</span>
                  )}
                </div>

                {/* Sizes */}
                {product.sizes?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-sm font-medium text-gray-700">Size có sẵn:</span>
                    {product.sizes
                      .filter(s => s.size) // chỉ lấy size đã chọn
                      .map(s => (
                        <span key={s.size} className="px-2 py-1 text-sm text-white bg-blue-600 rounded-full">
                          {s.size}
                        </span>
                      ))
                    }
                  </div>
                )}

            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              product.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
            }`}>{product.status === "Active" ? "Hoạt động" : "Ẩn"}</span>

            {/* Stats */}
            <div className="flex gap-4 mt-3">
              <div className="flex flex-col items-center flex-1 p-3 border rounded-lg bg-gray-50">
                <span className="text-sm text-gray-500">Lượt bán</span>
                <span className="text-lg font-bold">{product.sold || 0}</span>
              </div>
              <div className="flex flex-col items-center flex-1 p-3 border rounded-lg bg-gray-50">
                <span className="text-sm text-gray-500">Đánh giá</span>
                <span className="flex items-center gap-1 text-yellow-400">
                  {product.rating || 0} <Star className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* Categories & Brand Frame */}
          <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg shadow-md">
            {product.categories?.map((c) => (
              <div key={c.id} className="flex items-center gap-2 px-3 py-1 text-blue-700 bg-blue-100 rounded-lg">
                <span>{c.name}</span>
                <Button size="sm" variant="secondary" onClick={() => navigate(`/admin/categories/${c.id}/edit`)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {product.brand && (
              <div className="flex items-center gap-2 px-3 py-1 text-green-700 bg-green-100 rounded-lg">
                <span>{product.brand.name}</span>
                <Button size="sm" variant="secondary" onClick={() => navigate(`/admin/brands/${product.brand.id}/edit`)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Description Frame */}
          <div className="p-4 rounded-lg shadow-inner bg-gray-50">
            <h3 className="mb-2 text-lg font-semibold">Mô tả sản phẩm</h3>
            <div dangerouslySetInnerHTML={{ __html: product.description || "<p>Chưa có mô tả</p>" }} />
          </div>

          {/* Reviews Frame */}
          {product.reviews?.length > 0 && (
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="mb-2 text-lg font-semibold">Đánh giá sản phẩm ({product.reviews.length})</h3>
              <div className="space-y-3 overflow-y-auto max-h-64">
                {product.reviews.map((r) => (
                  <div key={r.id} className="flex flex-col gap-1 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{r.userName || "Người dùng"}</span>
                      <span className="flex items-center gap-1 text-yellow-400">
                        {r.rating} <Star className="w-4 h-4" />
                      </span>
                    </div>
                    <p className="text-gray-700">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button onClick={() => navigate("/admin/products")} variant="secondary">Quay lại</Button>
            <Button onClick={() => navigate(`/admin/products/${product.id}/edit`)}>Chỉnh sửa</Button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative p-4 bg-white rounded-lg max-w-3xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute text-gray-600 top-2 right-2 hover:text-red-500"
              onClick={() => setShowImageModal(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <img src={selectedImage} alt={product.name} className="object-contain w-full h-[80vh] rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
}
