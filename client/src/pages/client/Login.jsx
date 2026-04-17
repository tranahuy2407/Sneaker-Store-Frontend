import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible, AiOutlineGoogle } from "react-icons/ai";
import logo from "../../assets/sneaker-logo.jfif";
import WarningNotification from "@/components/WarningNotification";
import { loginUser, clearUserError, googleLogin } from "../../redux/slices/userAuthSlice";

export default function UserLogin() {
  const googleButtonRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");
  const location = useLocation();
  const from = location.state?.from || "/";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.userAuth
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (window.google && clientId) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
          itp_support: true,
          use_fedcm_for_prompt: true,
        });

        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            width: 320, 
            text: "signin_with",
            shape: "circle",
            logo_alignment: "left",
          });
        }
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const { credential } = response; 
      await dispatch(googleLogin(credential)).unwrap();
    } catch (err) {
      setWarningMsg(typeof err === 'string' ? err : "Đăng nhập Google thất bại");
      setShowWarning(true);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

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
    if (window.google && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      window.google.accounts.id.prompt(); 
    } else {
      setWarningMsg("Chưa cấu hình Google Client ID (VITE_GOOGLE_CLIENT_ID) trong .env");
      setShowWarning(true);
    }
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
              autoComplete="email"
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
              autoComplete="current-password"
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

          {/* Separator */}
          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400">Hoặc</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Login container */}
          <div className="flex justify-center w-full">
            <div ref={googleButtonRef}></div>
          </div>
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

      {showWarning && (
        <WarningNotification 
          message={warningMsg} 
          onClose={() => setShowWarning(false)} 
        />
      )}
    </div>
  );
}
