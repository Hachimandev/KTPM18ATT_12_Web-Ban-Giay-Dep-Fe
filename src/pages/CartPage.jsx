// src/pages/Cart.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import CartItem from "../components/cart/CartItem"; // Đã sửa ở câu trả lời trước

// Giả định bạn có component Breadcrumbs
// const Breadcrumbs = () => (
//   <div className="text-sm text-gray-500 mb-6">
//     <Link to="/" className="hover:text-black">Trang chủ</Link> /
//     <span className="font-semibold text-gray-700"> Giỏ hàng</span>
//   </div>
// );


export default function Cart() {
  const {
    cart, subtotal, total, giamGiaKM, diemTienMat, phiVanChuyen,
    diemKhachHang, applyPromo, usePoints
  } = useCart();

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState(cart.maKhuyenMai || '');
  const [isPromoApplied, setIsPromoApplied] = useState(!!cart.maKhuyenMai);
  const [usePointsChecked, setUsePointsChecked] = useState(cart.diemSuDung > 0);

  const handleApplyPromo = () => {
    if (!promoInput) {
      applyPromo(null);
      setIsPromoApplied(false);
      return;
    }

    if (promoInput.toUpperCase() === 'SALE10') {
      applyPromo(promoInput.toUpperCase());
      setIsPromoApplied(true);
    } else {
      alert('Mã giảm giá không hợp lệ. Vui lòng nhập lại.');
      applyPromo(null);
      setIsPromoApplied(false);
    }
  };

  const handleUsePoints = (e) => {
    const checked = e.target.checked;
    setUsePointsChecked(checked);

    if (checked) {
      usePoints(diemKhachHang);
    } else {
      usePoints(0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cột 1: Danh sách sản phẩm & Mã giảm giá */}
        <div className="lg:col-span-2 space-y-6">
          {/* Danh sách sản phẩm */}
          <div className="space-y-4">
            {cart.items.length === 0 ? (
              <p className="text-gray-600 p-10 bg-white rounded-lg shadow-sm">Giỏ hàng trống.</p>
            ) : (
              cart.items.map((item) => (
                <CartItem key={item.maChiTiet + item.size + item.color} item={item} />
              ))
            )}
          </div>

          {/* Form mã giảm giá */}
          <div className="pt-4 mt-4">
            <h2 className="font-semibold text-lg mb-3">Mã giảm giá</h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
              <button
                onClick={handleApplyPromo}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>

        {/* Cột 2: Tóm tắt đơn hàng */}
        <div className="bg-white p-6 rounded-lg shadow-xl h-fit border border-gray-100">
          <h2 className="font-bold text-xl mb-4">Tóm tắt đơn hàng</h2>

          <div className="space-y-3 text-gray-700">
            {/* Tạm tính */}
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span className="font-medium">{subtotal.toLocaleString()}đ</span>
            </div>

            {/* Phí vận chuyển */}
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span className="font-medium">{phiVanChuyen.toLocaleString()}đ</span>
            </div>

            {/* Giảm giá KM */}
            <div className="flex justify-between font-semibold">
              <span>Giảm giá</span>
              <span className={giamGiaKM > 0 ? 'text-green-600' : 'text-gray-500'}>
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
              Điểm tích lũy khả dụng: <span className="text-yellow-600">{diemKhachHang.toLocaleString()} điểm</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              1 điểm = 1 VNĐ. Tối đa 10.000 VNĐ.
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
                Sử dụng điểm tích lũy (-{diemTienMat.toLocaleString()}đ)
              </span>
            </label>
          </div>

          {/* Nút Thanh toán */}
          <button
            onClick={() => navigate('/checkout')}
            className="mt-6 w-full bg-orange-500 text-white px-4 py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg"
            disabled={cart.items.length === 0}
          >
            Tiến hành thanh toán
          </button>
          <p className="text-xs text-center text-gray-400 mt-2">
            Thanh toán an toàn & bảo mật
          </p>
        </div>
      </div>
    </div>
  );
}