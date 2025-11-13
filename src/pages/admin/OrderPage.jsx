// @ts-nocheck
import { useEffect, useState } from "react";
import {
  FiShoppingCart,
  FiTruck,
  FiClock,
  FiDollarSign,
  FiXCircle,
} from "react-icons/fi";
import Pagination from "../../components/admin/widgets/Pagination";
import StatCardAdmin from "../../components/admin/widgets/StatCardAdmin";
import StatusBadge from "../../components/admin/widgets/StatusBadge";
import * as api from "../../api/api";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [statusCount, setStatusCount] = useState({
    CHO_XAC_NHAN: 0,
    DANG_GIAO: 0,
    DA_GIAO: 0,
    DA_HUY: 0,
    TRA_HANG: 0,
  });

  const totalPages = 1;

  useEffect(() => {
    fetchOrders();
    fetchCounts();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/hoadon");
      console.log("ORDERS API RESPONSE:", res); // debug
      setOrders(res || []);
    } catch (err) {
      console.error("Lỗi khi lấy hóa đơn:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const res = await api.get("/hoadon/counts");
      console.log("COUNTS API RESPONSE:", res); // debug
      setStatusCount((prev) => ({
        ...prev,
        ...res,
      }));
    } catch (err) {
      console.error("Lỗi khi lấy thống kê trạng thái:", err);
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      await api.put(`/hoadon/${id}/status`, { trangThaiHoaDon: newStatus });
      await fetchOrders();
      await fetchCounts();
    } catch (err) {
      console.error("Lỗi khi đổi trạng thái:", err);
    }
  };

  const statusMap = {
    CHO_XAC_NHAN: "Chờ xác nhận",
    DANG_GIAO: "Đang giao",
    DA_GIAO: "Đã giao",
    DA_HUY: "Đã hủy",
    TRA_HANG: "Trả hàng",
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.maHoaDon?.toLowerCase().includes(search.toLowerCase()) ||
      o.khachHang?.hoTen?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600 text-lg">Đang tải dữ liệu...</div>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý hóa đơn</h1>
      </div>
      <p className="text-gray-500 mb-6">
        Theo dõi và thay đổi trạng thái đơn hàng của khách hàng
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <StatCardAdmin
          title="Tổng đơn hàng"
          value={orders.length}
          icon={<FiShoppingCart size={22} className="text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatCardAdmin
          title="Chờ xác nhận"
          value={statusCount.CHO_XAC_NHAN || 0}
          icon={<FiClock size={22} className="text-orange-600" />}
          iconBg="bg-orange-100"
        />
        <StatCardAdmin
          title="Đang giao"
          value={statusCount.DANG_GIAO || 0}
          icon={<FiTruck size={22} className="text-yellow-600" />}
          iconBg="bg-yellow-100"
        />
        <StatCardAdmin
          title="Đã giao"
          value={statusCount.DA_GIAO || 0}
          icon={<FiDollarSign size={22} className="text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatCardAdmin
          title="Đã hủy / Trả hàng"
          value={(statusCount.DA_HUY || 0) + (statusCount.TRA_HANG || 0)}
          icon={<FiXCircle size={22} className="text-red-600" />}
          iconBg="bg-red-100"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm mã hoặc khách hàng..."
          className="border rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-orange-400 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="text-left p-3">Mã hóa đơn</th>
              <th className="text-left p-3">Khách hàng</th>
              <th className="text-left p-3">Ngày đặt</th>
              <th className="text-left p-3">Tổng tiền</th>
              <th className="text-left p-3">Thanh toán</th>
              <th className="text-left p-3">Trạng thái</th>
              <th className="text-left p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr
                key={o.maHoaDon}
                className="border-b hover:bg-gray-50 text-sm"
              >
                <td className="p-3 font-medium text-gray-800">{o.maHoaDon}</td>
                <td className="p-3 text-gray-700">
                  {o.khachHang?.hoTen || "Ẩn danh"}
                </td>
                <td className="p-3 text-gray-600">
                  {new Date(o.ngayDat).toLocaleString("vi-VN")}
                </td>
                <td className="p-3 text-gray-800 font-semibold">
                  {o.thanhTien?.toLocaleString("vi-VN")}₫
                </td>
                <td className="p-3 text-gray-600">
                  {o.phuongThucThanhToan?.replaceAll("_", " ").toUpperCase() ||
                    "N/A"}
                </td>
                <td className="p-3">
                  <StatusBadge status={statusMap[o.trangThaiHoaDon]} />
                </td>
                <td className="p-3">
                  <select
                    value={o.trangThaiHoaDon}
                    onChange={(e) => handleChangeStatus(o.maHoaDon, e.target.value)}
                    className="border px-2 py-1 rounded-md text-sm text-gray-700"
                  >
                    {Object.keys(statusMap).map((key) => (
                      <option
                        key={key}
                        value={key}
                        style={{
                          color:
                            key === "CHO_XAC_NHAN"
                              ? "#f97316" // orange
                              : key === "DANG_GIAO"
                                ? "#facc15" // yellow
                                : key === "DA_GIAO"
                                  ? "#16a34a" // green
                                  : key === "DA_HUY" || key === "TRA_HANG"
                                    ? "#dc2626" // red
                                    : "#000",
                        }}
                      >
                        {statusMap[key]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 italic"
                >
                  Không có hóa đơn nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        infoText={`Hiển thị ${filteredOrders.length} kết quả`}
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
