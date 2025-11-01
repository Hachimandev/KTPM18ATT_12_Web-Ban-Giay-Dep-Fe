import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import bootImg from '../assets/image/giay-boot-da.png';
import canvasImg from '../assets/image/giay-canvas.png';
import caoGotImg from '../assets/image/giay-caogot.png';
import chayBoImg from '../assets/image/giay-chay-bo.png';
import luoiImg from '../assets/image/giay-luoi.png';
import oxford from '../assets/image/giay-oxford.png';
import sneakerImg from '../assets/image/giay-sneaker-trang.png';
import sandalImg3 from '../assets/image/sandal3.jpg';
import sandalImg1 from '../assets/image/sandalngang.jpg';
import sandalImg2 from '../assets/image/sandalnu.jpg';

const products = [
  {
    id: 1,
    img: sneakerImg,
    name: 'Giày Sneaker Trắng',
    desc: 'Giày thể thao thời trang',
    price: '899,000đ',
    type: "sneaker",
    gender: "unisex",
    brand: "Nike",
    origin: "Vietnam",
    material: "Vải + Cao su",
    style: "Thể thao - Casual",
  },
  {
    id: 2,
    img: bootImg,
    name: 'Giày Boot Da',
    desc: 'Giày boot da cao cấp',
    price: '1,299,000đ',
    type: "boot",
    gender: "male",
    brand: "Dr. Martens",
    origin: "UK",
    material: "Da thật",
    style: "Công sở - Cá tính",
  },
  {
    id: 3,
    img: caoGotImg,
    name: 'Giày Cao Gót',
    desc: 'Giày cao gót thanh lịch',
    price: '799,000đ',
    type: "high-heels",
    gender: "female",
    discount: "20%",
    brand: "Charles & Keith",
    origin: "Singapore",
    material: "Da PU",
    style: "Thanh lịch",
  },
  {
    id: 4,
    img: luoiImg,
    name: 'Giày Lười',
    desc: 'Giày lười thời trang',
    price: '699,000đ',
    type: "loafers",
    gender: "male",
    brand: "Gucci",
    origin: "Italy",
    material: "Da bò",
    style: "Lịch lãm",
  },
  {
    id: 5,
    img: chayBoImg,
    name: 'Giày Chạy Bộ',
    desc: 'Giày thể thao chuyên nghiệp',
    price: '1,199,000đ',
    type: "running",
    gender: "unisex",
    discount: "20%",
    brand: "Adidas",
    origin: "Vietnam",
    material: "Mesh + Cao su",
    style: "Thể thao",
  },
  {
    id: 6,
    img: canvasImg,
    name: 'Giày Canvas',
    desc: 'Giày vải thời trang trẻ trung',
    price: '599,000đ',
    type: "canvas",
    gender: "unisex",
    brand: "Converse",
    origin: "USA",
    material: "Canvas + Cao su",
    style: "Casual - Streetwear",
  },
  {
    id: 7,
    img: oxford,
    name: 'Giày Oxford',
    desc: 'Giày công sở lịch lãm',
    price: '1,499,000đ',
    type: "oxford",
    gender: "male",
    discount: "20%",
    brand: "Oxford",
    origin: "Italy",
    material: "Da thật",
    style: "Công sở",
  },
  {
    id: 8,
    img: sandalImg1,
    name: "Dép Quai Ngang Nam",
    desc: "Dép nam thời trang, thoải mái đi cả ngày",
    price: "299,000đ",
    gender: "male",
    type: "sandal",
    brand: "Nike",
    origin: "Vietnam",
    material: "Cao su EVA",
    style: "Casual - Đi biển",
  },
  {
    id: 9,
    img: sandalImg2,
    name: "Dép Quai Hậu Nữ",
    desc: "Dép nữ quai hậu mềm mại, phong cách hiện đại",
    price: "349,000đ",
    gender: "female",
    type: "sandal",
    brand: "Dior",
    origin: "France",
    material: "Cao su + Vải",
    style: "Thời trang nữ",
  },
  {
    id: 10,
    img: sandalImg3,
    name: "Dép Unisex Thời Trang",
    desc: "Dép unisex đa năng, phù hợp mọi outfit",
    price: "399,000đ",
    gender: "unisex",
    type: "sandal",
    brand: "Adidas",
    origin: "Vietnam",
    material: "Cao su EVA",
    style: "Streetwear - Casual",
  }
];

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [qty, setQty] = useState(1);

  const sizes = [38, 39, 40, 41, 42, 43];
  const colors = ["#000000", "#1e40af", "#ffffff"]; // black, blue, white

  if (!product) return <div className="p-4">Sản phẩm không tồn tại.</div>;

  return (
    <div>
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left - Image */}
      <div>
        <img src={product.img} alt={product.name} className="rounded-xl w-full h-96 object-cover" />

        <div className="flex gap-3 mt-4">
          {[product.img, product.img, product.img].map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-20 h-20 rounded-xl border cursor-pointer object-cover"
            />
          ))}
        </div>
      </div>

      {/* Right - Info */}
      <div>
        <h1 className="text-2xl font-semibold mb-1">{product.name}</h1>
        <p className="text-gray-500 mb-2">{product.desc}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 text-yellow-500 mb-2">
          <Star className="w-5 h-5 fill-yellow-400" /> {product.rating} ({product.reviews} đánh giá)
        </div>

        {/* Price */}
        <div className="text-red-500 text-2xl font-bold mb-4">{product.price}</div>

        {/* Sizes */}
        <p className="font-semibold">Kích thước</p>
        <div className="flex gap-2 mb-4 mt-1">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-4 py-2 rounded-lg border ${size === s ? "border-black font-bold" : "text-gray-600"}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Colors */}
        <p className="font-semibold">Màu sắc</p>
        <div className="flex gap-3 mb-5 mt-1">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 ${color === c ? "border-black" : "border-gray-300"}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Quantity */}
        <p className="font-semibold">Số lượng</p>
        <div className="flex items-center gap-3 mb-5 mt-1">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1 border rounded-lg">-</button>
          <span className="text-lg font-medium">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="px-3 py-1 border rounded-lg">+</button>
        </div>

        {/* Buttons */}
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 mb-3">
          <ShoppingCart size={20} /> Thêm vào giỏ hàng
        </button>

        <button className="w-full bg-black hover:bg-gray-900 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 mb-3">
            Mua ngay
        </button>

        <button className="w-full border rounded-xl px-5 py-3 flex items-center justify-center gap-2">
          <Heart size={20} /> Thêm vào yêu thích
        </button>
        <div className="mt-6">
            <h4 className="font-semibold">Thông tin sản phẩm</h4>
            <ul className="text-gray-600 text-sm mt-2">
              <li className="flex justify-between w-full">Thương hiệu: <p className="font-semibold">{product.brand}</p> </li>
              <li className="flex justify-between w-full">Xuất xứ: <p className="font-semibold">{product.origin}</p></li>
              <li className="flex justify-between w-full">Chất liệu: <p className="font-semibold">{product.material}</p> </li>
              <li className="flex justify-between w-full">Phong cách: <p className="font-semibold">{product.style}</p> </li>
            </ul>
          </div>
    </div>
    </div>
    <div className="max-w-6xl mx-auto p-4">
        <div className="mt-10 border-b flex gap-6 text-gray-600">
        <button className="text-black font-semibold border-b-2 border-black pb-2">Mô tả sản phẩm</button>
        <button>Đánh giá ({product.reviews})</button>
        <button>Chính sách đổi trả</button>
      </div>

      <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>

      {/* Related Products */}
<div className=" w-full mt-12">
  <h2 className="text-lg font-semibold mb-4">Sản phẩm liên quan</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {products
      .filter((p) => p.gender === product.gender && p.id !== product.id)
      .slice(0, 4)
      .map((rp) => (
        <div
          key={rp.id}
          className="bg-white p-3 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
        >
          <img
            src={rp.img}
            className="w-full h-40 object-cover rounded-lg mb-2"
          />
          <p className="font-medium text-sm mb-1">{rp.name}</p>
          <p className="text-orange-500 font-bold text-sm mb-1">
            {rp.price}
          </p>

          
        </div>
      ))}
  </div>
</div>
</div>
      </div>
  );
}
