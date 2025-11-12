import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../api/api";

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const SHIPPING_FEE = 30000;
const MAX_POINT_DISCOUNT = 10000;

export const CartProvider = ({ children }) => {
  const [khuyenMaiInfo, setKhuyenMaiInfo] = useState(null);
  const [danhSachKM, setDanhSachKM] = useState([]);
  const [diemTichLuy, setDiemTichLuy] = useState(0);
  const usernameFromStorage = localStorage.getItem("username");

  const [username, setUsername] = useState(usernameFromStorage);

  const [cart, setCart] = useState(() => {
    if (!usernameFromStorage)
      return { items: [], maKhuyenMai: null, diemSuDung: 0 };
    const saved = localStorage.getItem(`cart_${usernameFromStorage}`);
    return saved
      ? JSON.parse(saved)
      : { items: [], maKhuyenMai: null, diemSuDung: 0 };
  });

  // --- Lấy dữ liệu khởi tạo ---
  useEffect(() => {
    if (!username) return;

    // Lấy điểm khách hàng
    api
      .get(`/khachhang/diem/${username}`)
      .then(setDiemTichLuy)
      .catch((err) => console.error("Lỗi khi lấy điểm tích lũy:", err));

    // Lấy danh sách khuyến mãi
    api
      .get("/khuyenmai")
      .then(setDanhSachKM)
      .catch((err) => console.error("Lỗi khi lấy danh sách khuyến mãi:", err));

    // Load giỏ hàng từ localStorage
    const saved = localStorage.getItem(`cart_${username}`);
    if (saved) setCart(JSON.parse(saved));
  }, [username]);

  // --- Lưu giỏ hàng ---
  useEffect(() => {
    if (username)
      localStorage.setItem(`cart_${username}`, JSON.stringify(cart));
  }, [cart, username]);

  // --- Tính toán tổng ---
  const calculateTotals = (cart, kmInfo) => {
    const subtotal = cart.items.reduce(
      (sum, i) => sum + i.giaBan * i.soLuong,
      0
    );
    const giamGiaKM = kmInfo?.chietKhau ? subtotal * kmInfo.chietKhau : 0;
    const diemTienMat = Math.min(
      cart.diemSuDung,
      diemTichLuy,
      MAX_POINT_DISCOUNT
    );
    const total = Math.max(
      subtotal + SHIPPING_FEE - giamGiaKM - diemTienMat,
      0
    );
    return { subtotal, giamGiaKM, diemTienMat, total };
  };

  // --- Các hành động chính ---
  const addItem = (product, qty, size, color) => {
    setCart((prev) => {
      const existing = prev.items.find(
        (i) =>
          i.maChiTiet === product.maChiTiet &&
          i.size === size &&
          i.color === color
      );
      let items;
      if (existing) {
        items = prev.items.map((i) =>
          i === existing ? { ...i, soLuong: i.soLuong + qty } : i
        );
      } else {
        const hinhAnh =
          product.hinhAnh || product.imageURL || "/default-shoe.png";
        items = [
          ...prev.items,
          { ...product, soLuong: qty, size, color, hinhAnh },
        ];
      }
      return { ...prev, items };
    });
  };

  const removeItem = (maChiTiet, size, color) =>
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter(
        (i) =>
          !(i.maChiTiet === maChiTiet && i.size === size && i.color === color)
      ),
    }));

  const updateQuantity = (maChiTiet, qty, size, color) =>
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.maChiTiet === maChiTiet && i.size === size && i.color === color
          ? { ...i, soLuong: qty }
          : i
      ),
    }));

  const clearCart = () =>
    setCart({ items: [], maKhuyenMai: null, diemSuDung: 0 });

  const applyPromo = async (maKhuyenMai) => {
    if (!maKhuyenMai) {
      setKhuyenMaiInfo(null);
      setCart((prev) => ({ ...prev, maKhuyenMai: null }));
      return;
    }
    try {
      const km = await api.get(`/khuyenmai/${maKhuyenMai}`);
      if (km) {
        setKhuyenMaiInfo(km);
        setCart((prev) => ({ ...prev, maKhuyenMai }));
      } else {
        alert("Mã khuyến mãi không hợp lệ hoặc đã hết hạn.");
        setKhuyenMaiInfo(null);
        setCart((prev) => ({ ...prev, maKhuyenMai: null }));
      }
    } catch (err) {
      console.error("Lỗi khi áp dụng khuyến mãi:", err);
      alert("Mã khuyến mãi không tồn tại.");
      setKhuyenMaiInfo(null);
      setCart((prev) => ({ ...prev, maKhuyenMai: null }));
    }
  };

  const usePoints = (diem) => {
    const diemHopLe = Math.min(diem, diemTichLuy, MAX_POINT_DISCOUNT);
    setCart((prev) => ({ ...prev, diemSuDung: diemHopLe }));
  };

  const { subtotal, giamGiaKM, diemTienMat, total } = calculateTotals(
    cart,
    khuyenMaiInfo
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        danhSachKM,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyPromo,
        usePoints,
        subtotal,
        total,
        giamGiaKM,
        diemTienMat,
        phiVanChuyen: SHIPPING_FEE,
        diemKhachHang: diemTichLuy,
        username,
        setUsername,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
