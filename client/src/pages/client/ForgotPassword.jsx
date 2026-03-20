import React, { useState } from "react";
import { userAPI } from "@/api/user.api";
import { Link } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";
import logo from "@/assets/sneaker-logo.jfif";
import SuccessNotification from "@/components/SuccessNotification";
import WarningNotification from "@/components/WarningNotification";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Định dạng email không hợp lệ");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await userAPI.forgotPassword(email);
      if (res.data.status === "success") {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-100">
      <div className="relative w-full max-w-md p-10 overflow-hidden bg-white shadow-2xl rounded-3xl">
        {/* Decorative Circles */}
        <div className="absolute w-40 h-40 bg-blue-300 rounded-full -top-16 -left-16 mix-blend-multiply blur-3xl opacity-50"></div>
        <div className="absolute bg-purple-200 rounded-full w-64 h-64 -bottom-20 -right-10 mix-blend-multiply blur-3xl opacity-50"></div>

        <div className="relative z-10 flex flex-col items-center mb-8 text-center">
          <img src={logo} alt="Logo" className="mb-4 rounded-full shadow-md w-16 h-16" />
          <h1 className="text-2xl font-black text-gray-900 mb-2">Quên mật khẩu?</h1>
          <p className="text-gray-500 text-sm">
            Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn để đặt lại mật khẩu.
          </p>
        </div>

        {success ? (
          <div className="relative z-10 p-6 bg-green-50 border border-green-200 rounded-2xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <AiOutlineMail size={32} />
            </div>
            <h2 className="text-xl font-bold text-green-800 mb-2">Đã gửi email!</h2>
            <p className="text-green-700 text-sm mb-6">
              Vui lòng kiểm tra hộp thư đến của bạn để biết link đặt lại mật khẩu.
            </p>
            <Link 
              to="/login" 
              className="inline-block px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200"
            >
              Quay lại Đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700 ml-1">
                Địa chỉ Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                />
                <AiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium ml-1">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Đang gửi..." : "Gửi link khôi phục"}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors underline decoration-blue-200 underline-offset-4">
                Quay lại Đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
      
      {success && <SuccessNotification message="Link khôi phục đã được gửi!" onClose={() => setSuccess(false)} />}
      {error && <WarningNotification message={error} onClose={() => setError("")} />}
    </div>
  );
};

export default ForgotPassword;
