import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearUserError, googleLogin } from "../../redux/slices/userAuthSlice";
import Loading from "@/components/Loading";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible, AiOutlineGoogle } from "react-icons/ai";
import logo from "../../assets/sneaker-logo.jfif";
import SuccessNotification from "@/components/SuccessNotification";
import WarningNotification from "@/components/WarningNotification";

export default function Register() {
  const googleButtonRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");

  const { loading, isAuthenticated, error } = useSelector((state) => state.userAuth);

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
            text: "signup_with",
            shape: "pill",
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
      const { credential } = response; // This is the idToken
      await dispatch(googleLogin(credential)).unwrap();
    } catch (err) {
      setWarningMsg(typeof err === 'string' ? err : "Đăng ký Google thất bại");
      setShowWarning(true);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearUserError());

    if (!username || !email || !password || !confirmPassword) {
      setWarningMsg("Vui lòng nhập đầy đủ thông tin");
      setShowWarning(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setWarningMsg("Định dạng email không hợp lệ");
      setShowWarning(true);
      return;
    }

    if (password.length < 6) {
      setWarningMsg("Mật khẩu phải có ít nhất 6 ký tự");
      setShowWarning(true);
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      setWarningMsg("Mật khẩu nhập lại không khớp!");
      setShowWarning(true);
      return;
    }

    try {
      await dispatch(registerUser({ username, email, password })).unwrap();
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Đăng ký thất bại:", err);
    }
  };


  const handleGoogleRegister = () => {
    if (window.google && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      window.google.accounts.id.prompt(); 
    } else {
      setWarningMsg("Chưa cấu hình Google Client ID (VITE_GOOGLE_CLIENT_ID) trong .env");
      setShowWarning(true);
    }
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
               autoComplete="username"
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
               autoComplete="email"
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
               autoComplete="new-password"
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
               autoComplete="new-password"
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
            {loading ? <Loading variant="button" text="Đang tạo..." /> : "Đăng ký"}
          </button>

          {/* Separator */}
          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400">Hoặc</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google signup container */}
          <div className="flex justify-center w-full">
            <div ref={googleButtonRef}></div>
          </div>
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

      {showSuccess && (
        <SuccessNotification 
          message="Đăng ký tài khoản thành công! Đang chuyển hướng..." 
          onClose={() => setShowSuccess(false)} 
        />
      )}

      {showWarning && (
        <WarningNotification 
          message={warningMsg} 
          onClose={() => setShowWarning(false)} 
        />
      )}
    </div>
  );
}
