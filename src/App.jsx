import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import AdminLayout from "./components/layout/AdminLayout.jsx";
import CustomerLayout from "./components/layout/CustomerLayout.jsx";

import CustomerPage from "./pages/admin/CustomerPage.jsx";
import DashboardPage from "./pages/admin/DashboardPage.jsx";
import DiscountPage from "./pages/admin/DiscountPage.jsx";
import OrderPage from "./pages/admin/OrderPage.jsx";
import ProductsPage from "./pages/admin/ProductsPage.jsx";
import StaffPage from "./pages/admin/StaffPage.jsx";
import SupplierPage from "./pages/admin/SupplierPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProductDetail from "./pages/ProductDetailPage.jsx";
import ProductListPage from "./pages/ProductListPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AccountPage from "./components/layout/AccountPage.jsx";
import UpdateAccountPage from "./pages/UpdateAccountPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* <Route path="/products/:category" element={<ProductListPage />} /> */}
        <Route path="/search" element={<ProductListPage category="all" />} />
        <Route
          path="/products/giay-nam"
          element={<ProductListPage category="men" />}
        />
        <Route
          path="/products/giay-nu"
          element={<ProductListPage category="women" />}
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

        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute roleRequired="USER">
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
      </Route>
      <Route
        path="/admin"
        element={
          <ProtectedRoute roleRequired="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="customers" element={<CustomerPage />} />
        <Route path="suppliers" element={<SupplierPage />} />
        <Route path="discounts" element={<DiscountPage />} />
        <Route path="orders" element={<OrderPage />} />
      </Route>

      {/* Có thể thêm route 404 ở đây */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;
