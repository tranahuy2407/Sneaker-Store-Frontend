import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/slices/userAuthSlice";
import logo from "../../../assets/sneaker-logo.jfif";

const Header = ({ onHeightChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const headerRef = useRef(null);

  const { isAuthenticated, user } = useSelector((state) => state.userAuth);

  useEffect(() => {
    if (headerRef.current) {
      onHeightChange(headerRef.current.offsetHeight);
    }
  }, [headerRef, onHeightChange]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header ref={headerRef} className="w-full bg-white shadow-md">
      {/* Top info */}
      <div className="flex justify-between w-full px-4 py-1 text-sm text-gray-700 border-b md:px-6">
        <div className="text-xs md:text-sm">
          <span>Hotline: 0968456761</span>
          <span className="ml-4 md:ml-6">Email: sneakerstore@gmail.com</span>
        </div>
        {!isAuthenticated && (
          <div className="flex gap-2 text-xs md:gap-4 md:text-sm">
            <button onClick={() => navigate("/register")} className="hover:underline">
              Đăng ký
            </button>
            <button onClick={() => navigate("/login")} className="hover:underline">
              Đăng nhập
            </button>
            <button onClick={() => navigate("/contact")} className="hover:underline">
              Liên hệ
            </button>
          </div>
        )}

        {isAuthenticated && (
          <div className="flex gap-2 text-xs md:gap-4 md:text-sm">
            <button 
              onClick={() => navigate("/profile")}
              className="font-medium text-blue-600 hover:underline"
            >
              {user?.name || "Tài khoản"}
            </button>

            <button 
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Đăng xuất
            </button>

            <button onClick={() => navigate("/contact")} className="hover:underline">
              Liên hệ
            </button>
          </div>
        )}
      </div>

      {/* Logo */}
      <div className="flex justify-center py-3 border-b md:py-4">
        <img
          src={logo}
          alt="Logo"
          className="cursor-pointer h-28 md:h-32"
          onClick={() => navigate("/")}
        />
      </div>
    </header>
  );
};

export default Header;
