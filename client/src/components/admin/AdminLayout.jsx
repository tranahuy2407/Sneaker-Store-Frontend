import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import AdminNotificationBell from "@/components/admin/AdminNotificationBell";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "@/redux/slices/authSlice";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutAdmin()).then(() => {
      navigate("/admin/login", { replace: true });
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* ===== HEADER (ALL PAGES) ===== */}
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded hover:bg-gray-100 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Admin Panel
              </h1>
              {user && (
                <p className="text-xs text-gray-500">
                  Xin chào, <b>{user.username}</b>
                </p>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <AdminNotificationBell />

            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? "Đang đăng xuất..." : "Đăng xuất"}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        pauseOnHover
        draggable
      />
    </div>
  );
}
