import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
/**
 * @typedef {import('../types/types').SanPham} SanPham
 */

// @ts-nocheck
import * as api from "../api/api";
import productImageMap from '../constants/productImages';

const PRICE_RANGES = [
  { label: "Dưới 500.000đ", min: 0, max: 500000 },
  { label: "500.000đ - 1.000.000đ", min: 500000, max: 1000000 },
  { label: "1.000.000đ - 2.000.000đ", min: 1000000, max: 2000000 },
  { label: "Trên 2.000.000đ", min: 2000000, max: 50000000 },
];
const BRANDS = ["Nike", "Adidas", "Converse", "Vans"];
const SIZES = [36, 37, 38, 39, 40, 41, 42, 43];


export default function ProductListPage({ category = "all" }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryTerm = searchParams.get('q') || '';

  const [sort, setSort] = useState("newest");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    priceIndex: null,
    brand: [],
    size: [],
  });

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      const current = prev[type];
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [type]: [...current, value] };
      }
    });
  };

  const handlePriceChange = (index) => {
    setFilters(prev => ({
      ...prev,
      priceIndex: prev.priceIndex === index ? null : index,
    }));
  };


  const filteredProducts = useMemo(() => {
    let result = Array.isArray(products) ? products : [];

    if (filters.brand.length > 0) {
      result = result.filter(p => filters.brand.includes(p.thuongHieu));
    }
    if (filters.size.length > 0) {
      result = result.filter(p => {
        const sizeStrings = filters.size.map(s => String(s));
        if (!p.chiTietSanPhams) return false;
        return p.chiTietSanPhams.some(ct => sizeStrings.includes(String(ct.size)));
      });
    }

    if (sort === 'price_low') {
      result.sort((a, b) => a.giaBan - b.giaBan);
    } else if (sort === 'price_high') {
      result.sort((a, b) => b.giaBan - a.giaBan);
    }

    return result;
  }, [products, filters, sort]);

  const fetchProducts = () => {
    setLoading(true);
    const query = new URLSearchParams();

    if (queryTerm) query.append('searchTerm', queryTerm);
    if (category && category !== 'all') query.append('category', category);

    if (filters.priceIndex !== null) {
      const range = PRICE_RANGES[filters.priceIndex];
      query.append('minPrice', range.min);
      if (range.max !== 50000000) {
        query.append('maxPrice', range.max);
      }
    }
    filters.brand.forEach(b => query.append('brand', b));
    filters.size.forEach(s => query.append('sizes', s));

    if (sort !== 'newest') query.append('sort', sort);

    const queryString = query.toString();

    api.get(`/products${queryString ? '?' + queryString : ''}`)
      .then(res => {
        setProducts(Array.isArray(res) ? res : []);
      })
      .catch(error => {
        console.error("Lỗi khi fetch sản phẩm:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [queryTerm, category, filters, sort]);


  return (
    <div className="flex gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white rounded-2xl shadow p-4 h-fit sticky top-20">
        <h3 className="font-bold text-xl border-b pb-2 mb-3">Bộ lọc</h3>

        {/* Bộ lọc Khoảng giá */}
        <div className="mb-4 border-b pb-4">
          <h4 className="font-semibold mb-2 text-gray-700">Khoảng giá</h4>
          {PRICE_RANGES.map((range, index) => (
            <label className="block text-sm mb-1 text-gray-600 hover:text-black cursor-pointer" key={index}>
              <input
                type="checkbox"
                className="mr-2 rounded text-orange-500 focus:ring-orange-500"
                id={`price-filter-${index}`}
                name="price_range"
                checked={filters.priceIndex === index}
                onChange={() => handlePriceChange(index)}
              /> {range.label}
            </label>
          ))}
        </div>

        {/* Bộ lọc Thương hiệu */}
        <div className="mb-4 border-b pb-4">
          <h4 className="font-semibold mb-2 text-gray-700">Thương hiệu</h4>
          {BRANDS.map((b) => (
            <label className="block text-sm mb-1 text-gray-600 hover:text-black cursor-pointer" key={b}>
              <input
                type="checkbox"
                className="mr-2 rounded text-orange-500 focus:ring-orange-500"
                id={`brand-filter-${b}`}
                name="brand_filter"
                checked={filters.brand.includes(b)}
                onChange={() => handleFilterChange('brand', b)}
              /> {b}
            </label>
          ))}
        </div>

        {/* Bộ lọc Kích cỡ */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-gray-700">Kích cỡ</h4>
          <div className="grid grid-cols-4 gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                className={`border p-1 rounded text-sm transition duration-150 
                            ${filters.size.includes(s) ? 'bg-black text-white' : 'bg-white hover:bg-gray-200 text-gray-700'}`}
                onClick={() => handleFilterChange('size', s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => console.log('Áp dụng filters:', filters)} // Giả lập nút áp dụng
          className="w-full bg-orange-500 text-white py-2 rounded-lg mt-2 font-semibold hover:bg-orange-600 transition-colors"
        >
          Áp dụng bộ lọc ({filteredProducts.length})
        </button>
      </div>

      {/* Products */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">
            {queryTerm && <span className="font-semibold text-black">Kết quả tìm kiếm cho: "{queryTerm}"</span>}
            {filteredProducts.length > 0 && <span>Hiển thị {filteredProducts.length} sản phẩm</span>}
            {filteredProducts.length === 0 && !loading && <span>Không tìm thấy sản phẩm phù hợp.</span>}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-lg p-2 text-gray-700 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_low">Giá thấp đến cao</option>
            <option value="price_high">Giá cao đến thấp</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center p-10 text-xl text-gray-600">Đang tải sản phẩm...</div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <Link to={`/products/${p.maSanPham}`} key={p.maSanPham}>
                <div className="bg-white p-3 rounded-2xl shadow hover:shadow-lg transition">
                  <div className="relative">
                    {(p.thue > 0) && (
                      <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded text-white bg-red-500 font-semibold">
                        -{Math.round(p.thue * 100)}%
                      </span>
                    )}
                    <img
                      src={productImageMap[p.hinhAnh] || 'https://placehold.co/400x400?text=No+Image'}
                      alt={p.tenSanPham}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="font-semibold mt-2 text-lg">{p.tenSanPham}</h3>
                  <p className="text-gray-500 text-sm mb-1">{p.loaiSanPham?.tenLoai}</p>
                  <p className="text-orange-600 font-bold text-lg">
                    {p.giaBan.toLocaleString()}đ
                  </p>
                  <button className="mt-2 w-full bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}