import { Heart, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { get } from "../api/api";
import productImageMap from "../constants/productImages";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [stock, setStock] = useState(0);

  // --- Lấy sản phẩm ---
  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    }
    fetchProduct();
  }, [id]);

  // --- Lấy chi tiết sản phẩm theo sản phẩm ---
  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const details = await get(`/product-details/by-product/${id}`);
        setProductDetails(details);
        console.log("Chi tiết sản phẩm:", details);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProductDetails();
  }, [id]);

  // --- Cập nhật stock khi chọn size/color ---
  useEffect(() => {
    if (!size || !color) {
      setStock(0);
      setQty(1);
      return;
    }

    const selectedDetail = productDetails.find(
      (d) => d.size === size && d.mau === color
    );

    if (selectedDetail) {
      setStock(selectedDetail.soLuongTonKho);
      setQty((prev) => Math.min(prev, selectedDetail.soLuongTonKho || 1));
    } else {
      setStock(0);
      setQty(1);
    }
  }, [size, color, productDetails]);

  // --- Lấy sản phẩm liên quan ---
  useEffect(() => {
    async function fetchRelated() {
      if (!product) return;
      try {
        const data = await get(`/products`);
        const related = data.filter(
          (p) =>
            p.loaiSanPham?.tenLoai === product.loaiSanPham?.tenLoai &&
            p.maSanPham !== product.maSanPham
        );

        const fallback =
          related.length > 0
            ? related
            : data
                .filter((p) => p.maSanPham !== product.maSanPham)
                .sort(() => Math.random() - 0.5)
                .slice(0, 4);

        setRelatedProducts(fallback.slice(0, 4));
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm liên quan:", error);
      }
    }
    fetchRelated();
  }, [product]);

  if (loading) return <div className="p-4">Đang tải...</div>;
  if (!product) return <div className="p-4">Sản phẩm không tồn tại.</div>;

  const mainImg =
    productImageMap[product.hinhAnh] ||
    "https://placehold.co/400x400?text=No+Image";

  // --- Lấy size & color từ chi tiết sản phẩm ---
  const sizes = [...new Set(productDetails.map((d) => d.size))];
  const colors = [...new Set(productDetails.map((d) => d.mau))];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* --- Left: Image --- */}
        <div>
          <img
            src={mainImg}
            alt={product.tenSanPham}
            className="rounded-xl w-full h-96 object-cover"
          />
          <div className="flex gap-3 mt-4">
            {[mainImg, mainImg, mainImg].map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-20 h-20 rounded-xl border cursor-pointer object-cover"
              />
            ))}
          </div>
        </div>

        {/* --- Right: Info --- */}
        <div>
          <h1 className="text-2xl font-semibold mb-1">{product.tenSanPham}</h1>
          <p className="text-gray-500 mb-2">{product.moTa}</p>

          <div className="text-red-500 text-2xl font-bold mb-4">
            {product.giaBan.toLocaleString()}đ
          </div>

          {/* --- Sizes --- */}
          {sizes.length > 0 && (
            <>
              <p className="font-semibold">Kích thước</p>
              <div className="flex gap-2 mb-4 mt-1">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded-lg border ${
                      size === s ? "border-black font-bold" : "text-gray-600"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* --- Colors --- */}
          {colors.length > 0 && (
            <>
              <p className="font-semibold">Màu sắc</p>
              <div className="flex gap-3 mb-1 mt-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full border-2 ${
                      color === c ? "border-black" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              {/* Hiển thị stock */}
              <p className="text-sm text-gray-500 mb-4">
                {stock > 0 ? `Còn ${stock} sản phẩm` : "Hết hàng"}
              </p>
            </>
          )}

          {/* --- Quantity --- */}
          <p className="font-semibold">Số lượng</p>
          <div className="flex items-center gap-3 mb-5 mt-1">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="px-3 py-1 border rounded-lg"
            >
              -
            </button>
            <span className="text-lg font-medium">{qty}</span>
            <button
              onClick={() => setQty(Math.min(qty + 1, stock))}
              className="px-3 py-1 border rounded-lg"
              disabled={stock === 0} // nếu hết hàng thì disable
            >
              +
            </button>
          </div>

          {/* --- Buttons --- */}
          <button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 mb-3"
            disabled={stock === 0}
          >
            <ShoppingCart size={20} /> Thêm vào giỏ hàng
          </button>

          <button
            className="w-full bg-black hover:bg-gray-900 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 mb-3"
            disabled={stock === 0}
          >
            Mua ngay
          </button>

          <button className="w-full border rounded-xl px-5 py-3 flex items-center justify-center gap-2">
            <Heart size={20} /> Thêm vào yêu thích
          </button>
        </div>
      </div>

      {/* --- Thông tin sản phẩm --- */}
      <div className="mt-10">
        <h4 className="font-semibold">Thông tin sản phẩm</h4>
        <ul className="text-gray-600 text-sm mt-2">
          <li className="flex justify-between">
            Thương hiệu: <p className="font-semibold">{product.thuongHieu}</p>
          </li>
          <li className="flex justify-between">
            Xuất xứ: <p className="font-semibold">{product.nuocSanXuat}</p>
          </li>
          <li className="flex justify-between">
            Chất liệu: <p className="font-semibold">{product.chatLieu}</p>
          </li>
          <li className="flex justify-between">
            Loại sản phẩm:{" "}
            <p className="font-semibold">
              {product.loaiSanPham?.tenLoai || "Không rõ"}
            </p>
          </li>
        </ul>
      </div>

      {/* --- Sản phẩm liên quan --- */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-4">Sản phẩm liên quan</h2>
        {relatedProducts.length === 0 ? (
          <p className="text-gray-500">Không có sản phẩm liên quan.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => {
              const img =
                productImageMap[rp.hinhAnh] ||
                "https://placehold.co/300x300?text=No+Image";
              return (
                <Link
                  key={rp.maSanPham}
                  to={`/product/${rp.maSanPham}`}
                  className="bg-white p-3 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                >
                  <img
                    src={img}
                    alt={rp.tenSanPham}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                  <p className="font-medium text-sm mb-1">{rp.tenSanPham}</p>
                  <p className="text-orange-500 font-bold text-sm mb-1">
                    {rp.giaBan.toLocaleString()}đ
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
