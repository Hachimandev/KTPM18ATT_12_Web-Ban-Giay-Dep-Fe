// src/pages/admin/OrderPage.jsx
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { FiClock, FiDollarSign, FiDownload, FiInfo, FiShoppingCart, FiTruck, FiXCircle } from "react-icons/fi";
import * as api from "../../api/api";
import Pagination from "../../components/admin/widgets/Pagination";
import StatCardAdmin from "../../components/admin/widgets/StatCardAdmin";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [statusCount, setStatusCount] = useState({
    CHO_XAC_NHAN: 0, DANG_GIAO: 0, DA_GIAO: 0, DA_HUY: 0, TRA_HANG: 0, CHO_HUY: 0
  });
  const ITEMS_PER_PAGE = 10;

  const statusMap = {
    ALL: "Tất cả trạng thái",
    CHO_XAC_NHAN: "Chờ xác nhận",
    DANG_GIAO: "Đang giao",
    DA_GIAO: "Đã giao",
    DA_HUY: "Đã hủy",
    TRA_HANG: "Trả hàng",
    CHO_HUY: "Yêu cầu hủy",
  };

  const getNextStatusOptions = (currentStatus) => {
    const statusPriority = {
      CHO_XAC_NHAN: ['DANG_GIAO', 'DA_HUY'],
      DANG_GIAO: ['DA_GIAO', 'TRA_HANG'],
      DA_GIAO: ['TRA_HANG'],
      CHO_HUY: ['DA_HUY', 'DANG_GIAO'],
      DA_HUY: [],
      TRA_HANG: [],
    };
    const options = statusPriority[currentStatus] || [];
    return [currentStatus, ...options];
  };


  // --- API Fetching ---
  const fetchCounts = async () => {
    try {
      setLoadingCounts(true);
      const res = await api.get("/hoadon/counts");
      setStatusCount((prev) => ({ ...prev, ...res }));
    } catch (err) {
      console.error("Lỗi khi lấy thống kê trạng thái:", err);
    } finally {
      setLoadingCounts(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/hoadon");
      setOrders(res || []);
    } catch (err) {
      console.error("Lỗi khi lấy hóa đơn:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleChangeStatus = async (id, newStatus) => {
    try {
      await api.put(`/hoadon/${id}/status`, { trangThaiHoaDon: newStatus });
      toast.success(`Đã cập nhật trạng thái đơn ${id} sang ${statusMap[newStatus]}!`);
      await fetchOrders();
      await fetchCounts();
    } catch (err) {
      toast.error("Lỗi khi đổi trạng thái.");
      console.error("Lỗi khi đổi trạng thái:", err);
    }
  };

  const handleAdminCancelRequest = async (maHoaDon, isApprove) => {
    try {
      if (isApprove) {
        await api.post(`/hoadon/confirm-cancel/${maHoaDon}`, { approve: true });
        toast.success('Đã XÁC NHẬN HỦY đơn hàng!');

      } else {
        await api.post(`/hoadon/confirm-cancel/${maHoaDon}`, { approve: false });
        toast.success('Đã TỪ CHỐI yêu cầu hủy và chuyển về Đang giao!');
      }

      await fetchOrders();
      await fetchCounts()
    } catch (err) {
      const errorMessage = err.message || "Lỗi không xác định (Có thể do thiếu quyền 403).";
      toast.error(`Lỗi xử lý yêu cầu hủy: ${errorMessage.substring(0, 50)}...`);
      console.error(err);
    }
  };

  const handleExportExcel = async () => {
    try {
      const res = await api.get("/hoadon/export/excel", {
        isFileDownload: true
      });
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `HoaDon_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Xuất Excel thành công!");
    } catch (err) {
      console.error("Lỗi xuất Excel:", err);
      toast.error("Không thể xuất Excel");
    }
  };

  // --- Effects and Filtering ---
  useEffect(() => {
    fetchOrders();
    fetchCounts();
  }, []);

  const filteredOrders = orders.filter(
    (o) => {
      const matchesStatus = statusFilter === "ALL" || o.trangThaiHoaDon === statusFilter;

      const matchesSearch = o.maHoaDon?.toLowerCase().includes(search.toLowerCase()) ||
        o.khachHang?.hoTen?.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    }
  );

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const ordersToShow = filteredOrders.slice(startIndex, endIndex);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600 text-lg">Đang tải dữ liệu...</div>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

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
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
        >
          {Object.entries(statusMap).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <button
          onClick={handleExportExcel}
          className="border px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100"
        >
          <FiDownload /> Xuất Excel
        </button>
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
            {ordersToShow.map((o) => (
              <tr key={o.maHoaDon} className="border-b hover:bg-gray-50 text-sm">
                <td className="p-3 font-medium text-gray-800">{o.maHoaDon}</td>
                <td className="p-3 text-gray-700">{o.khachHang?.hoTen || "Ẩn danh"}</td>
                <td className="p-3 text-gray-600">{new Date(o.ngayDat).toLocaleString("vi-VN")}</td>
                <td className="p-3 text-gray-800 font-semibold">{o.thanhTien?.toLocaleString("vi-VN")}₫</td>
                <td className="p-3 text-gray-600">
                  {o.phuongThucThanhToan?.replaceAll("_", " ").toUpperCase() || "N/A"}
                </td>
                <td className="p-3">
                  <select
                    value={o.trangThaiHoaDon}
                    onChange={(e) => handleChangeStatus(o.maHoaDon, e.target.value)}
                    className={`
                          px-3 py-1 text-xs font-semibold rounded-full cursor-pointer border
                          transition duration-150 focus:ring-2 appearance-none pr-6
                          ${o.trangThaiHoaDon === 'CHO_HUY'
                        ? 'bg-red-100 text-red-700 border-red-300 focus:ring-red-300'
                        : o.trangThaiHoaDon === 'CHO_XAC_NHAN'
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-300 focus:ring-yellow-300'
                          : o.trangThaiHoaDon === 'DANG_GIAO'
                            ? 'bg-blue-100 text-blue-700 border-blue-300 focus:ring-blue-300'
                            : o.trangThaiHoaDon === 'DA_GIAO'
                              ? 'bg-green-100 text-green-700 border-green-300 focus:ring-green-300'
                              : o.trangThaiHoaDon === 'TRA_HANG'
                                ? 'bg-orange-100 text-orange-700 border-orange-300 focus:ring-orange-300'
                                : 'bg-gray-100 text-gray-600 border-gray-300'
                      }
              `}
                    disabled={
                      o.trangThaiHoaDon === 'DA_HUY' ||
                      o.trangThaiHoaDon === 'DA_GIAO' ||
                      o.trangThaiHoaDon === 'TRA_HANG'
                    }
                  >
                    {getNextStatusOptions(o.trangThaiHoaDon).map((key) => (
                      <option key={key} value={key}>
                        {statusMap[key]}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Cột Thao Tác (Action) */}
                <td className="p-3 whitespace-nowrap">
                  {(() => {
                    const isCancelRequest = o.trangThaiHoaDon === 'CHO_HUY';
                    const canConfirm = o.trangThaiHoaDon === 'CHO_XAC_NHAN';
                    const canFinish = o.trangThaiHoaDon === 'DANG_GIAO';

                    const hasAction = isCancelRequest || canConfirm || canFinish;

                    return (
                      <>
                        {isCancelRequest && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleAdminCancelRequest(o.maHoaDon, true)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                            >
                              Xác nhận hủy
                            </button>
                            <button
                              onClick={() => handleAdminCancelRequest(o.maHoaDon, false)}
                              className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                            >
                              Từ chối
                            </button>
                          </div>
                        )}

                        {canConfirm && (
                          <button
                            onClick={() => handleChangeStatus(o.maHoaDon, 'DANG_GIAO')}
                            className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                          >
                            Xác nhận
                          </button>
                        )}

                        {canFinish && (
                          <button
                            onClick={() => handleChangeStatus(o.maHoaDon, 'DA_GIAO')}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                          >
                            Hoàn tất
                          </button>
                        )}

                        {/* Nếu không có nút nào → hiện icon info */}
                        {!hasAction && (
                          <button className="text-gray-500 hover:text-gray-800 transition">
                            <FiInfo size={16} />
                          </button>
                        )}
                      </>
                    );
                  })()}
                </td>
              </tr>
            ))}

            {ordersToShow.length === 0 && (
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
        infoText={`Hiển thị ${ordersToShow.length} trên tổng ${filteredOrders.length} kết quả`}
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}