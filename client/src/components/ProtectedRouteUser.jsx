import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "./Loading";

export default function ProtectedRouteUser({ children }) {
  const { isAuthenticated, checkingAuth } = useSelector((state) => state.userAuth);

  // Kiểm tra localStorage để tránh redirect ngay khi reload trang mobile
  const hasToken = !!localStorage.getItem("accessToken");

  // Nếu đang kiểm tra auth và có token trong localStorage, chờ kiểm tra xong
  if (checkingAuth && hasToken) {
    return <Loading />;
  }

  // Nếu không có token và không xác thực, redirect về login
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
