import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../redux/slices/authSlice";
import AdminLayout from "../../components/admin/AdminLayout";
import React, { useEffect, useState } from "react";
import productAPI from "@/api/product.api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productAPI.getAll({ limit: 1000 });
      const productList = res.data.data.data || []; 

      setStats((prev) => ({
        ...prev,
        totalProducts: productList.length,
      }));
    } catch (err) {
      console.error("Dashboard error:", err.response?.data || err);
    }
  };

  const handleLogout = () => {
    dispatch(logoutAdmin()).then(() => {
      navigate("/admin/login", { replace: true });
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            {user && (
              <p className="mt-1 text-sm text-gray-600">
                Xin chào, <span className="font-semibold">{user.username}</span>!
              </p>
            )}
          </div>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 text-white transition bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Đang đăng xuất..." : "Đăng xuất"}
          </button>
        </div>

        {/* DASHBOARD CARDS */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          
          <div className="p-6 bg-white rounded-lg shadow">
            <p className="text-sm text-gray-500">Tổng Sản Phẩm</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.totalProducts}
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <p className="text-sm text-gray-500">Đơn Hàng</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.totalOrders}
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <p className="text-sm text-gray-500">Khách Hàng</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.totalCustomers}
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <p className="text-sm text-gray-500">Doanh Thu</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.totalRevenue.toLocaleString()} VND
            </p>
          </div>
        </div>

        {/* WELCOME BOX */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            Chào mừng đến Sneaker Store Admin
          </h2>
          <p className="text-gray-600">
            Sử dụng menu bên trái để điều hướng đến các tính năng quản lý.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
