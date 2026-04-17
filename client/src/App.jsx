import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "./redux/slices/authSlice"; 
import { checkUserAuth  } from "./redux/slices/userAuthSlice"; 
import Loading from "./components/Loading";
import { routes } from "./routers/router";
import CartPopup from "./pages/client/components/CartPopup";
import FloatingActions from "./pages/client/components/FloatingActions";

function App() {
  const dispatch = useDispatch();
  const adminChecking = useSelector((state) => state.auth.checkingAuth);
  const userChecking = useSelector((state) => state.userAuth.checkingAuth);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isAuthPath = ["/login", "/register"].includes(location.pathname);

  useEffect(() => {
    dispatch(checkAuthStatus()); 
    dispatch(checkUserAuth());   
  }, [dispatch]);

  if (adminChecking || userChecking) {
    return <Loading />;
  }

 return (
  <>
    {!isAdminPath && !isAuthPath && (
      <>
        <CartPopup />
        <FloatingActions />
      </>
    )}
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  </>
);
}

export default App;
