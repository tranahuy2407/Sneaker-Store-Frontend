import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin, clearError } from "../../redux/slices/authSlice";
import Loading from "@/components/Loading";
import logo from "../../assets/sneaker-logo.jfif";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) navigate("/admin/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!username || !password) {
      alert("Vui lòng nhập username và password");
      return;
    }

    dispatch(loginAdmin({ username, password }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 via-white to-gray-100">
      <div className="relative w-full max-w-md p-10 overflow-hidden bg-white shadow-2xl rounded-3xl">
        {/* Decorative Gradient Circles */}
        <div className="absolute w-40 h-40 bg-yellow-200 rounded-full -top-16 -left-16 mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bg-pink-200 rounded-full -bottom-20 -right-10 w-72 h-72 mix-blend-multiply filter blur-3xl animate-pulse"></div>

        {/* Logo */}
        <div className="relative z-10 flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Sneaker Store Logo"
            className="mb-3 rounded-full shadow-md w-14 h-14"
          />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Sneaker<span className="text-yellow-500">Store</span> Admin
          </h1>
          <p className="mt-1 text-gray-500">Đăng nhập để quản lý cửa hàng</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="relative z-10 p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              placeholder="Nhập username"
              className="w-full px-5 py-3 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              className="w-full px-5 py-3 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 text-lg font-bold text-white transition shadow-lg bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl hover:from-yellow-500 hover:to-yellow-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loading variant="button" text="Đang đăng nhập..." /> : "Đăng nhập"}
          </button>
        </form>

        {/* Footer */}
        <p className="relative z-10 mt-8 text-sm text-center text-gray-400">
          © {new Date().getFullYear()} SneakerStore Admin — All rights reserved
        </p>
      </div>
    </div>
  );
}
