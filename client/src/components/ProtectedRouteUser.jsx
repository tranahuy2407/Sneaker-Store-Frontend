import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "./Loading";

export default function ProtectedRouteUser({ children }) {
  const { isAuthenticated, checkingAuth } = useSelector((state) => state.userAuth);

  if (checkingAuth) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
