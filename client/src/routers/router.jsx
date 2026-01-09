import { Navigate } from "react-router-dom";
import Home from "../pages/client/Home.jsx";
import AdminLogin from "../pages/admin/AdminLogin.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import ProductsPage from "../pages/admin/products/ProductsPage.jsx";
import AddProductPage from "../pages/admin/products/AddProductPage.jsx";
import CategoriesPage from "../pages/admin/categories/CategoriesPage.jsx";
import AddCategoryPage from "../pages/admin/categories/AddCategoryPage.jsx";
import BrandsPage from "../pages/admin/brands/BrandsPage.jsx";
import AddBrandPage from "../pages/admin/brands/AddBrandPage.jsx";
import OrdersPage from "../pages/admin/orders/OrdersPage.jsx";
import CustomersPage from "../pages/admin/customers/CustomersPage.jsx";
import InventoryPage from "../pages/admin/warehouse/InventoryPage.jsx";
import WarehouseHistoryPage from "../pages/admin/warehouse/WarehouseHistoryPage.jsx";
import InvoicesPage from "../pages/admin/invoices/InvoicesPage.jsx";
import PaymentMethodsPage from "../pages/admin/payment/PaymentMethodsPage.jsx";
import PromotionsPage from "../pages/admin/promotions/PromotionsPage.jsx";
import EditCategoryPage from "../pages/admin/categories/EditCategoryPage.jsx";
import CategoryDetailPage from "../pages/admin/categories/CategoryDetailPage.jsx";
import EditBrandPage from "../pages/admin/brands/EditBrandPage.jsx";
import BrandDetailPage from "../pages/admin/brands/BrandDetailPage.jsx";
import UpdateProductPage from "@/pages/admin/products/UpdateProductPage.jsx";
import ProductDetailPage from "@/pages/admin/products/ProductDetailPage.jsx";
import ProtectedRouteUser from "@/components/ProtectedRouteUser.jsx";
import Login from "@/pages/client/Login.jsx";
import ProfilePage from "@/pages/client/ProfilePage.jsx";
import Register from "@/pages/client/Register.jsx";
import CartPage from "@/pages/client/CartPage.jsx";
import ProductDetail from "@/pages/client/ProductDetail.jsx";
import CategoryPage from "@/pages/client/CategoryPage.jsx";
import SearchPage from "@/pages/client/SearchPage.jsx";
import CheckoutPage from "@/pages/client/CheckoutPage.jsx";
import ShippingCostPage from "@/pages/admin/shipping-costs/ShippingCostPage.jsx";
import OrderDetailPage from "@/pages/admin/orders/OrderDetailPage.jsx";
import OrderTrackingPage from "@/pages/client/OrderTrackingPage.jsx";

export const routes = [
  //Client 
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <Login />,
  },
    {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRouteUser>
        <ProfilePage />
      </ProtectedRouteUser>
    ),
  },
  {
    path:"/orders/:id/tracking",
    element:(
        <ProtectedRouteUser>
          <OrderTrackingPage />
        </ProtectedRouteUser>
    )
  },
  {
    path:"/cart",
    element:(
        <CartPage />
    )
  },
  {
    path: "/san-pham/:slug",
    element: <ProductDetail />,
  },
  {
    path: "/danh-muc/:slug",
    element: <CategoryPage /> 
  },
  {
      path: "/search",
      element: <SearchPage />  
    },
    {
      path: "/checkout",
      element: <CheckoutPage />
    },
    
  // Admin Dashboard Routes
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },

  // ============ QUẢN LÝ SẢN PHẨM ============

  // Products Routes
  {
    path: "/admin/products",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <ProductsPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/products/add",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <AddProductPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/products/:productId/edit",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <UpdateProductPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/products/:productId",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <ProductDetailPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },

  // Warehouse Routes
  {
    path: "/admin/warehouse/inventory",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <InventoryPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/warehouse/history",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <WarehouseHistoryPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },

  // Promotions Routes
  {
    path: "/admin/promotions",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <PromotionsPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },

  // ============ QUẢN LÝ BÁN HÀNG ============

  // Orders Routes
  {
    path: "/admin/orders",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <OrdersPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/orders/:id",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <OrderDetailPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  // Invoices Routes
  {
    path: "/admin/invoices",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <InvoicesPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },

  // Payment Methods Routes
  {
    path: "/admin/payment-methods",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <PaymentMethodsPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/shipping-costs",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <ShippingCostPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },

  // Customers Routes
  {
    path: "/admin/customers",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <CustomersPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },

  // ============ THUỘC TÍNH SẢN PHẨM ============

  // Categories Routes
  {
    path: "/admin/categories",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <CategoriesPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/categories/add",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <AddCategoryPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/categories/:categoryId",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <CategoryDetailPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/categories/:categoryId/edit",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <EditCategoryPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },

  // Brands Routes
  {
    path: "/admin/brands",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <BrandsPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/brands/add",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <AddBrandPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/brands/:brandId/edit",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <EditBrandPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/brands/:brandId",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <BrandDetailPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },

  // Catch all - redirect to home
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
