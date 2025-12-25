import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "./Loading";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, checkingAuth } = useSelector((state) => state.auth);

  if (checkingAuth) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
