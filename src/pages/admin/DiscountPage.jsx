// @ts-nocheck
import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiFileText, FiPlus, FiSearch } from "react-icons/fi";
import Pagination from "../../components/admin/widgets/Pagination";
import { useNavigate } from 'react-router-dom'; // 💡 IMPORT USE NAVIGATE
import * as api from "../../api/api";
import toast, { Toaster } from 'react-hot-toast';


const DiscountPage = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 10;

  // --- UTILS ---
  const getStatusText = (item) => {
    const now = new Date();
    // Chuyển đổi chuỗi ngày sang Date object
    const start = new Date(item.ngayBatDau);
    const end = new Date(item.ngayKetThuc);

    if (now < start) return "Sắp diễn ra";
    if (now > end) return "Hết hạn";
    return "Đang hoạt động";
  };

  // --- API FETCHING ---
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/khuyenmai");
      setPromotions(res || []);
    } catch (err) {
      console.error("Lỗi khi tải khuyến mãi:", err);
      toast.error("Không thể tải dữ liệu khuyến mãi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleAdd = () => {
    navigate('/admin/discounts/add');
  };
  const handleEdit = (item) => {
    navigate(`/admin/discounts/edit/${item.maKhuyenMai}`);
  };

  const handleDelete = async (maKhuyenMai) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khuyến mãi ${maKhuyenMai}?`)) {
      return;
    }
    try {
      await api.remove(`/khuyenmai/${maKhuyenMai}`);
      toast.success(`Đã xóa khuyến mãi ${maKhuyenMai} thành công.`);
      await fetchPromotions();
    } catch (err) {
      console.error("Lỗi xóa khuyến mãi:", err);
      toast.error("Lỗi khi xóa khuyến mãi (Có thể do thiếu quyền).");
    }
  };

  const filteredPromotions = promotions.filter(item => {
    const status = getStatusText(item);
    const matchesStatus = statusFilter === "ALL" || status === statusFilter;

    const searchLower = search.toLowerCase();
    const matchesSearch = item.maKhuyenMai?.toLowerCase().includes(searchLower) ||
      item.dieuKien?.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPromotions.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const promotionsToShow = filteredPromotions.slice(startIndex, endIndex);


  if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Khuyến mãi</h1>

      {/* Header actions */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-[#F97316] text-white px-4 py-2 rounded-md hover:bg-orange-500"
          >
            <FiPlus /> Tạo khuyến mãi mới
          </button>

        </div>

        <div className="flex gap-2">
          {/* Tìm kiếm */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm mã/điều kiện..."
              className="pl-9 pr-3 py-2 border rounded-md text-sm w-60 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset trang khi tìm kiếm
              }}
            />
          </div>
          {/* Select Lọc Trạng thái */}
          <select
            className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1); // Reset trang khi lọc
            }}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="Đang hoạt động">Đang hoạt động</option>
            <option value="Sắp diễn ra">Sắp diễn ra</option>
            <option value="Hết hạn">Hết hạn</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">
                <input type="checkbox" />
              </th>
              <th className="p-3">Mã KM</th>
              <th className="p-3">Điều kiện</th>
              <th className="p-3">Chiết khấu</th>
              <th className="p-3">Thời gian</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {promotionsToShow.map((item) => {
              const status = getStatusText(item);
              // Giả định: chiết khấu < 1 là phần trăm, >= 1 là tiền cố định
              const discountType = item.chietKhau >= 1 ? "Cố định" : "Phần trăm";
              const displayValue = discountType === "Phần trăm"
                ? `${(item.chietKhau * 100).toFixed(0)}%`
                : `${item.chietKhau.toLocaleString('vi-VN')}đ`;
              const timeRange = `${new Date(item.ngayBatDau).toLocaleDateString('vi-VN')} - ${new Date(item.ngayKetThuc).toLocaleDateString('vi-VN')}`;

              return (
                <tr key={item.maKhuyenMai} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3 font-medium">{item.maKhuyenMai}</td>
                  <td className="p-3">
                    <p className="font-medium">{item.dieuKien}</p>
                  </td>
                  <td className="p-3 font-semibold text-orange-600">
                    {displayValue}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {timeRange}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${status === "Đang hoạt động"
                        ? "bg-green-100 text-green-700"
                        : status === "Sắp diễn ra"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    {/* NÚT CHỈNH SỬA */}
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FiEdit />
                    </button>
                    {/* NÚT XÓA */}
                    {/* <button
                      onClick={() => handleDelete(item.maKhuyenMai)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button> */}
                  </td>
                </tr>
              );
            })}
            {promotionsToShow.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  Không tìm thấy khuyến mãi nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 flex-wrap">
        <p className="text-sm text-gray-600">
          Hiển thị {promotionsToShow.length} trên tổng số {filteredPromotions.length} kết quả
        </p>
        <Pagination
          infoText=""
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
};

export default DiscountPage;