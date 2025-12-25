import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import brandAPI from "../../../api/brand.api";
import { Home, Tag, X, Edit } from "lucide-react";
import Breadcrumb from "../../../components/Breadcrumb";
import { Button } from "../../../components/Button";
import defaultImage from "../../../assets/default.jpg";

export default function BrandDetailPage() {
  const { brandId } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await brandAPI.getById(brandId);
        setBrand(res.data.data);

        // Nếu có API lấy sản phẩm theo brand:
        if (brandAPI.getBrandProducts) {
          const prodRes = await brandAPI.getBrandProducts(brandId);
          setProducts(prodRes.data.data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrand();
  }, [brandId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">Thương hiệu không tồn tại.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen p-6 bg-gray-50">
      {/* Breadcrumb */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chi Tiết Thương Hiệu</h1>
          <p className="text-gray-500">Thông tin chi tiết thương hiệu</p>
        </div>
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/admin", icon: <Home className="w-4 h-4" /> },
            { label: "Thương hiệu", href: "/admin/brands", icon: <Tag className="w-4 h-4" /> },
            { label: "Chi tiết", icon: <Edit className="w-4 h-4" /> },
          ]}
        />
      </div>

      {/* Thông tin thương hiệu */}
      <div className="p-6 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <img
            src={brand.image || defaultImage}
            alt={brand.name || "Default Brand"}
            className="object-cover w-64 h-64 rounded-lg cursor-pointer hover:opacity-80"
            onClick={() => setShowImageModal(true)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h2 className="text-sm text-gray-500">Tên thương hiệu</h2>
            <p className="text-lg font-medium text-gray-800">{brand.name}</p>
          </div>
          <div>
            <h2 className="text-sm text-gray-500">Slug</h2>
            <p className="font-medium text-gray-800">{brand.slug}</p>
          </div>
          <div>
            <h2 className="text-sm text-gray-500">Trạng thái</h2>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                brand.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {brand.status === "Active" ? "Hoạt động" : "Ẩn"}
            </span>
          </div>
          <div>
            <h2 className="text-sm text-gray-500">Ngày tạo</h2>
            <p className="text-gray-800">
              {new Date(brand.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate("/admin/brands")}>
            Quay lại
          </Button>
          <Button onClick={() => navigate(`/admin/brands/${brand.id}/edit`)}>
            Chỉnh sửa
          </Button>
        </div>
      </div>

      {/* Bảng sản phẩm thuộc brand */}
      {products.length > 0 && (
        <div className="p-6 mt-8 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-lg font-bold text-gray-800">
            Sản phẩm thuộc thương hiệu
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Ảnh</th>
                  <th className="px-4 py-2 border">Tên sản phẩm</th>
                  <th className="px-4 py-2 border">Giá</th>
                  <th className="px-4 py-2 border">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">
                      <img
                        src={p.imageUrl || defaultImage}
                        alt={p.name}
                        className="object-cover w-16 h-16 rounded"
                      />
                    </td>
                    <td className="px-4 py-2 border">{p.name}</td>
                    <td className="px-4 py-2 border">
                      {p.price?.toLocaleString()} VND
                    </td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                          p.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {p.status === "Active" ? "Hoạt động" : "Ẩn"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
              src={brand.image || defaultImage}
              alt={brand.name || "Default Brand"}
              className="object-contain w-full h-[80vh] rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}
