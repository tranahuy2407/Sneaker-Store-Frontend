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

  const shouldRedirect = error || (!isAuthenticated && !localAuth.token && !localAuth.user);

  if (shouldRedirect) {
    console.log("[ProtectedRoute] Redirect to login", { error, isAuthenticated, hasToken: !!localAuth.token, hasUser: !!localAuth.user });
    return <Navigate to="/login" replace />;
  }

  return children;
}
