import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../api/api";

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const SHIPPING_FEE = 30000;
const POINT_VALUE = 1000;
const MAX_POINT_DISCOUNT = 10000;

export const CartProvider = ({ children }) => {

  const [khuyenMaiInfo, setKhuyenMaiInfo] = useState(null);
  const [diemTichLuy, setDiemTichLuy] = useState(0);

  const [cart, setCart] = useState({
    items: [],
    maKhuyenMai: null,
    diemSuDung: 0,
  });

  const [username, setUsername] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (user) {
      setUsername(user);
      // LÝ TƯỞNG: Gọi API để lấy điểm tích lũy của KH
      // api.get(`/khachhang/${user}/points`).then(setDiemTichLuy);
      setDiemTichLuy(5000); // Giả định có 5000 điểm
    }
  }, []);

  useEffect(() => {
    if (!username) return;
    const cartKey = `cart_${username}`;
    const storedCart = localStorage.getItem(cartKey);
    if (storedCart) setCart(JSON.parse(storedCart));
  }, [username]);

  useEffect(() => {
    if (!username) return;
    const cartKey = `cart_${username}`;
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, username]);

  const calculateFinalPrice = (currentCart, kmInfo) => {
    // 1. Tạm tính (Subtotal)
    const subtotal = currentCart.items.reduce(
      (sum, item) => sum + item.giaBan * item.soLuong,
      0
    );

    // 2. Tổng giá trị hóa đơn (trước khi trừ điểm)
    let totalValue = subtotal + SHIPPING_FEE;

    // 3. Áp dụng Mã Khuyến Mãi (KM)
    const chietKhauKM = kmInfo?.chietKhau || 0;
    const giamGiaKM = totalValue * chietKhauKM;
    totalValue -= giamGiaKM;

    // 4. Áp dụng Chiết khấu Điểm
    const maxDiemSuDung = Math.min(currentCart.diemSuDung, diemTichLuy);
    const diemTienMat = Math.min(maxDiemSuDung, MAX_POINT_DISCOUNT);

    totalValue -= diemTienMat;

    // 5. Tổng cộng cuối cùng
    if (totalValue < 0) totalValue = 0;

    return {
      subtotal,
      giamGiaKM,
      diemTienMat,
      total: totalValue,
      maxPointDiscount: MAX_POINT_DISCOUNT,
      maxDiemKhachHang: diemTichLuy
    };
  };



  // --- Thêm sản phẩm ---
  const addItem = (product, qty, size, color) => {
    setCart((prev) => {
      const existing = prev.items.find(
        (item) =>
          item.maChiTiet === product.maChiTiet &&
          item.size === size &&
          item.color === color
      );

      let newItems;
      if (existing) {
        newItems = prev.items.map((item) =>
          item === existing ? { ...item, soLuong: item.soLuong + qty } : item
        );
      } else {
        // ✅ ép sản phẩm có hình ảnh (ưu tiên product.img hoặc product.hinhAnh)
        const hinhAnh = product.img || product.hinhAnh || product.imageURL || "/default-shoe.png";

        newItems = [
          ...prev.items,
          { ...product, soLuong: qty, size, color, hinhAnh }
        ];
      }

      return { ...prev, items: newItems };
    });
  };

  // --- Xóa sản phẩm ---
  const removeItem = (maChiTiet, size, color) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter(
        (item) =>
          !(
            item.maChiTiet === maChiTiet &&
            item.size === size &&
            item.color === color
          )
      ),
    }));
  };

  // --- Cập nhật số lượng ---
  const updateQuantity = (maChiTiet, qty, size, color) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.maChiTiet === maChiTiet &&
          item.size === size &&
          item.color === color
          ? { ...item, soLuong: qty }
          : item
      ),
    }));
  };

  // --- Xóa toàn bộ giỏ hàng ---
  const clearCart = () => {
    setCart({ items: [], maKhuyenMai: null, diemSuDung: 0 });
  };

  // --- Áp dụng mã khuyến mãi ---
  // const applyPromo = (maKhuyenMai) => {
  //   setCart((prev) => ({ ...prev, maKhuyenMai }));
  // };

  const applyPromo = (maKhuyenMai) => {
    // LÝ TƯỞNG: Gọi API để kiểm tra mã KM
    // api.get(`/khuyenmai/${maKhuyenMai}`).then(setKhuyenMaiInfo)

    // Giả lập KM (10% nếu mã là SALE10)
    let info = null;
    if (maKhuyenMai.toUpperCase() === 'SALE10') {
      info = { maKhuyenMai, chietKhau: 0.10 };
    }

    setKhuyenMaiInfo(info);
    setCart((prev) => ({ ...prev, maKhuyenMai: info ? maKhuyenMai : null }));
  };

  // --- Sử dụng điểm tích lũy ---
  const usePoints = (diem) => {
    // Đảm bảo số điểm không vượt quá điểm tối đa cho phép
    const diemHopLe = Math.min(diem, diemTichLuy, MAX_POINT_DISCOUNT);
    setCart((prev) => ({ ...prev, diemSuDung: diemHopLe }));
  };

  // --- Tính toán tổng tiền ngay lập tức ---
  const totals = calculateFinalPrice(cart, khuyenMaiInfo);

  // --- Tính tổng tiền ---
  // const totalPrice = cart.items?.reduce(
  //   (sum, item) => sum + item.giaBan * item.soLuong,
  //   0
  // );

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyPromo,
        usePoints,
        subtotal: totals.subtotal,
        total: totals.total,
        giamGiaKM: totals.giamGiaKM,
        diemTienMat: totals.diemTienMat,

        phiVanChuyen: SHIPPING_FEE,
        diemKhachHang: totals.maxDiemKhachHang,
        maxPointDiscount: totals.maxPointDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
