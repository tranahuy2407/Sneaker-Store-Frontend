import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearUserError } from "../../redux/slices/userAuthSlice";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible, AiOutlineGoogle } from "react-icons/ai";
import logo from "../../assets/sneaker-logo.jfif";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.userAuth
  );

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearUserError());

    if (!email || !password) {
      alert("Vui lòng nhập email và mật khẩu");
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/api/v1/user/auth/google";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-100">
      <div className="relative w-full max-w-xl p-10 overflow-hidden bg-white shadow-2xl rounded-3xl">

        {/* Decorative Circles */}
        <div className="absolute w-40 h-40 bg-blue-300 rounded-full -top-16 -left-16 mix-blend-multiply blur-3xl animate-pulse"></div>
        <div className="absolute bg-purple-200 rounded-full w-72 h-72 -bottom-20 -right-10 mix-blend-multiply blur-3xl animate-pulse"></div>

        {/* Header */}
        <div className="relative z-10 flex flex-col items-center mb-8">
          <img src={logo} alt="User Logo" className="mb-3 rounded-full shadow-md w-14 h-14" />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Sneaker<span className="text-blue-600">Store</span>
          </h1>
          <p className="mt-1 text-gray-500">Đăng nhập để mua sắm</p>
        </div>

        {/* Error */}
        {error && (
          <div className="relative z-10 p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              type="email"
              placeholder="example@gmail.com"
              className="w-full px-5 py-3 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100"
            />
          </div>

          {/* Password + Toggle */}
          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              className="w-full px-5 py-3 transition border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100"
            />

            {/* Eye Icon */}
            <span
              className="absolute text-xl text-gray-600 cursor-pointer right-4 top-10"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>

          {/* Forgot Password */}
          <div className="-mt-3 text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-blue-600 hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 text-lg font-bold text-white transition shadow-lg bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl hover:from-blue-600 hover:to-blue-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full py-3 mt-3 text-base font-medium bg-white border shadow-sm rounded-xl hover:bg-gray-100 active:scale-95"
          >
            <AiOutlineGoogle className="mr-2 text-xl text-red-500" />
            Đăng nhập với Google
          </button>
        </form>

        {/* Register Link */}
        <p className="relative z-10 mt-6 text-sm text-center text-gray-600">
          Chưa có tài khoản?{" "}
          <button
            onClick={() => navigate("/register")}
            className="font-semibold text-blue-600 hover:underline"
          >
            Đăng ký ngay
          </button>
        </p>

        {/* Footer */}
        <p className="relative z-10 mt-6 text-sm text-center text-gray-400">
          © {new Date().getFullYear()} SneakerStore — All rights reserved
        </p>
      </div>
    </div>
  );
}
