import React from "react";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { useCart } from "../../contexts/CartContext";
import productImageMap from '../../constants/productImages';

export default function CartItem({ item }) {
  const { removeItem, updateQuantity } = useCart();

  const itemImg = productImageMap[item.hinhAnh];

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">

      {/* Cột 1: Ảnh và Info */}
      <div className="flex items-center gap-3 w-3/5">
        <img src={itemImg} alt={item.tenSanPham} className="w-16 h-16 object-cover rounded-md border" />
        <div>
          <p className="font-semibold text-gray-800">{item.tenSanPham}</p>
          <p className="text-sm text-gray-500">
            Màu {item.color} | Size {item.size}
          </p>
          <p className="text-orange-500 font-bold text-lg">
            {(item.giaBan * item.soLuong).toLocaleString()}đ
          </p>
        </div>
      </div>

      {/* Cột 2: Quantity và Delete */}
      <div className="flex items-center gap-4">
        {/* Quantity Controls */}
        <div className="flex items-center border border-gray-300 rounded-full">
          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-full transition disabled:opacity-50"
            onClick={() => updateQuantity(item.maChiTiet, item.soLuong - 1, item.size, item.color)}
            disabled={item.soLuong <= 1}
          >
            <FiMinus size={14} />
          </button>
          <span className="px-3 text-sm font-medium">{item.soLuong}</span>
          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-full transition disabled:opacity-50"
            onClick={() => updateQuantity(item.maChiTiet, item.soLuong + 1, item.size, item.color)}
            disabled={item.soLuong >= item.soLuongTonKho}
          >
            <FiPlus size={14} />
          </button>
        </div>

        {/* Remove Button */}
        <button
          className="p-2 text-red-500 hover:bg-red-100 rounded-full transition"
          onClick={() => removeItem(item.maChiTiet, item.size, item.color)}
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
}