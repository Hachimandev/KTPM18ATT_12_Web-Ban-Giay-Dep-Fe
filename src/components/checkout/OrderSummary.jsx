import React from "react";
import productImageMap from "../../constants/productImages";

const OrderSummary = ({ cart, total, giamGiaKM, diemTienMat, phiVanChuyen, onConfirm, loading }) => {

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl h-fit border border-gray-100 sticky top-4">
            <h2 className="font-bold text-xl mb-4">Tóm tắt đơn hàng</h2>

            {/* Danh sách sản phẩm */}
            <div className="space-y-3 pb-4 border-b mb-4">
                {cart.items.map((item) => (
                    <div key={item.maChiTiet} className="flex gap-3 text-sm text-gray-700">
                        <img
                            src={productImageMap[item.hinhAnh] || "https://placehold.co/40x40?text=SP"}
                            alt={item.tenSanPham}
                            className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                            <p className="font-medium">{item.tenSanPham}</p>
                            <p className="text-xs text-gray-500">
                                Size: {item.size}, Màu: {item.mau} × {item.soLuong}
                            </p>
                        </div>
                        <span className="ml-auto font-semibold">
                            {(item.giaBan * item.soLuong).toLocaleString()}đ
                        </span>
                    </div>
                ))}
            </div>

            {/* Tổng tiền */}
            <div className="space-y-2 text-gray-700 text-sm">
                <div className="flex justify-between"><span>Tạm tính</span><span className="font-medium">{(total - phiVanChuyen + giamGiaKM + diemTienMat).toLocaleString()}đ</span></div>
                <div className="flex justify-between"><span>Phí vận chuyển</span><span className="font-medium">{phiVanChuyen.toLocaleString()}đ</span></div>
                <div className="flex justify-between"><span>Giảm giá</span><span className="text-green-600 font-medium">-{giamGiaKM.toLocaleString()}đ</span></div>
                <div className="flex justify-between"><span>Điểm đã dùng</span><span className="text-green-600 font-medium">-{diemTienMat.toLocaleString()}đ</span></div>
                <div className="flex justify-between font-bold text-lg text-orange-500 pt-3 border-t">
                    <span>Tổng cộng</span><span>{total.toLocaleString()}đ</span>
                </div>
            </div>

            <div className="pt-4 mt-4 border-t">
                <h3 className="font-semibold text-gray-700 mb-2">Phương thức vận chuyển</h3>
                <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-2 border p-3 rounded-lg">
                        <input type="radio" name="shippingMethod" value="TIEU_CHUAN" defaultChecked className="text-orange-500" />
                        <div>
                            <p className="font-medium">Giao hàng tiêu chuẩn</p>
                            <p className="text-xs text-gray-500">3-5 ngày làm việc</p>
                        </div>
                    </label>
                    <label className="flex items-center gap-2 border p-3 rounded-lg">
                        <input type="radio" name="shippingMethod" value="NHANH" className="text-orange-500" />
                        <div>
                            <p className="font-medium">Giao hàng nhanh</p>
                            <p className="text-xs text-gray-500">1-2 ngày làm việc</p>
                        </div>
                    </label>
                </div>
            </div>


            <button
                onClick={onConfirm}
                className={`mt-6 w-full bg-orange-500 text-white px-4 py-3 rounded-lg font-bold transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600'}`}
                disabled={cart.items.length === 0 || loading}
            >
                {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
            </button>

            <p className="text-xs text-center text-gray-400 mt-2">Thanh toán được bảo mật bởi SSL</p>
        </div>
    );
};

export default OrderSummary;
