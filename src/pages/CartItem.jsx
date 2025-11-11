import React from "react";
import { useCart } from "../contexts/CartContext";

export default function CartItem({ item }) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="flex items-center justify-between border p-3 rounded-lg">
      <div>
        <p className="font-semibold">{item.tenSanPham}</p>
        <p className="text-sm text-gray-500">
          Size: {item.size}, Màu: {item.color}
        </p>
        <p className="text-orange-500 font-bold">
          {item.giaBan.toLocaleString()}đ
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="px-2 py-1 border rounded"
          onClick={() =>
            updateQuantity(
              item.maChiTiet,
              item.soLuong - 1,
              item.size,
              item.color
            )
          }
          disabled={item.soLuong <= 1}
        >
          -
        </button>
        <span>{item.soLuong}</span>
        <button
          className="px-2 py-1 border rounded"
          onClick={() =>
            updateQuantity(
              item.maChiTiet,
              item.soLuong + 1,
              item.size,
              item.color
            )
          }
          disabled={item.soLuong >= item.soLuongTonKho}
        >
          +
        </button>
        <button
          className="px-2 py-1 border rounded text-red-500"
          onClick={() => removeItem(item.maChiTiet, item.size, item.color)}
        >
          X
        </button>
      </div>
    </div>
  );
}
