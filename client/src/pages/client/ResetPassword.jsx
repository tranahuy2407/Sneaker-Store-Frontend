import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { userAPI } from "@/api/user.api";
import { AiFillEye, AiFillEyeInvisible, AiOutlineLock, AiOutlineCheckCircle } from "react-icons/ai";
import logo from "@/assets/sneaker-logo.jfif";
import SuccessNotification from "@/components/SuccessNotification";
import WarningNotification from "@/components/WarningNotification";

const ResetPassword = () => {
  const { token: pathToken } = useParams();
  const [searchParams] = useSearchParams();
  const queryToken = searchParams.get("token");
  const token = pathToken || queryToken;

  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Token không hợp lệ hoặc đã hết hạn");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Token không hợp lệ hoặc đã hết hạn");
      return;
    }
    if (!password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password.trim() !== confirmPassword.trim()) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await userAPI.resetPassword(token, password);
      if (res.data.status === "success") {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Link đã hết hạn hoặc không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-100">
      <div className="relative w-full max-w-md p-10 overflow-hidden bg-white shadow-2xl rounded-3xl">
        {/* Decorative elements */}
        <div className="absolute w-40 h-40 bg-blue-300 rounded-full -top-20 -right-20 mix-blend-multiply blur-3xl opacity-50"></div>
        <div className="absolute bg-purple-200 rounded-full w-64 h-64 -bottom-30 -left-20 mix-blend-multiply blur-3xl opacity-50"></div>

        <div className="relative z-10 flex flex-col items-center mb-8 text-center">
          <img src={logo} alt="Logo" className="mb-4 rounded-full shadow-md w-16 h-16" />
          <h1 className="text-2xl font-black text-gray-900 mb-2">Đặt lại mật khẩu</h1>
          <p className="text-gray-500 text-sm">
            Vui lòng nhập mật khẩu mới để bảo mật tài khoản của bạn.
          </p>
        </div>

        {success ? (
          <div className="relative z-10 p-8 bg-blue-50 border border-blue-100 rounded-2xl text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 animate-bounce">
              <AiOutlineCheckCircle size={36} />
            </div>
            <h2 className="text-xl font-black text-blue-900 mb-2">Thành công!</h2>
            <p className="text-blue-700 text-sm mb-6">
              Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển hướng đến trang đăng nhập trong giây lát...
            </p>
            <Link 
              to="/login" 
              className="inline-block px-10 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Đăng nhập ngay
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700 ml-1">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-3 pl-12 pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                  />
                  <AiOutlineLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <span
                    className="absolute text-xl text-gray-600 cursor-pointer right-4 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </span>
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-bold text-gray-700 ml-1">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-3 pl-12 pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                  />
                  <AiOutlineLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <span
                    className="absolute text-xl text-gray-600 cursor-pointer right-4 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </span>
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium ml-1 bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
            >
              {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
            </button>
          </form>
        )}
      </div>
      
      {success && <SuccessNotification message="Đặt lại mật khẩu thành công!" onClose={() => setSuccess(false)} />}
      {error && <WarningNotification message={error} onClose={() => setError("")} />}
    </div>
  );
};

export default ResetPassword;
