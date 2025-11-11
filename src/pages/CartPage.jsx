import React from "react";
import { useCart } from "../contexts/CartContext";
import CartItem from "./CartItem";

export default function Cart() {
  const { cart, totalPrice, clearCart } = useCart();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn</h1>

      {cart.items.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <div className="space-y-4">
          {cart.items.map((item) => (
            <CartItem key={item.maChiTiet} item={item} />
          ))}

          <div className="flex justify-between items-center mt-4">
            <p className="font-semibold text-lg">
              Tổng tiền: {totalPrice.toLocaleString()}đ
            </p>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={clearCart}
            >
              Xóa giỏ hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
