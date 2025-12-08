// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "../api/api";
import {
  FiArrowLeft,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";
import productImageMap from "../constants/productImages";

const statusMap = {
  CHO_XAC_NHAN: {
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-800",
    icon: <FiClock size={16} />,
  },
  DANG_GIAO: {
    label: "Đang giao hàng",
    color: "bg-blue-100 text-blue-800",
    icon: <FiTruck size={16} />,
  },
  DA_GIAO: {
    label: "Đã giao (Hoàn tất)",
    color: "bg-green-100 text-green-800",
    icon: <FiCheckCircle size={16} />,
  },
  DA_HUY: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800",
    icon: <FiXCircle size={16} />,
  },
};

const getProductImage = (hinhAnh, tenSanPham = "SP") => {
  if (!hinhAnh) {
    return `https://placehold.co/60x60?text=${tenSanPham.substring(0, 3)}`;
  }
  if (hinhAnh.startsWith("http")) return hinhAnh;
  return (
    productImageMap[hinhAnh] ||
    `https://placehold.co/60x60?text=${tenSanPham.substring(0, 3)}`
  );
};

const OrderDetailPage = () => {
  const { maHoaDon } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const username = localStorage.getItem("username");
    api
      .get(`/hoadon/customer/${maHoaDon}?username=${username}`)
      .then((data) => setOrder(data))
      .catch((err) => console.error("Lỗi tải chi tiết đơn hàng:", err))
      .finally(() => setLoading(false));
  }, [maHoaDon]);

  if (loading)
    return (
      <div className="text-center py-20">Đang tải chi tiết đơn hàng...</div>
    );
  if (!order)
    return <div className="text-center py-20">Không tìm thấy đơn hàng</div>;

  const totalItems =
    order.chiTietHoaDons?.reduce((sum, item) => sum + item.soLuong, 0) || 0;
  const statusDetails = statusMap[order.trangThaiHoaDon] || {
    label: order.trangThaiHoaDon,
    color: "bg-gray-100 text-gray-700",
    icon: null,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 md:p-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:underline mb-6"
        >
          <FiArrowLeft className="mr-2" /> Quay lại
        </button>

        {/* Header đơn hàng */}
        <div className="flex justify-between items-start border-b pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Chi tiết đơn hàng: {order.maHoaDon}
            </h2>
            <p className="text-gray-500 mt-1">
              Ngày đặt: {new Date(order.ngayDat).toLocaleDateString("vi-VN")}
            </p>
            <p className="text-gray-500 mt-1">Tổng số sản phẩm: {totalItems}</p>
          </div>
          <div
            className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusDetails.color}`}
          >
            {statusDetails.icon}{" "}
            <span className="ml-1">{statusDetails.label}</span>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="space-y-4">
          {order.chiTietHoaDons.map((item) => (
            <div
              key={item.maChiTietHoaDon}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-sm transition"
            >
              {/* Hình SP (placeholder) */}
              <img
                src={getProductImage(
                  item.sanPham?.hinhAnh,
                  item.sanPham?.tenSanPham
                )}
                alt={item.sanPham?.tenSanPham}
                className="w-16 h-16 rounded-md object-cover"
              />

              <div className="ml-4 flex-1">
                <p className="font-medium text-gray-800">
                  {item.sanPham?.tenSanPham}
                </p>
                <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                  <p>Size: {item.chiTietSanPham?.size}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    Màu:
                    <span
                      className="inline-block w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: item.color }}
                    ></span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-orange-600 font-bold">
                  {item.tongTien.toLocaleString()} VNĐ
                </p>
                <p className="text-sm text-gray-500 mt-1">x{item.soLuong}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tổng tiền đơn hàng */}
        <div className="mt-6 flex justify-end">
          <p className="text-xl font-bold text-gray-800">
            Tổng cộng:{" "}
            <span className="text-orange-600">
              {order.thanhTien.toLocaleString()} VNĐ
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
