import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from "recharts";
import dashboardAPI from "@/api/dashboard.api";
import { toast } from "react-toastify";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const STATUS_ICONS = {
  "Pending": <Clock size={16} className="text-yellow-500" />,
  "Confirmed": <CheckCircle size={16} className="text-blue-500" />,
  "Processing": <Truck size={16} className="text-purple-500" />,
  "Shipping": <Truck size={16} className="text-indigo-500" />,
  "Delivered": <CheckCircle size={16} className="text-green-500" />,
  "Completed": <CheckCircle size={16} className="text-emerald-500" />,
  "Cancelled": <XCircle size={16} className="text-red-500" />,
  "Refunded": <XCircle size={16} className="text-gray-500" />,
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    overview: {
      total_revenue: 0,
      total_orders: 0,
      total_users: 0,
      total_products: 0,
    },
    category_stats: [],
    brand_stats: [],
    recent_orders: [],
  });
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [chartType, setChartType] = useState("daily");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchRevenue();
  }, [chartType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, topProductsRes] = await Promise.all([
        dashboardAPI.getStatistics(),
        dashboardAPI.getTopProducts(5)
      ]);

      if (statsRes.data.status === "success") {
        setStats(statsRes.data.data);
      }
      if (topProductsRes.data.status === "success") {
        setTopProducts(topProductsRes.data.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu dashboard:", err);
      toast.error("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenue = async () => {
    try {
      const res = await dashboardAPI.getRevenueChart(chartType);
      if (res.data.status === "success") {
        setRevenueData(res.data.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu biểu đồ:", err);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
          <p className="text-gray-500 text-sm">Chào mừng bạn trở lại, Sneaker Store Admin.</p>
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Tổng doanh thu" 
            value={formatCurrency(stats.overview.total_revenue)} 
            icon={<DollarSign className="text-emerald-600" />} 
            color="bg-emerald-50 border-emerald-100"
            trend="+12.5%"
          />
          <StatCard 
            title="Tổng đơn hàng" 
            value={stats.overview.total_orders} 
            icon={<ShoppingBag className="text-blue-600" />} 
            color="bg-blue-50 border-blue-100"
            trend="+5.2%"
          />
          <StatCard 
            title="Khách hàng mới" 
            value={stats.overview.total_users} 
            icon={<Users className="text-purple-600" />} 
            color="bg-purple-50 border-purple-100"
            trend="+3.1%"
          />
          <StatCard 
            title="Sản phẩm đang bán" 
            value={stats.overview.total_products} 
            icon={<Package className="text-orange-600" />} 
            color="bg-orange-50 border-orange-100"
            trend="+0.8%"
          />
        </div>

        {/* REVENUE CHART - FULL WIDTH */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500" />
                Biểu đồ doanh thu
              </h3>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setChartType("daily")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${chartType === "daily" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Ngày
                </button>
                <button 
                  onClick={() => setChartType("monthly")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${chartType === "monthly" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Tháng
                </button>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey={chartType === "daily" ? "date" : "month"} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: '#9ca3af'}}
                    dy={10}
                    tickFormatter={(val) => chartType === "daily" ? val.split('-').slice(2).join('/') : val}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: '#9ca3af'}}
                    tickFormatter={(val) => val >= 1000000 ? `${(val/1000000).toFixed(1)}M` : val}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(val) => [formatCurrency(val), "Doanh thu"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CATEGORY SALES BAR CHART */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Doanh số theo danh mục
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={stats.category_stats?.map(item => ({
                      name: item.name || "Chưa phân loại",
                      count: Number(item.count || 0)
                    }))}
                    margin={{ left: 20, right: 30, top: 0, bottom: 0 }}
                  >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{fontSize: 12, fill: '#4b5563'}}
                    width={100}
                  />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BRAND SALES PIE CHART */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6">Tỷ trọng thương hiệu</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.brand_stats?.map(item => ({
                        name: item.name || "Khác",
                        value: Number(item.count || 0)
                      }))}
                      cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {stats.brand_stats?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} sản phẩm`, "Đã bán"]} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TOP PRODUCTS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Sản phẩm bán chạy</h3>
              <button className="text-blue-600 text-sm font-semibold hover:underline">Xem tất cả</button>
            </div>
            <div className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 font-semibold">Tên sản phẩm</th>
                    <th className="px-6 py-3 font-semibold">Giá</th>
                    <th className="px-6 py-3 font-semibold text-center">Đã bán</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topProducts.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.product?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(item.product?.price)}</td>
                      <td className="px-6 py-4 text-sm text-center font-bold text-blue-600">{item.total_sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RECENT ORDERS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Đơn hàng gần đây</h3>
              <button className="text-blue-600 text-sm font-semibold hover:underline">Quản lý đơn hàng</button>
            </div>
            <div className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 font-semibold">Mã đơn</th>
                    <th className="px-6 py-3 font-semibold">Khách hàng</th>
                    <th className="px-6 py-3 font-semibold">Tổng tiền</th>
                    <th className="px-6 py-3 font-semibold">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recent_orders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">#{order.order_code}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.receiver_name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{formatCurrency(order.total_amount)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="flex items-center gap-1.5 font-medium">
                          {STATUS_ICONS[order.status]}
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon, color, trend }) {
  const isPositive = trend.startsWith("+");
  return (
    <div className={`p-6 rounded-2xl shadow-sm border ${color} transition-all hover:shadow-md group`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}
