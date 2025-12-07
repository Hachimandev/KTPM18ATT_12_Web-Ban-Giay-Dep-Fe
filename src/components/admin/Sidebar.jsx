// @ts-nocheck
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiShoppingCart,
  FiUsers,
  FiUser,
  FiFileText,
  FiTag,
  FiTruck,
  FiLogOut,
} from "react-icons/fi";
import ShopGiayLogo from "../common/ShopGiayLogo";

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
    navigate("/");
    window.location.reload();
  };

  return (
    <aside className="w-64 bg-[#0F172A] text-gray-300 flex flex-col h-screen">
      <div className="p-6 text-center">
        <Link to="/admin" className="text-white text-2xl font-bold">
          <ShopGiayLogo size="text-2xl" color="text-white" />
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-2">
        <SidebarLink icon={<FiHome />} text="Thống kê" to="/admin" end />
        <SidebarLink
          icon={<FiShoppingCart />}
          text="Sản phẩm"
          to="/admin/products"
        />
        <SidebarLink icon={<FiUser />} text="Nhân viên" to="/admin/staff" />
        <SidebarLink
          icon={<FiUsers />}
          text="Khách hàng"
          to="/admin/customers"
        />
        <SidebarLink icon={<FiFileText />} text="Hóa đơn" to="/admin/orders" />
        <SidebarLink icon={<FiTag />} text="Khuyến mãi" to="/admin/discounts" />
        <SidebarLink
          icon={<FiTruck />}
          text="Nhà cung cấp"
          to="/admin/suppliers"
        />
      </nav>

      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center">
          <img
            src="https://placehold.co/40x40/F97316/white?text=A"
            alt="Admin User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <p className="text-sm font-semibold text-white">Admin User</p>
            <p className="text-xs text-gray-400">Quản trị viên</p>
          </div>
          <button
            className="ml-auto text-gray-400 hover:text-white"
            onClick={handleLogout}
            title="Đăng xuất"
          >
            <FiLogOut />
          </button>
        </div>
      </div>
    </aside>
  );
};

const SidebarLink = ({ icon, text, to, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ` +
        (isActive
          ? "bg-[#F97316] text-white" // THAY ĐỔI: Dùng màu #F97316 trực tiếp
          : "hover:bg-gray-700 hover:text-white")
      }
    >
      <span className="text-lg">{icon}</span>
      <span className="ml-3 font-medium">{text}</span>
    </NavLink>
  );
};

export default Sidebar;
