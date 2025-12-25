import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "./redux/slices/authSlice"; // admin
import { checkUserAuth  } from "./redux/slices/userAuthSlice"; // client
import Loading from "./components/Loading";
import { routes } from "./routers/router";
import CartPopup from "./pages/client/components/CartPopup";

function App() {
  const dispatch = useDispatch();
  const adminChecking = useSelector((state) => state.auth.checkingAuth);
  const userChecking = useSelector((state) => state.userAuth.checkUserAuth);

  useEffect(() => {
    dispatch(checkAuthStatus()); 
    dispatch(checkUserAuth());   
  }, [dispatch]);

  if (adminChecking || userChecking) {
    return <Loading />;
  }

 return (
  <>
    <CartPopup />
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  </>
);
}

export default App;
