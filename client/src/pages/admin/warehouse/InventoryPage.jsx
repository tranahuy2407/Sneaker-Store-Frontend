import React, { useEffect, useState } from "react";
import { Search, ArrowUpDown, ArrowUpCircle, Layers, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import productAPI from "../../../api/product.api";
import warehouseHistoryAPI from "../../../api/warehouseHistory.api";
import { Button } from "../../../components/Button";
import defaultImage from "../../../assets/default.jpg";
import Breadcrumb from "@/components/Breadcrumb";
import InventoryModal from "@/components/InventoryModal";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();
  const admin = useSelector((state) => state.auth.user);

  const fetchInventory = async () => {
    try {
      const res = await productAPI.getAll({ limit: 1000 });
      const products = res.data.data.data;
      const mapped = products.map((p) => ({
        id: p.id,
        name: p.name,
        image: p.images?.find((i) => i.isDefault)?.url || defaultImage,
        category: p.categories?.map((c) => c.name).join(", "),
        brand: p.brand?.name,
        sizes: p.sizes || [],   
        stock: (p.sizes || []).reduce((sum, s) => sum + (s.stock || 0), 0),
        sold: p.sold || 0,
        status: p.status,
      }));
      console.log(mapped)
      setInventory(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter((item) => {
    if (filter === "low" && item.stock > 10) return false;
    if (filter === "out" && item.stock > 0) return false;
    if (filter === "active" && item.status !== "Active") return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    if (!sortField) return 0;
    if (sortOrder === "asc") return a[sortField] > b[sortField] ? 1 : -1;
    return a[sortField] < b[sortField] ? 1 : -1;
  });

  const paginated = sortedInventory.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(sortedInventory.length / pageSize);

  const handleSubmitStock = async (changes) => {
    if (!admin || !admin.id) {
      alert("Không tìm thấy thông tin admin!");
      return;
    }
    try {
      setUpdating(true);

      for (const { size_id, change_quantity } of changes) {
        await warehouseHistoryAPI.create({
          size_id,
          change_quantity,
          admin_id: admin.id,
        });
      }

      await fetchInventory();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Lỗi khi cập nhật kho!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="flex flex-col justify-between gap-4 mb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Tổng Kho Sản Phẩm</h1>
          <p className="text-gray-500">Theo dõi tồn kho & hiệu suất</p>
        </div>
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/admin", icon: <Home className="w-4 h-4" /> },
            { label: "Quản lý kho", icon: <Layers className="w-4 h-4" /> },
          ]}
        />
      </div>

      <div className="overflow-x-auto bg-white border shadow rounded-xl">
        <table className="min-w-full table-auto border-collapse">
          <thead className="sticky top-0 bg-gray-100">
            <tr className="font-semibold text-gray-600 text-sm">
              <th className="p-3 w-[200px] cursor-pointer" onClick={() => handleSort("name")}>
                Sản phẩm <ArrowUpDown className="inline w-4" />
              </th>
              <th className="p-3 w-[150px] hidden sm:table-cell">Danh mục</th>
              <th className="p-3 w-[130px] hidden md:table-cell">Thương hiệu</th>
              <th className="p-3 w-[100px] cursor-pointer">Tồn kho</th>
              <th className="p-3 w-[120px] hidden md:table-cell">Trạng thái</th>
              <th className="p-3 text-center w-[160px]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item) => (
              <tr key={item.id} className="transition border-t hover:bg-gray-50 text-sm">
                <td className="p-2 flex items-center gap-2 whitespace-nowrap overflow-hidden">
                  <div className="relative group flex-shrink-0">
                    <img src={item.image} className="object-cover border rounded-md w-12 h-12 sm:w-14 sm:h-14" />
                  </div>
                  <span className="font-semibold truncate max-w-[120px] sm:max-w-[200px]">{item.name}</span>
                </td>
                <td className="p-2 text-center text-ellipsis overflow-hidden whitespace-nowrap hidden sm:table-cell">
                  {item.category || "-"}
                </td>
                <td className="p-2 text-center text-ellipsis overflow-hidden whitespace-nowrap hidden md:table-cell">
                  {item.brand || "-"}
                </td>
               <td className="p-2 text-center">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          item.stock === 0
                            ? "bg-red-100 text-red-700"
                            : item.stock < 10
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        } inline-block`}
                        style={{ minWidth: "2rem", textAlign: "center" }}
                      >
                        {item.stock}
                      </span>
                    </td>


                <td className="p-2 text-center md:table-cell">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                    } inline-block w-full text-center`}
                  >
                    {item.status === "Active" ? "Đang bán" : "Ẩn"}
                  </span>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <div className="flex flex-wrap justify-center gap-1">
                    <button
                      className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-gray-100 hover:bg-gray-200 transition"
                      onClick={() => {
                        setSelectedProduct(item);
                        setOpenModal(true);
                      }}
                    >
                      <ArrowUpCircle className="w-4 h-4" /> Nhập
                    </button>
                    <button
                      className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-gray-100 hover:bg-gray-200 transition"
                      onClick={() => navigate(`/admin/products/${item.id}`)}
                    >
                      <Layers className="w-4 h-4" /> Chi tiết
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-6">
        <Button size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
          Trang trước
        </Button>
        <span className="px-3 py-2 border rounded-lg bg-white text-sm">
          {page} / {totalPages}
        </span>
        <Button size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Trang sau
        </Button>
      </div>

      <InventoryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        product={selectedProduct}
        loading={updating}
        onSubmit={handleSubmitStock}
      />
    </div>
  );
}
