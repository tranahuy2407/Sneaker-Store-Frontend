import React, { useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaSearch, FaShoppingCart, FaHeart } from "react-icons/fa";
import { logoutUser } from "../../../redux/slices/userAuthSlice";
import logo from "../../../assets/sneaker-logo.jfif";
import categoryAPI from "@/api/category.api";
import { useCart } from "../../../context/CartProvider";

const Header = ({ onHeightChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const headerRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [categories, setCategories] = useState([]);
  const { cart } = useCart();
  const safeCart = Array.isArray(cart) ? cart : [];
  const cartCount = safeCart.reduce((sum, item) => sum + item.quantity, 0);

  const { isAuthenticated, user } = useSelector((state) => state.userAuth);

  // Load categories for sticky menu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getAll({ limit: 7 });
        const cats = res.data?.data || [];
        setCategories(cats);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (headerRef.current && typeof onHeightChange === "function") {
      onHeightChange(headerRef.current.offsetHeight);
    }
  }, [headerRef, onHeightChange]);

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header 
      ref={headerRef} 
      className={`w-full bg-white shadow-md transition-all duration-300 z-50 ${
        isSticky 
          ? 'fixed top-0 left-0 right-0 shadow-lg animate-slide-down' 
          : 'relative'
      }`}
    >
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
      <div className={`flex justify-center border-b transition-all duration-300 ${isSticky ? 'py-2 md:py-3' : 'py-3 md:py-4'}`}>
        <img
          src={logo}
          alt="Logo"
          className={`cursor-pointer transition-all duration-300 ${isSticky ? 'h-14 md:h-16' : 'h-28 md:h-32'}`}
          onClick={() => navigate("/")}
        />
      </div>

      {/* Sticky Category Menu with Icons */}
      {isSticky && categories.length > 0 && (
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center">
              {/* Spacer left - để căn giữa */}
              <div className="w-24 hidden md:block"></div>

              {/* Categories - CENTERED */}
              <ul className="flex items-center justify-center gap-4 md:gap-8 text-sm font-medium text-gray-700 overflow-x-auto flex-1">
                {categories.map((cat) => (
                  <li key={cat.id} className="whitespace-nowrap">
                    <Link 
                      to={`/danh-muc/${cat.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Icons - RIGHT */}
              <div className="flex items-center gap-4 pl-4 border-l w-24 justify-end">
                {/* Search */}
                <button 
                  onClick={() => navigate("/search")}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  title="Tìm kiếm"
                >
                  <FaSearch size={18} />
                </button>

                {/* Favorites */}
                <button 
                  onClick={() => navigate("/favorites")}
                  className="text-gray-600 hover:text-red-500 transition-colors"
                  title="Yêu thích"
                >
                  <FaHeart size={18} />
                </button>

                {/* Cart */}
                <button 
                  onClick={() => navigate("/cart")}
                  className="relative text-gray-600 hover:text-blue-600 transition-colors"
                  title="Giỏ hàng"
                >
                  <FaShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for sticky animation */}
      <style>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;
