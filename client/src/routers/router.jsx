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
import BrandPage from "@/pages/client/BrandPage.jsx";
import SearchPage from "@/pages/client/SearchPage.jsx";
import CheckoutPage from "@/pages/client/CheckoutPage.jsx";
import ShippingCostPage from "@/pages/admin/shipping-costs/ShippingCostPage.jsx";
import OrderDetailPage from "@/pages/admin/orders/OrderDetailPage.jsx";
import OrderTrackingPage from "@/pages/client/OrderTrackingPage.jsx";
import OrderSuccessPage from "@/pages/client/OrderSuccessPage.jsx";
import PaymentReturnPage from "@/pages/client/PaymentReturnPage.jsx";
import TrackOrderPage from "@/pages/client/TrackOrderPage.jsx";
import CouponPage from "@/pages/admin/coupons/CouponPage.jsx";
import PromotionDetailPage from "@/pages/admin/promotions/PromotionDetailPage.jsx";
import UpdatePromotionPage from "@/pages/admin/promotions/UpdatePromotionPage.jsx";
import AddPromotionPage from "@/pages/admin/promotions/AddPromotionPage.jsx";
import UpdateCouponPage from "@/pages/admin/coupons/UpdateCouponPage.jsx";
import CouponDetailPage from "@/pages/admin/coupons/CouponDetailPage.jsx";
import AddCouponPage from "@/pages/admin/coupons/AddCouponPage.jsx";
import CustomerDetail from "@/pages/admin/customers/CustomerDetail.jsx";
import AdminReviewProductPage from "@/pages/admin/reviews/AdminReviewProductPage.jsx";
import AdminReviewStorePage from "@/pages/admin/reviews/AdminReviewStorePage.jsx";
import FavoritePage from "@/pages/client/FavoritePage.jsx";
import PromotionDetail from "@/pages/client/PromotionDetail.jsx";
import ForgotPassword from "@/pages/client/ForgotPassword.jsx";
import ResetPassword from "@/pages/client/ResetPassword.jsx";
import HomeSectionsPage from "@/pages/admin/home-sections/HomeSectionsPage.jsx";
import AddHomeSectionPage from "@/pages/admin/home-sections/AddHomeSectionPage.jsx";
import NewsPage from "@/pages/admin/news/NewsPage.jsx";
import AddNewsPage from "@/pages/admin/news/AddNewsPage.jsx";
import ContactsPage from "@/pages/admin/contacts/ContactsPage.jsx";
import AddContactPage from "@/pages/admin/contacts/AddContactPage.jsx";
import StoreInfoPage from "@/pages/admin/store/StoreInfoPage.jsx";

// Client static pages
import AboutPage from "@/pages/client/AboutPage.jsx";
import NewsPageClient from "@/pages/client/NewsPage.jsx";
import NewsDetail from "@/pages/client/NewsDetail.jsx";
import ContactPage from "@/pages/client/ContactPage.jsx";
import PolicyPage from "@/pages/client/PolicyPage.jsx";

export const routes = [
  //Client
  {
    path: "/",
    element: <Home />,
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
    path: "/orders/:id/tracking",
    element: <OrderTrackingPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/san-pham/:slug",
    element: <ProductDetail />,
  },
  {
    path: "/danh-muc/:slug",
    element: <CategoryPage />,
  },
  {
    path: "/thuong-hieu/:slug",
    element: <BrandPage />,
  },
  {
    path: "/search",
    element: <SearchPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/order-success",
    element: <OrderSuccessPage />,
  },
  {
    path: "/favorites",
    element: (
      <ProtectedRouteUser>
        <FavoritePage />
      </ProtectedRouteUser>
    ),
  },
  {
    path: "/khuyen-mai/:id",
    element: <PromotionDetail />,
  },
  {
    path: "/payment-success",
    element: <OrderSuccessPage />,
  },
  {
    path: "/payment-return",
    element: <PaymentReturnPage />,
  },

  {
    path: "/track-order",
    element: <TrackOrderPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/gioi-thieu",
    element: <AboutPage />,
  },
  {
    path: "/tin-tuc",
    element: <NewsPageClient />,
  },
  {
    path: "/tin-tuc/:slug",
    element: <NewsDetail />,
  },
  {
    path: "/lien-he",
    element: <ContactPage />,
  },
  {
    path: "/chinh-sach/:slug",
    element: <PolicyPage />,
  },
  {
    path: "/san-pham",
    element: <SearchPage />,
  },
  {
    path: "/tim-kiem",
    element: <SearchPage />,
  },
  {
    path: "/dang-nhap",
    element: <Login />,
  },
  {
    path: "/dang-ky",
    element: <Register />,
  },
  {
    path: "/gio-hang",
    element: <CartPage />,
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
  {
    path: "/admin/products/reviews",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <AdminReviewProductPage />
        </AdminLayout>
      </ProtectedRoute>
    ),  
  },
  {
    path: "/admin/stores/reviews",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <AdminReviewStorePage />
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
   {
    path: "/admin/promotions/add",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <AddPromotionPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/promotions/:id/detail",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <PromotionDetailPage />
         </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/promotions/:id/edit",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <UpdatePromotionPage />
         </AdminLayout>
      </ProtectedRoute>
    ),
  },
 {
    path: "/admin/coupons",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <CouponPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
   {
    path: "/admin/coupons/add",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <AddCouponPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/coupons/:id/edit",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <UpdateCouponPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/coupons/:id/detail",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <CouponDetailPage />
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
    {
    path: "/admin/customers/:id/detail",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <CustomerDetail />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },


  // ============ THUỘC TÍNH SẢN PHẨM ============
  {
    path: "/admin/home-sections",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <HomeSectionsPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/home-sections/add",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <AddHomeSectionPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/home-sections/:id/edit",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <AddHomeSectionPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/news",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <NewsPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/news/add",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <AddNewsPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/news/:id/edit",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <AddNewsPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/contacts",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <ContactsPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/contacts/add",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <AddContactPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/store-info",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <StoreInfoPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },

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
