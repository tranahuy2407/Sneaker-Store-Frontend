import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearUserError } from "../../redux/slices/userAuthSlice";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible, AiOutlineGoogle } from "react-icons/ai";
import logo from "../../assets/sneaker-logo.jfif";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loading, error } = useSelector((state) => state.userAuth);

 const handleSubmit = async (e) => {
  e.preventDefault();
  dispatch(clearUserError());

  if (!username || !email || !password || !confirmPassword) {
    return alert("Vui lòng nhập đầy đủ thông tin");
  }

  if (password !== confirmPassword) {
    return alert("Mật khẩu nhập lại không khớp!");
  }

  try {
    await dispatch(registerUser({ username, email, password })).unwrap();
    navigate("/login");
  } catch (err) {
    console.error("Đăng ký thất bại:", err);
  }
};


  const handleGoogleRegister = () => {
    window.location.href = "http://localhost:8080/api/v1/user/auth/google";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-100">
      <div className="relative w-full max-w-xl p-12 overflow-hidden bg-white shadow-2xl md:max-w-xl rounded-3xl">
        
        {/* Vòng trang trí */}
        <div className="absolute w-40 h-40 bg-blue-300 rounded-full -top-12 -left-12 mix-blend-multiply blur-3xl animate-pulse"></div>
        <div className="absolute w-64 h-64 bg-purple-200 rounded-full -bottom-16 -right-10 mix-blend-multiply blur-3xl animate-pulse"></div>

        {/* Logo + Title */}
        <div className="relative z-10 mb-8 text-center">
          <img src={logo} alt="logo" className="w-16 h-16 mx-auto mb-3 rounded-full shadow-md" />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Tạo tài khoản <span className="text-blue-600">SneakerStore</span>
          </h1>
          <p className="mt-1 text-gray-500">Nhanh chóng & miễn phí</p>
        </div>

        {/* Error */}
        {error && (
          <div className="relative z-10 p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">

          {/* Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              disabled={loading}
              placeholder="Nguyễn Văn A"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="example@gmail.com"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          {/* Password */}
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
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-xl text-gray-600 cursor-pointer right-4 top-10"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Nhập lại mật khẩu
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />

            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute text-xl text-gray-600 cursor-pointer right-4 top-10"
            >
              {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>

          {/* Register button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 text-lg font-bold text-white shadow-lg bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl hover:from-blue-600 hover:to-blue-800 active:scale-95"
          >
            {loading ? "Đang tạo..." : "Đăng ký"}
          </button>

          {/* Google signup */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="flex items-center justify-center w-full py-3 mt-3 text-base font-medium bg-white border shadow-sm rounded-xl hover:bg-gray-100 active:scale-95"
          >
            <AiOutlineGoogle className="mr-2 text-xl text-red-500" />
            Đăng nhập với Google
          </button>
        </form>

        {/* Login link */}
        <p className="relative z-10 mt-6 text-sm text-center text-gray-600">
          Đã có tài khoản?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold text-blue-600 hover:underline"
          >
            Đăng nhập
          </button>
        </p>

        <p className="relative z-10 mt-6 text-sm text-center text-gray-400">
          © {new Date().getFullYear()} SneakerStore — All rights reserved
        </p>
      </div>
    </div>
  );
}
