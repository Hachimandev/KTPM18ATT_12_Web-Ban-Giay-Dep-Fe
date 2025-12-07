// src/pages/AccountPage.jsx
import React, { useState, useEffect } from 'react';
import {
  FiUser, FiPackage, FiClock, FiXCircle,
  FiTruck, FiHeart, FiLogOut, FiEdit2
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import * as api from "../api/api";

const AccountPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Khách";

  const [orderCounts, setOrderCounts] = useState({
    CHO_XAC_NHAN: null,
    DANG_GIAO: null,
    DA_GIAO: null,
    DA_HUY: null,
    CHO_HUY: null,
  });

  const [loadingCounts, setLoadingCounts] = useState(true);

  const menu = [
    {
      name: "Cập nhật thông tin",
      icon: <FiEdit2 />,
      path: "/account/update",
      color: "text-blue-600"
    },
    {
      name: "Đơn hàng đang chờ",
      icon: <FiClock />,
      path: "/account/orders/pending",
      statusKey: "CHO_XAC_NHAN",
      color: "text-yellow-600"
    },
    {
      name: "Đơn hàng đang giao",
      icon: <FiTruck />,
      path: "/account/orders/shipping",
      statusKey: "DANG_GIAO || CHO_HUY",
      color: "text-teal-600"
    },
    {
      name: "Đơn hàng đã giao",
      icon: <FiPackage />,
      path: "/account/orders/delivered",
      statusKey: "DA_GIAO",
      color: "text-green-600"
    },
    {
      name: "Đơn hàng đã hủy",
      icon: <FiXCircle />,
      path: "/account/orders/cancelled",
      statusKey: "DA_HUY",
      color: "text-red-600"
    },
    {
      name: "Sản phẩm yêu thích",
      icon: <FiHeart />,
      path: "/account/favorites",
      color: "text-pink-600"
    },
  ];

  useEffect(() => {
    const username = localStorage.getItem("username");
    api.get(`/hoadon/counts?username=${username}`)
      .then(data => setOrderCounts(data))
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
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">

        {/* Header */}
        <div className="flex items-center justify-between border-b pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white p-4 rounded-full shadow-md">
              <FiUser size={32} />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Xin chào, {username}!
              </h2>
              <p className="text-gray-500 mt-1">
                Quản lý tài khoản & đơn hàng của bạn
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 transition font-medium"
          >
            <FiLogOut size={20} /> Đăng xuất
          </button>
        </div>

        {/* Menu */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {menu.map((item) => {
            let count = null;

            if (item.statusKey) {
              if (item.statusKey.includes(" || ")) {
                const [k1, k2] = item.statusKey.split(" || ").map(s => s.trim());
                const total = (orderCounts[k1] || 0) + (orderCounts[k2] || 0);
                count = total > 0 ? total : null;
              } else {
                count = orderCounts[item.statusKey];
                if (count === 0) count = null;
              }
            }

            return (
              <div
                key={item.name}
                onClick={() => navigate(item.path)}
                className="
                  relative p-6 rounded-xl border border-gray-200 bg-white 
                  hover:bg-gray-50 hover:shadow-lg hover:border-orange-400
                  cursor-pointer transition-all duration-200
                  flex flex-col items-center group"
              >

                {/* Badge */}
                {count !== null && (
                  <span className="
                    absolute top-2 right-2 bg-red-500 text-white text-xs font-bold
                    rounded-full h-6 w-6 flex items-center justify-center 
                    shadow-md
                  ">
                    {loadingCounts ? <FiClock size={14} className="animate-spin" /> : count}
                  </span>
                )}

                {/* Icon */}
                <div className={`
                  text-3xl mb-3 ${item.color} 
                  group-hover:scale-110 transition-transform
                `}>
                  {item.icon}
                </div>

                {/* Title */}
                <p className="text-gray-800 font-semibold group-hover:text-orange-600 transition">
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* History Link */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/account/orders/all")}
            className="
              text-blue-600 hover:text-blue-800 font-medium 
              underline underline-offset-4 transition
            "
          >
            Xem toàn bộ lịch sử đơn hàng →
          </button>
        </div>

      </div>
    </div>
  );
};

export default AccountPage;
