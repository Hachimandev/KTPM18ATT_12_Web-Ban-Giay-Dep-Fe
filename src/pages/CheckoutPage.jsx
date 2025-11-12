import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import * as api from "../api/api";
import OrderSummary from "../components/checkout/OrderSummary";
import ShippingForm from "../components/checkout/ShippingForm";
import PaymentOption from "../components/checkout/PaymentOption";

export default function CheckoutPage() {
    const { cart, total, giamGiaKM, diemTienMat, phiVanChuyen, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const formRef = useRef(null);

    const triggerSubmit = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true })
            );
        }
    };

    const [formData, setFormData] = useState({
        hoTen: "", sdt: "", email: "", diaChi: "", tinhThanh: "", quanHuyen: "", phuongXa: "",
        phuongThucThanhToan: "COD", ghiChu: "", saveInfo: false,
    });

    const [checkoutStep, setCheckoutStep] = useState(2);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            userInfo: formData,
            cart: {
                items: cart.items,
                maKhuyenMai: cart.maKhuyenMai,
                diemSuDung: cart.diemSuDung,
            },
            thanhTien: total,
        };

        try {
            const response = await api.post('/order/place', orderData);
            clearCart();
            setCheckoutStep(3);
            if (response && response.maHoaDon) {
                navigate(`/order-success/${response.maHoaDon}`);
            } else {
                throw new Error("Không nhận được mã hóa đơn từ server.");
            }
        } catch (error) {
            alert("Lỗi đặt hàng. Vui lòng kiểm tra lại thông tin.");
            console.error("Lỗi tạo hóa đơn:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

            <div className="flex justify-between items-center mb-8 text-sm text-gray-500">
                <span className={checkoutStep >= 1 ? "text-green-600 font-semibold" : ""}>1. Giỏ hàng</span>
                <span className={`h-1 flex-1 mx-2 ${checkoutStep >= 2 ? "bg-orange-500" : "bg-gray-300"}`}></span>
                <span className={checkoutStep >= 2 ? "text-orange-500 font-semibold" : ""}>2. Thanh toán</span>
                <span className={`h-1 flex-1 mx-2 ${checkoutStep >= 3 ? "bg-orange-500" : "bg-gray-300"}`}></span>
                <span className={checkoutStep >= 3 ? "text-gray-900 font-semibold" : ""}>3. Hoàn tất</span>
            </div>

            <form onSubmit={handlePlaceOrder} ref={formRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8 bg-white p-6 rounded-lg shadow-sm">
                    <ShippingForm formData={formData} onChange={handleChange} />

                    <div className="space-y-4 pt-4 border-t">
                        <h2 className="text-xl font-bold">Phương thức thanh toán</h2>
                        <div className="space-y-3">
                            <PaymentOption name="phuongThucThanhToan" value="COD" label="Thanh toán khi nhận hàng (COD)"
                                desc="Thanh toán bằng tiền mặt khi nhận hàng"
                                selectedValue={formData.phuongThucThanhToan} onChange={handleChange} />
                            <PaymentOption name="phuongThucThanhToan" value="CARD" label="Thẻ tín dụng/Ghi nợ"
                                desc="Visa, Mastercard, JCB"
                                selectedValue={formData.phuongThucThanhToan} onChange={handleChange} />
                            <PaymentOption name="phuongThucThanhToan" value="EWALLET" label="Ví điện tử"
                                desc="MoMo, ZaloPay, ViettelPay"
                                selectedValue={formData.phuongThucThanhToan} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="pt-4 border-t">
                        <h2 className="text-xl font-bold mb-2">Ghi chú đơn hàng</h2>
                        <textarea name="ghiChu" placeholder="Ghi chú thêm (tùy chọn)"
                            value={formData.ghiChu} onChange={handleChange} rows="3"
                            className="w-full p-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500"></textarea>
                    </div>
                </div>


                {/* Cột tóm tắt đơn hàng */}
                <div className="lg:col-span-1">
                    <OrderSummary
                        cart={cart}
                        total={total}
                        giamGiaKM={giamGiaKM}
                        diemTienMat={diemTienMat}
                        phiVanChuyen={phiVanChuyen}
                        navigate={navigate}
                        onConfirm={triggerSubmit}
                        loading={loading}
                    />

                </div>
            </form>
        </div>
    );
}
