// src/pages/adminpages/ProductsPage.jsx
// @ts-nocheck
import {
  FiPackage,
  FiCheckCircle,
  FiXCircle,
  FiList,
  FiPlus,
  FiSearch,
  FiChevronDown,
  FiUpload,
  FiFilter,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import StatCardAdmin from "../../components/admin/widgets/StatCardAdmin";
import StatusBadge from "../../components/admin/widgets/StatusBadge";
import Pagination from "../../components/admin/widgets/Pagination";
import productImageMap from "../../constants/productImages";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalProducts = products.length;

  const inStockProducts = products.filter(
    (p) =>
      p.chiTietSanPhams &&
      p.chiTietSanPhams.reduce((sum, ct) => sum + (ct.soLuongTonKho || 0), 0) >
        0
  ).length;

  const outOfStockProducts = totalProducts - inStockProducts;

  const categoryCount = new Set(
    products.map((p) => p.loaiSanPham?.tenLoai).filter(Boolean)
  ).size;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8085/api/products");
        if (!res.ok) throw new Error("Không thể tải sản phẩm");
        const data = await res.json();
        console.log(data);
        setProducts(data);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // delete
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      const res = await fetch(`http://localhost:8085/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Xóa sản phẩm thất bại");

      // ✅ Cập nhật UI ngay lập tức
      setProducts(products.filter((p) => p.maSanPham !== id));
      alert("Xóa sản phẩm thành công");
    } catch (err) {
      console.error(err);
      alert("Không thể xóa sản phẩm");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        Đang tải sản phẩm...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 text-lg">Lỗi: {error}</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header trang */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Quản lý sản phẩm</h1>
        <p className="text-gray-500 mt-1">Quản lý toàn bộ sản phẩm giày dép</p>
      </div>

      {/* 2. Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCardAdmin
          title="Tổng sản phẩm"
          value={totalProducts}
          icon={<FiPackage size={22} className="text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatCardAdmin
          title="Còn hàng"
          value={inStockProducts}
          icon={<FiCheckCircle size={22} className="text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatCardAdmin
          title="Hết hàng"
          value={outOfStockProducts}
          icon={<FiXCircle size={22} className="text-red-600" />}
          iconBg="bg-red-100"
        />
        <StatCardAdmin
          title="Danh mục"
          value={categoryCount}
          icon={<FiList size={22} className="text-orange-600" />}
          iconBg="bg-orange-100"
        />
      </div>

      {/* 3. Toolbar Bảng */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full border rounded-lg py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Filters & Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Tất cả danh mục <FiChevronDown size={16} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Trạng thái <FiChevronDown size={16} />
            </button>
            <button
              onClick={() => navigate("/admin/products/add")}
              className="flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              <FiPlus size={18} /> Thêm sản phẩm
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bảng Dữ Liệu */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            {/* Table Header */}
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 w-10">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Sản phẩm
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Danh mục
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Giá
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Tồn kho
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Trạng thái
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="7" className="p-4 text-center">
                    Đang tải...
                  </td>
                </tr>
              )}

              {!loading &&
                paginatedProducts.map((product) => {
                  const totalStock = product.chiTietSanPhams
                    ? product.chiTietSanPhams.reduce(
                        (sum, ct) => sum + (ct.soLuongTonKho || 0),
                        0
                      )
                    : 0;

                  return (
                    <tr
                      key={product.maSanPham}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <input type="checkbox" />
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product?.hinhAnh?.startsWith("http")
                                ? product.hinhAnh
                                : productImageMap[product.hinhAnh] ||
                                  "https://placehold.co/40"
                            }
                            alt={product.tenSanPham}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.tenSanPham}</p>
                            <p className="text-xs text-gray-500">
                              ID: {product.maSanPham}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-sm">
                        {product.loaiSanPham?.tenLoai}
                      </td>

                      <td className="p-4 font-medium">
                        {product.giaBan?.toLocaleString()} đ
                      </td>

                      <td className="p-4 text-sm">{totalStock}</td>

                      <td className="p-4">
                        <StatusBadge
                          status={totalStock > 0 ? "Còn hàng" : "Hết hàng"}
                        />
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button className="text-blue-600">
                            <FiEye />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/products/edit/${product.maSanPham}`
                              )
                            }
                            className="text-green-600 hover:text-green-800"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(product.maSanPham)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Pagination */}
      <Pagination
        infoText={`Hiển thị ${(currentPage - 1) * ITEMS_PER_PAGE + 1}-
    ${Math.min(currentPage * ITEMS_PER_PAGE, products.length)}
    trong tổng số ${products.length} sản phẩm`}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default ProductsPage;
