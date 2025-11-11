// src/pages/AccountPage.jsx

import {
  FiUser,
  FiPackage,
  FiClock,
  FiXCircle,
  FiTruck,
  FiStar,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
    navigate("/");
    window.location.reload();
  };

  const menu = [
    { name: "Cập nhật thông tin", icon: <FiUser />, path: "/account/update" },
    { name: "Đơn hàng đã mua", icon: <FiPackage />, path: "/account/orders" },
    {
      name: "Đơn hàng đã hủy",
      icon: <FiXCircle />,
      path: "/account/orders/cancelled",
    },
    {
      name: "Chờ giao hàng",
      icon: <FiTruck />,
      path: "/account/orders/pending",
    },
    { name: "Đánh giá", icon: <FiStar />, path: "/account/reviews" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6">
        {/* Info */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-orange-500 text-white p-4 rounded-full">
            <FiUser size={28} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Xin chào, {username}</h2>
            <p className="text-gray-500 text-sm">Quản lý tài khoản của bạn</p>
          </div>
        </div>

        {/* Menu items */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {menu.map((item) => (
            <div
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center p-4 border rounded-xl bg-white hover:bg-orange-50 cursor-pointer transition"
            >
              <div className="text-orange-500 text-2xl mb-2">{item.icon}</div>
              <p className="text-sm text-gray-700 font-medium text-center">
                {item.name}
              </p>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
        >
          <FiLogOut className="mr-2" /> Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
