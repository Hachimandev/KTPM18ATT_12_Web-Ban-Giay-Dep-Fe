import { useState } from "react";
import { Link } from "react-router-dom";

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
        gender: "unisex"
    },
    {
        id: 2,
        img: bootImg,
        name: 'Giày Boot Da',
        desc: 'Giày boot da cao cấp',
        price: '1,299,000đ',
        type: "boot",
        gender: "male"
    },
    {
        id: 3,
        img: caoGotImg,
        name: 'Giày Cao Gót',
        desc: 'Giày cao gót thanh lịch',
        price: '799,000đ',
        type: "high-heels",
        gender: "female",
        discount: "20%"
    },
    {
        id: 4,
        img: luoiImg,
        name: 'Giày Lười',
        desc: 'Giày lười thời trang',
        price: '699,000đ',
        type: "loafers",
        gender: "male"
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
    },
    {
        id: 6,
        img: canvasImg,
        name: 'Giày Canvas',
        desc: 'Giày vải thời trang trẻ trung',
        price: '599,000đ',
        type: "canvas",
        gender: "unisex"
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
    },
    {
        id: 8,
        img: sandalImg1,
        name: "Dép Quai Ngang Nam",
        desc: "Dép nam thời trang, thoải mái đi cả ngày",
        price: "299,000đ",
        gender: "male",
        type: "sandal",
    },
    {
        id: 9,
        img: sandalImg2,
        name: "Dép Quai Hậu Nữ",
        desc: "Dép nữ quai hậu mềm mại, phong cách hiện đại",
        price: "349,000đ",
        gender: "female",
        type: "sandal",
    },
    {
        id: 10,
        img: sandalImg3,
        name: "Dép Unisex Thời Trang",
        desc: "Dép unisex đa năng, phù hợp mọi outfit",
        price: "399,000đ",
        gender: "unisex",
        type: "sandal",
    }

];

export default function ProductListPage({ category = "all" }) {
  const [sort, setSort] = useState("newest");

  // Filter theo menu
  const filteredProducts = products.filter((p) => {
    if (category === "all") return true;
    if (category === "men") return ["male", "unisex"].includes(p.gender);
    if (category === "women") return ["female", "unisex"].includes(p.gender);
    if (category === "sandals") return p.type === "sandal";
    if (category === "sale") return p.discount;
    return true;
  });

  return (
    <div className="flex gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white rounded-2xl shadow p-4 h-fit">
        <h3 className="font-bold text-lg mb-3">Bộ lọc</h3>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Khoảng giá</h4>
          {[
            "Dưới 500.000đ",
            "500.000đ - 1.000.000đ",
            "1.000.000đ - 2.000.000đ",
            "Trên 2.000.000đ",
          ].map((p) => (
            <label className="block text-sm mb-1" key={p}>
              <input type="checkbox" className="mr-2" /> {p}
            </label>
          ))}
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Thương hiệu</h4>
          {["Nike", "Adidas", "Converse", "Vans"].map((b) => (
            <label className="block text-sm mb-1" key={b}>
              <input type="checkbox" className="mr-2" /> {b}
            </label>
          ))}
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Kích cỡ</h4>
          <div className="grid grid-cols-4 gap-2">
            {[36, 37, 38, 39, 40, 41].map((s) => (
              <button
                key={s}
                className="border p-1 rounded text-sm bg-white hover:bg-black hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button className="w-full bg-orange-500 text-white py-2 rounded-lg mt-2">
          Áp dụng bộ lọc
        </button>
      </div>

      {/* Products */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">Hiển thị {filteredProducts.length} sản phẩm</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_low">Giá thấp đến cao</option>
            <option value="price_high">Giá cao đến thấp</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <Link to={`/products/${p.id}`} key={p.id}>
            <div key={p.id} className="bg-white p-3 rounded-2xl shadow hover:shadow-lg transition">
              <div className="relative">
                {(p.discount || p.tag) && (
                  <span className={`absolute top-2 left-2 text-xs px-2 py-1 rounded text-white ${p.tag ? "bg-green-500" : "bg-orange-500"}`}>
                    {p.tag || p.discount}
                  </span>
                )}
                <img src={p.img} alt={p.name} className="w-full h-40 object-cover rounded-lg" />
              </div>

              <h3 className="font-semibold mt-2 text-lg">{p.name}</h3>
              <p className="text-gray-500 text-sm mb-1">{p.category}</p>
              <p className="text-orange-600 font-bold text-lg">
                {p.price.toLocaleString()}đ
                {p.oldPrice && (
                  <span className="text-gray-400 line-through ml-2 text-sm">{p.oldPrice.toLocaleString()}đ</span>
                )}
              </p>

              <button className="mt-2 w-full bg-black text-white py-2 rounded-lg text-sm">
                Thêm vào giỏ hàng
              </button>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
