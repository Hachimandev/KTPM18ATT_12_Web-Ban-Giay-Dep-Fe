import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import * as api from "../api/api";
import OrderSummary from "../components/checkout/OrderSummary";
import ShippingForm from "../components/checkout/ShippingForm";
import PaymentOption from "../components/checkout/PaymentOption";

export default function CheckoutPage() {
  const { cart, total, giamGiaKM, diemTienMat, phiVanChuyen, clearCart } =
    useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    hoTen: "",
    sdt: "",
    email: "",
    diaChiChiTiet: "",
    tinhThanh: "",
    quanHuyen: "",
    phuongXa: "",
    phuongThucThanhToan: "COD",
    ghiChu: "",
    saveInfo: false,
  });

  const [checkoutStep, setCheckoutStep] = useState(2);

  // Lấy thông tin khách hàng khi load trang
  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) return;

        const response = await api.get(`/khachhang/info/${username}`);
        if (!response) return;

        // Tách địa chỉ nếu backend trả 1 trường 'diaChi'
        let diaChiChiTiet = "";
        let phuongXa = "";
        let quanHuyen = "";
        let tinhThanh = response.tinhThanh || "";

        if (response.diaChi) {
          const parts = response.diaChi.split(",").map((s) => s.trim());
          if (parts.length === 4) {
            [diaChiChiTiet, phuongXa, quanHuyen, tinhThanh] = parts;
          }
        }
        console.log("Loaded customer info:", response);

        setFormData((prev) => ({
          ...prev,
          hoTen: response.hoTen || "",
          email: response.email || "",
          sdt: response.sdt || "",
          diaChiChiTiet,
          phuongXa,
          quanHuyen,
          tinhThanh,
        }));
      } catch (err) {
        console.error("Không thể load thông tin khách hàng", err);
      }
    };

    fetchCustomerInfo();
  }, []);

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

    try {
      const username = localStorage.getItem("username");
      if (!username) throw new Error("Chưa đăng nhập");

      const diaChiGop = `${formData.diaChiChiTiet}, ${formData.phuongXa}, ${formData.quanHuyen}, ${formData.tinhThanh}`;

      // Cập nhật thông tin khách hàng
      await api.put(`/khachhang/update/${username}`, {
        hoTen: formData.hoTen,
        email: formData.email,
        sdt: formData.sdt,
        diaChi: diaChiGop,
      });

      // Tạo hóa đơn
      const orderData = {
        userInfo: {
          ...formData,
          diaChi: diaChiGop,
        },
        cart: {
          items: cart.items.map((i) => ({
            maChiTiet: i.maChiTiet,
            soLuong: i.soLuong,
            giaBan: i.giaBan,
          })),
          maKhuyenMai: cart.maKhuyenMai,
          diemSuDung: cart.diemSuDung,
        },
        thanhTien: total,
      };

      const response = await api.post("/hoadon/checkout", orderData);

      clearCart();
      navigate(`/order-success/${response.maHoaDon}`);
    } catch (err) {
      console.error(err);
      alert("Lỗi đặt hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      {/* Step indicator */}
      <div className="flex justify-between items-center mb-8 text-sm text-gray-500">
        <span
          className={checkoutStep >= 1 ? "text-green-600 font-semibold" : ""}
        >
          1. Giỏ hàng
        </span>
        <span
          className={`h-1 flex-1 mx-2 ${
            checkoutStep >= 2 ? "bg-orange-500" : "bg-gray-300"
          }`}
        ></span>
        <span
          className={checkoutStep >= 2 ? "text-orange-500 font-semibold" : ""}
        >
          2. Thanh toán
        </span>
        <span
          className={`h-1 flex-1 mx-2 ${
            checkoutStep >= 3 ? "bg-orange-500" : "bg-gray-300"
          }`}
        ></span>
        <span
          className={checkoutStep >= 3 ? "text-gray-900 font-semibold" : ""}
        >
          3. Hoàn tất
        </span>
      </div>

      <form
        onSubmit={handlePlaceOrder}
        ref={formRef}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-8 bg-white p-6 rounded-lg shadow-sm">
          <ShippingForm formData={formData} onChange={handleChange} />

          <div className="space-y-4 pt-4 border-t">
            <h2 className="text-xl font-bold">Phương thức thanh toán</h2>
            <div className="space-y-3">
              {["COD", "CARD", "EWALLET"].map((method) => (
                <PaymentOption
                  key={method}
                  name="phuongThucThanhToan"
                  value={method}
                  label={
                    method === "COD"
                      ? "Thanh toán khi nhận hàng (COD)"
                      : method === "CARD"
                      ? "Thẻ tín dụng/Ghi nợ"
                      : "Ví điện tử"
                  }
                  desc={
                    method === "COD"
                      ? "Thanh toán bằng tiền mặt khi nhận hàng"
                      : method === "CARD"
                      ? "Visa, Mastercard, JCB"
                      : "MoMo, ZaloPay, ViettelPay"
                  }
                  selectedValue={formData.phuongThucThanhToan}
                  onChange={handleChange}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <h2 className="text-xl font-bold mb-2">Ghi chú đơn hàng</h2>
            <textarea
              name="ghiChu"
              placeholder="Ghi chú thêm (tùy chọn)"
              value={formData.ghiChu}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
            ></textarea>
          </div>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            cart={cart}
            total={total}
            giamGiaKM={giamGiaKM}
            diemTienMat={diemTienMat}
            phiVanChuyen={phiVanChuyen}
            onConfirm={handlePlaceOrder}
            navigate={navigate}
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
}
