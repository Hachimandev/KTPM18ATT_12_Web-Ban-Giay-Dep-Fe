import { createContext, useContext, useState, useEffect } from "react";

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    maKhuyenMai: null,
    diemSuDung: 0,
  });

  const [username, setUsername] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (user) setUsername(user);
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
        newItems = [...prev.items, { ...product, soLuong: qty, size, color }];
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
  const applyPromo = (maKhuyenMai) => {
    setCart((prev) => ({ ...prev, maKhuyenMai }));
  };

  // --- Sử dụng điểm tích lũy ---
  const usePoints = (diem) => {
    setCart((prev) => ({ ...prev, diemSuDung: diem }));
  };

  // --- Tính tổng tiền ---
  const totalPrice = cart.items?.reduce(
    (sum, item) => sum + item.giaBan * item.soLuong,
    0
  );

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
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
