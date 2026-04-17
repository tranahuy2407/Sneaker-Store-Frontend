import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function ProtectedRouteUser({ children }) {
  const { isAuthenticated, checkingAuth, error } = useSelector((state) => state.userAuth);
  const [localAuth, setLocalAuth] = useState({ token: null, user: null, checked: false });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");
    let user = null;
    try {
      if (userData && userData !== "undefined") {
        user = JSON.parse(userData);
      }
    } catch (e) {
      console.error("[ProtectedRoute] Lỗi parse userData:", e);
    }
    setLocalAuth({ token, user, checked: true });
    console.log("[ProtectedRoute] localStorage:", { hasToken: !!token, hasUser: !!user });
  }, []);

  if (checkingAuth) {
    console.log("[ProtectedRoute] Đang kiểm tra auth...");
    return <Loading />;
  }

  if (!localAuth.checked) {
    return <Loading />;
  }

  if (isAuthenticated) {
    console.log("[ProtectedRoute] Đã xác thực (Redux)");
    return children;
  }

  if (localAuth.user && !error) {
    console.log("[ProtectedRoute] Có userData, cho phép truy cập (cookie-based)");
    return children;
  }

  const isAuthError = error === "Phiên đăng nhập hết hạn" || error === "Không xác thực";
  const hasNoIdentity = !isAuthenticated && !localAuth.token;

  if (isAuthError || (hasNoIdentity && localAuth.checked && !checkingAuth)) {
    console.log("[ProtectedRoute] Redirect to login", { error, isAuthenticated, hasToken: !!localAuth.token });
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  return children;
}
