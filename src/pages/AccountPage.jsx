import React, { useState, useEffect } from 'react';
import {
  FiUser, FiPackage, FiClock, FiXCircle,
  FiTruck, FiHeart, FiLogOut, FiEdit2, FiList
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import * as api from "../api/api";

const statusMapFE = {
  'PENDING': 'CHO_XAC_NHAN',
  'SHIPPING': 'DANG_GIAO',
  'CANCELLED': 'DA_HUY',
};

const AccountPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Khách";

  const [orderCounts, setOrderCounts] = useState({
    CHO_XAC_NHAN: null,
    DANG_GIAO: null,
    DA_HUY: null,
  });
  const [loadingCounts, setLoadingCounts] = useState(true);

  const menu = [
    { name: "Cập nhật thông tin", icon: <FiEdit2 />, path: "/account/update", color: "text-blue-500" },
    { name: "Đơn hàng đang chờ", icon: <FiClock />, path: "/account/orders/pending", statusKey: "CHO_XAC_NHAN", color: "text-yellow-600" },
    { name: "Đơn hàng đang giao", icon: <FiTruck />, path: "/account/orders/shipping", statusKey: "DANG_GIAO", color: "text-teal-500" },
    { name: "Đơn hàng đã hủy", icon: <FiXCircle />, path: "/account/orders/cancelled", statusKey: "DA_HUY", color: "text-red-500" },
    { name: "Lịch sử đơn hàng", icon: <FiPackage />, path: "/account/orders/all", color: "text-orange-500" }, // để xuống cuối
    { name: "Sản phẩm yêu thích", icon: <FiHeart />, path: "/account/favorites", color: "text-pink-500" },
  ];



  useEffect(() => {
    const username = localStorage.getItem("username");
    api.get(`/hoadon/counts?username=${username}`)
      .then(data => {
        setOrderCounts(data);
      })
      .catch(err => console.error("Không tải được số lượng đơn hàng.", err))
      .finally(() => setLoadingCounts(false));
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 md:p-10">
        {/* Header Info */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-orange-500 text-white p-4 rounded-full">
              <FiUser size={30} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Xin chào, {username}!</h2>
              <p className="text-gray-500 mt-1">Trang quản lý tài khoản cá nhân</p>
            </div>
          </div>

          {/* Nút Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center text-red-500 hover:text-red-700 transition"
          >
            <FiLogOut className="mr-2" /> Đăng xuất
          </button>
        </div>

        {/* Menu items */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {menu.map((item) => {
            const count = item.statusKey ? orderCounts[item.statusKey] : null;

            return (
              <div
                key={item.name}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center p-6 border border-gray-200 rounded-xl bg-white hover:bg-orange-50 hover:border-orange-300 cursor-pointer transition duration-200 relative"
              >
                {count !== null && count > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {loadingCounts ? <FiClock className="animate-spin" size={14} /> : count}
                  </span>
                )}
                <div className={`text-3xl mb-3 ${item.color}`}>{item.icon}</div>
                <p className="text-md text-gray-800 font-medium text-center">
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;