import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import AdminLayout from "./components/layout/AdminLayout.jsx";
import CustomerLayout from "./components/layout/CustomerLayout.jsx";

// Admin Pages
import CustomerPage from "./pages/admin/CustomerPage.jsx";
import DashboardPage from "./pages/admin/DashboardPage.jsx";
import DiscountPage from "./pages/admin/DiscountPage.jsx";
import OrderPage from "./pages/admin/OrderPage.jsx";
import ProductsPage from "./pages/admin/ProductsPage.jsx";
import ShopInformationManaging from "./pages/admin/ShopInformationManaging.jsx";
import StaffPage from "./pages/admin/StaffPage.jsx";
import SupplierFormPage from "./pages/admin/SupplierFormPage.jsx";
import SupplierPage from "./pages/admin/SupplierPage.jsx";

// Customer Pages
import AboutPage from "./pages/AboutPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OrderDetailPage from "./pages/OrderDetailPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import ProductDetail from "./pages/ProductDetailPage.jsx";
import ProductListPage from "./pages/ProductListPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import UpdateAccountPage from "./pages/UpdateAccountPage.jsx";
import ProductFormPage from "./pages/admin/ProductFormPage.jsx";
import ChatbotPage from "./pages/ChatbotPage.js";
function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Product Listing Routes --- */}
        <Route path="/search" element={<ProductListPage category="all" />} />
        <Route
          path="/products/giay-nam"
          element={<ProductListPage gender="Nam" />}
        />
        <Route
          path="/products/giay-nu"
          element={<ProductListPage gender="Nu" />}
        />
        <Route
          path="/products/dep"
          element={<ProductListPage category="sandals" />}
        />
        <Route
          path="/products/khuyen-mai"
          element={<ProductListPage category="sale" />}
        />
        <Route path="/product/:id" element={<ProductDetail />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* --- Account Routes (Protected) --- */}
        <Route
          path="/account"
          element={
            <ProtectedRoute roleRequired="USER">
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/update"
          element={
            <ProtectedRoute roleRequired="USER">
              <UpdateAccountPage />
            </ProtectedRoute>
          }
        />

        {/* ROUTE LỊCH SỬ ĐƠN HÀNG (Sử dụng URL parameter để lọc) */}
        <Route
          path="/account/orders"
          element={
            <ProtectedRoute roleRequired="USER">
              <OrderHistoryPage status="all" />{" "}
              {/* Mặc định: Hiển thị tất cả */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/order/:maHoaDon"
          element={
            <ProtectedRoute roleRequired="USER">
              <OrderDetailPage status="all" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/orders/:status"
          element={
            <ProtectedRoute roleRequired="USER">
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />

        {/* ROUTE CHECKOUT (Protected) */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute roleRequired="USER">
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route path="/chatbot" element={<ChatbotPage />} />
      </Route>

      {/* --- Admin Routes --- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roleRequired="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products">
          <Route index element={<ProductsPage />} />
          <Route path="add" element={<ProductFormPage />} />
          <Route path="edit/:id" element={<ProductFormPage />} />
        </Route>
        <Route path="staff" element={<StaffPage />} />
        <Route path="customers" element={<CustomerPage />} />
        <Route path="suppliers">
          <Route index element={<SupplierPage />} />
          <Route path="add" element={<SupplierFormPage />} />
          <Route path="edit/:id" element={<SupplierFormPage />} />
        </Route>
        <Route path="discounts" element={<DiscountPage />} />
        <Route path="orders" element={<OrderPage />} />
        <Route path="shop-info" element={<ShopInformationManaging />} />
      </Route>

      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;
