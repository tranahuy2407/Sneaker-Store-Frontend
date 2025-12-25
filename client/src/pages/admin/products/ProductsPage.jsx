import React, { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  RefreshCcw,
  Eye,
  Edit3,
  Trash2,
  Home,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import productAPI from "../../../api/product.api";
import categoryAPI from "../../../api/category.api";
import brandAPI from "../../../api/brand.api";
import {
  buildProductFilters,
  sortOptions,
} from "../../../helpers/productFilter";
import Breadcrumb from "../../../components/Breadcrumb";
import WarningModal from "../../../components/WarningModal";
import Pagination from "../../../components/Pagination";
import CustomTooltip from "../../../components/CustomTooltip";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [sort, setSort] = useState("");

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = Number(searchParams.get("limit")) || 15; 
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    (async () => {
      try {
        const c = await categoryAPI.getAll({ limit: 1000 });
        const b = await brandAPI.getAll({ limit: 1000 });
        setCategories(c.data?.data || []);
        setBrands(b.data?.data || []);
      } catch (error) {
        console.error("Lỗi load category/brand:", error);
      }
    })();
  }, []);

  // Fetch sản phẩm
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = buildProductFilters({
        search,
        status,
        brandId,
        sort,
        page,
        limit, 
      });

      const res = await productAPI.getAll(params);

      let data = res.data?.data?.data || [];

      if (categoryId) {
        data = data.filter((p) =>
          p.categories?.some((c) => String(c.id) === String(categoryId))
        );
      }

      setProducts(data);
      setTotalPages(res.data?.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi fetch sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit, search, status, categoryId, brandId, sort]);

  const handlePageChange = (newPage) => {
    const params = Object.fromEntries(searchParams.entries());
    params.page = newPage;
    params.limit = limit; 
    setSearchParams(params);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await productAPI.delete(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setWarningOpen(false);
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
    }
  };

  const formatPrice = (price) =>
    price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="w-full min-h-screen p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="mb-1 text-xl font-bold text-gray-800 sm:text-2xl">
            Quản Lý Sản Phẩm
          </h1>
          <p className="text-sm text-gray-500">
            Quản lý toàn bộ sản phẩm hiển thị trong hệ thống
          </p>
        </div>

        <Breadcrumb
          items={[
            {
              label: "Trang chủ",
              icon: <Home className="w-4 h-4" />,
              href: "/admin/dashboard",
            },
            { label: "Sản phẩm", icon: <Package className="w-4 h-4" /> },
          ]}
        />
      </div>

      {/* Main Box */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow hover:scale-[1.01] transition-all duration-200">
        {/* Header + buttons */}
        <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            Danh Sách Sản Phẩm
          </h2>

          <div className="flex gap-3">
            <CustomTooltip text="Thêm sản phẩm mới">
              <button
                onClick={() => navigate("/admin/products/add")}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white transition bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105"
              >
                <Plus size={16} /> Thêm sản phẩm
              </button>
            </CustomTooltip>

            <CustomTooltip text="Làm mới danh sách sản phẩm">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:scale-105 transition ${
                  refreshing
                    ? "bg-blue-100 text-blue-600 border-blue-300"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <RefreshCcw
                  size={16}
                  className={refreshing ? "animate-spin text-blue-500" : ""}
                />
                {refreshing ? "Đang làm mới..." : "Làm mới"}
              </button>
            </CustomTooltip>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 mb-6 border rounded-lg bg-gray-50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {/* SEARCH */}
              <div className="flex w-full overflow-hidden border rounded-md sm:w-64">
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  className="flex-1 px-3 py-2 text-sm outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="flex items-center px-3 text-gray-400">
                  <Search size={16} />
                </div>
              </div>

              {/* CATEGORY */}
              <select
                className="px-3 py-2 text-sm border rounded-md sm:w-48"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* BRAND */}
              <select
                className="px-3 py-2 text-sm border rounded-md sm:w-48"
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
              >
                <option value="">Tất cả thương hiệu</option>
                {brands.map((b) => (
                  <option key={b.id} value={String(b.id)}>
                    {b.name}
                  </option>
                ))}
              </select>

              {/* SORT */}
              <select
                className="px-3 py-2 text-sm border rounded-md sm:w-48"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {sortOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              {/* STATUS */}
              <select
                className="px-3 py-2 text-sm border rounded-md sm:w-48"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Active">Hoạt động</option>
                <option value="Inactive">Ẩn</option>
              </select>
            </div>

            <CustomTooltip text="Xóa tất cả bộ lọc">
              <button
                onClick={() => {
                  setSearch("");
                  setStatus("");
                  setCategoryId("");
                  setBrandId("");
                  setSort("");
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 transition border rounded-md hover:bg-gray-100 hover:scale-105"
              >
                <Filter size={16} />
                Xóa
              </button>
            </CustomTooltip>
          </div>
        </div>

       {/* Table */}
       <div className="overflow-x-hidden">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-600 uppercase bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3">Thương hiệu</th>
                <th className="px-4 py-3">Giá gốc</th>
                <th className="px-4 py-3">Giá giảm</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    <RefreshCcw className="inline w-4 h-4 mr-2 text-blue-500 animate-spin" />
                    Đang tải sản phẩm...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr
                    key={p.id}
                    className="transition border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 font-medium">
                        <img
                          src={
                            p.images?.find((img) => img.isDefault)?.url ||
                            "/default-product.jpg"
                          }
                          alt={p.name}
                          className="object-cover w-12 h-12 border rounded-md"
                        />
                        {p.name}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {p.categories
                        ? Array.isArray(p.categories)
                          ? p.categories.map((c) => c.name).join(", ")
                          : p.categories.name
                        : "—"}
                    </td>

                    <td className="px-4 py-3">{p.brand?.name || "—"}</td>

                    <td className="px-4 py-3 font-semibold text-red-600">
                      {formatPrice(p.price)}
                    </td>

                    <td className="px-4 py-3 font-semibold text-green-600">
                      {p.discountPrice && p.discountPrice > 0
                        ? formatPrice(p.discountPrice)
                        : "—"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          p.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.status === "Active" ? "Hoạt động" : "Ẩn"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-3">
                        <CustomTooltip text="Xem chi tiết">
                          <button
                            onClick={() => navigate(`/admin/products/${p.id}`)}
                            className="p-2 text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-200"
                          >
                            <Eye size={16} />
                          </button>
                        </CustomTooltip>

                        <CustomTooltip text="Chỉnh sửa sản phẩm">
                          <button
                            onClick={() =>
                              navigate(`/admin/products/${p.id}/edit`)
                            }
                            className="p-2 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200"
                          >
                            <Edit3 size={16} />
                          </button>
                        </CustomTooltip>

                        <CustomTooltip text="Xóa sản phẩm">
                          <button
                            onClick={() => {
                              setProductToDelete(p);
                              setWarningOpen(true);
                            }}
                            className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </CustomTooltip>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    Không có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Delete Modal */}
      <WarningModal
        open={warningOpen}
        title="Xóa sản phẩm"
        message={`Bạn có chắc muốn xóa sản phẩm "${productToDelete?.name}"?`}
        onCancel={() => setWarningOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
