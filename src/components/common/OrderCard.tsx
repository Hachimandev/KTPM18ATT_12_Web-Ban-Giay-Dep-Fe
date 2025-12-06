// src/components/common/OrderCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiList,
} from "react-icons/fi";
import productImageMap from "../../constants/productImages";

export type OrderCardProps = {
  order: any;
  onCancel: (id: string) => void;
};

const statusMap: any = {
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
  CHO_HUY: {
    label: "Đang chờ hủy",
    color: "bg-gray-200 text-gray-700",
    icon: <FiClock size={16} />,
  },
};

const getStatus = (status: string) =>
  statusMap[status] || {
    label: status,
    color: "bg-gray-100 text-gray-700",
    icon: <FiList size={16} />,
  };

const OrderCard: React.FC<OrderCardProps> = ({ order, onCancel }) => {
  const navigate = useNavigate();

  const firstItem = order.chiTietHoaDons?.[0];
  const additionalItems = order.chiTietHoaDons.length - 1;

  const status = getStatus(order.trangThaiHoaDon);
  const totalItems = order.chiTietHoaDons.reduce(
    (t: number, i: any) => t + i.soLuong,
    0
  );

  const imgKey = firstItem?.sanPham?.hinhAnh as keyof typeof productImageMap;

  const imgSrc =
    imgKey && productImageMap[imgKey]
      ? productImageMap[imgKey]
      : `https://placehold.co/70x70?text=${
          firstItem?.sanPham?.tenSanPham?.slice(0, 3) || "SP"
        }`;
  const isPendingConfirmation = order.trangThaiHoaDon === "DANG_GIAO";
  const isCancellable =
    order.trangThaiHoaDon === "CHO_XAC_NHAN" ||
    order.trangThaiHoaDon === "DANG_GIAO";

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex justify-between pb-4 border-b">
        <div className="text-sm text-gray-600">
          <p>
            Mã HĐ:{" "}
            <span className="font-semibold text-gray-800">
              {order.maHoaDon}
            </span>
          </p>
          <p>Ngày đặt: {new Date(order.ngayDat).toLocaleDateString("vi-VN")}</p>
        </div>

        <div
          className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
        >
          {status.icon}
          <span className="ml-1">{status.label}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex items-start gap-4 pt-4">
        {/* Ảnh */}
        <img
          src={imgSrc}
          className="w-16 h-16 rounded-md object-cover border"
        />

        {/* Thông tin */}
        <div className="flex-1">
          <p className="font-medium text-gray-900 text-base">
            {firstItem?.sanPham?.tenSanPham}
            {additionalItems > 0 && (
              <span className="text-gray-500 text-sm ml-2">
                (+{additionalItems} sản phẩm khác)
              </span>
            )}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Size: {firstItem?.chiTietSanPham?.size} | Màu:
            <span
              className="inline-block w-4 h-4 ml-1 rounded-full border"
              style={{ backgroundColor: firstItem?.chiTietSanPham?.mau }}
            ></span>
          </p>

          <p className="text-md font-bold text-orange-600 mt-2">
            {order.thanhTien.toLocaleString()} VNĐ
          </p>
        </div>

        {/* Action */}
        <div className="flex flex-col items-end gap-2">
          {isCancellable && (
            <button
              onClick={() => onCancel(order.maHoaDon)}
              className={`
        px-4 py-1.5 rounded-full text-sm font-medium border
        transition-all duration-200 ease-out
        ${
          isPendingConfirmation
            ? "border-orange-500 text-orange-600 hover:bg-orange-50 hover:scale-105"
            : "border-red-500 text-red-600 hover:bg-red-50 hover:scale-105"
        }
      `}
            >
              {isPendingConfirmation ? "Yêu cầu hủy" : "Hủy đơn"}
            </button>
          )}

          <button
            onClick={() => navigate(`/account/order/${order.maHoaDon}`)}
            className="
      px-4 py-1.5 rounded-full text-sm font-medium border border-blue-500 text-blue-600
      transition-all duration-200 ease-out
      hover:bg-blue-50 hover:scale-105
    "
          >
            Xem chi tiết
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-right pt-3 border-t mt-4 text-xs text-gray-500">
        Tổng số lượng: {totalItems} sản phẩm
      </div>
    </div>
  );
};

export default OrderCard;
