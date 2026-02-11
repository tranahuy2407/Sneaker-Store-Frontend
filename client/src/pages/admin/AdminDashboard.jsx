import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../redux/slices/authSlice";
import AdminLayout from "../../components/admin/AdminLayout";
import React, { useEffect, useState } from "react";
import productAPI from "@/api/product.api";
import orderAPI from "@/api/order.api";
import userAPI from "@/api/user.api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchOrder();
    fetchCustomers();
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
  
  const fetchOrder = async () => {
    try {
      const res = await orderAPI.getAll({ limit: 1000 });
      const orderList = res.data.data || [];     
      setStats((prev) => ({
        ...prev,
        totalOrders: orderList.length,
      }));
    } catch (err) {
      console.error("Dashboard error:", err.response?.data || err);
    }
  };
  
  const fetchCustomers = async () => {
    try {
      const res = await userAPI.getAllUsers({ limit: 1000 });
      const customerList = res.data.data || [];
      setStats((prev) => ({
        ...prev,
        totalCustomers: customerList.length,
      }));
    } catch (err) {

      console.error("Dashboard error:", err.response?.data || err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
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
