import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import CartItem from "../components/cart/CartItem";

export default function Cart() {
  const {
    cart,
    danhSachKM,
    subtotal,
    total,
    giamGiaKM,
    diemTienMat,
    phiVanChuyen,
    diemKhachHang,
    applyPromo,
    usePoints,
  } = useCart();

  const navigate = useNavigate();
  const [selectedPromo, setSelectedPromo] = useState(cart.maKhuyenMai || "");
  const [usePointsChecked, setUsePointsChecked] = useState(cart.diemSuDung > 0);

  const handleSelectPromo = async (e) => {
    const ma = e.target.value;
    setSelectedPromo(ma);
    await applyPromo(ma || null);
  };

  const handleUsePoints = (e) => {
    const checked = e.target.checked;
    setUsePointsChecked(checked);
    usePoints(checked ? diemKhachHang : 0);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái */}
        <div className="lg:col-span-2 space-y-6">
          {/* Danh sách sản phẩm */}
          <div className="space-y-4">
            {cart.items.length === 0 ? (
              <p className="text-gray-600 p-10 bg-white rounded-lg shadow-sm">
                Giỏ hàng trống.
              </p>
            ) : (
              cart.items.map((item) => (
                <CartItem
                  key={item.maChiTiet + item.size + item.color}
                  item={item}
                />
              ))
            )}
          </div>

          {/* Combobox khuyến mãi */}
          <div className="pt-4 mt-4">
            <h2 className="font-semibold text-lg mb-3">Khuyến mãi</h2>
            <select
              value={selectedPromo}
              onChange={handleSelectPromo}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">-- Chọn khuyến mãi --</option>
              {danhSachKM.map((km) => (
                <option key={km.maKhuyenMai} value={km.maKhuyenMai}>
                  {km.tenKhuyenMai} ({Math.round(km.chietKhau * 100)}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cột phải */}
        <div className="bg-white p-6 rounded-lg shadow-xl h-fit border border-gray-100">
          <h2 className="font-bold text-xl mb-4">Tóm tắt đơn hàng</h2>

          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span className="font-medium">{subtotal.toLocaleString()}đ</span>
            </div>

            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span className="font-medium">
                {phiVanChuyen.toLocaleString()}đ
              </span>
            </div>

            <div className="flex justify-between font-semibold">
              <span>Giảm giá</span>
              <span
                className={giamGiaKM > 0 ? "text-green-600" : "text-gray-500"}
              >
                -{giamGiaKM.toLocaleString()}đ
              </span>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between text-xl text-orange-500 font-bold">
                <span>Tổng cộng</span>
                <span>{total.toLocaleString()}đ</span>
              </div>
            </div>
          </div>

          {/* Điểm tích lũy */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-semibold text-gray-800">
              Điểm tích lũy khả dụng:{" "}
              <span className="text-yellow-600">
                {diemKhachHang.toLocaleString()} điểm
              </span>
            </p>
            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input
                type="checkbox"
                checked={usePointsChecked}
                onChange={handleUsePoints}
                className="rounded text-orange-500 focus:ring-orange-500"
                disabled={diemKhachHang === 0}
              />
              <span className="text-sm text-gray-700">
                Sử dụng điểm (-{diemTienMat.toLocaleString()}đ)
              </span>
            </label>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full bg-orange-500 text-white px-4 py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg"
            disabled={cart.items.length === 0}
          >
            Tiến hành thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
