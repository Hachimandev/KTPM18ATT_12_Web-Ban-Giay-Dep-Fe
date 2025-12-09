// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import {
  FiUsers,
  FiUser,
  FiSearch,
  FiChevronDown,
  FiUpload,
} from "react-icons/fi";
import Pagination from "../../components/admin/widgets/Pagination";
import StatCardAdmin from "../../components/admin/widgets/StatCardAdmin";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [spendingRange, setSpendingRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [newThisMonth, setNewThisMonth] = useState(0);

  const ITEMS_PER_PAGE = 10;

  const fetchStats = useCallback(async () => {
    try {
      const totalRes = await fetch(
        "http://localhost:8085/api/khachhang/stats/total-count"
      );
      const newRes = await fetch(
        "http://localhost:8085/api/khachhang/stats/new-this-month"
      );

      if (totalRes.ok) {
        const totalText = await totalRes.text();
        const total = totalText ? JSON.parse(totalText) : 0;
        setTotalCustomers(total);
      }
      if (newRes.ok) {
        const newText = await newRes.text();
        const newCount = newText ? JSON.parse(newText) : 0;
        setNewThisMonth(newCount);
      }
    } catch (err) {
      console.error("Lỗi khi lấy thống kê:", err);
      setTotalCustomers(0);
      setNewThisMonth(0);
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);

      // Convert spending range to min/max spend
      if (spendingRange) {
        const rangeMap = {
          under1m: { min: 0, max: 999999 },
          "1m_10m": { min: 1000000, max: 10000000 },
          "10m_20m": { min: 10000001, max: 20000000 },
          "20m_50m": { min: 20000001, max: 50000000 },
          "50m_100m": { min: 50000001, max: 100000000 },
          over100m: { min: 100000001, max: Number.MAX_SAFE_INTEGER },
        };
        const range = rangeMap[spendingRange];
        if (range) {
          params.append("minSpend", range.min);
          params.append("maxSpend", range.max);
        }
      }

      params.append("page", currentPage - 1);
      params.append("size", ITEMS_PER_PAGE);

      const res = await fetch(
        `http://localhost:8085/api/khachhang/search?${params}`
      );
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }

      const text = await res.text();
      if (!text) {
        throw new Error("Server trả về response trống");
      }

      const data = JSON.parse(text);
      setCustomers(data.content || []);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      setError(err.message);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [search, spendingRange, currentPage]);

  // Fetch customers data on mount
  useEffect(() => {
    fetchCustomers();
    fetchStats();
  }, [fetchCustomers, fetchStats]);

  const handleExportExcel = async () => {
    try {
      const res = await fetch(
        "http://localhost:8085/api/khachhang/export/excel"
      );
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }

      const blob = await res.blob();
      if (blob.size === 0) {
        throw new Error("File Excel trống");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "khach_hang.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Lỗi xuất Excel:", err);
      alert("Lỗi xuất Excel: " + err.message);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setSpendingRange("");
    setCurrentPage(1);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const totalPages = Math.ceil(totalCustomers / ITEMS_PER_PAGE);

  if (error && customers.length === 0) {
    return (
      <div className="text-center py-10 text-red-500 text-lg">Lỗi: {error}</div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý khách hàng</h1>
      </div>
      <p className="text-gray-500 mb-6">
        Quản lý thông tin và theo dõi hoạt động của khách hàng
      </p>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StatCardAdmin
          title="Tổng khách hàng"
          value={totalCustomers}
          icon={<FiUsers size={22} className="text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatCardAdmin
          title="Mới tháng này"
          value={newThisMonth}
          icon={<FiUser size={22} className="text-green-600" />}
          iconBg="bg-green-100"
        />
      </div>

      {/* Filters Section */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
        <div className="flex items-end justify-between gap-3">
          {/* Left side: Search and Spending Filter */}
          <div className="flex items-end gap-3">
            {/* Search by name or ID */}
            <div className="w-80">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc mã..."
                  className="w-full border rounded-lg py-2 px-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Spending Range Filter */}
            <div className="w-56 h-10 flex items-center">
              <select
                className="w-full h-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                value={spendingRange}
                onChange={(e) => {
                  setSpendingRange(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">-- Tất cả tổng chi tiêu --</option>
                <option value="under1m">Dưới 1 triệu</option>
                <option value="1m_10m">1 - 10 triệu</option>
                <option value="10m_20m">10 - 20 triệu</option>
                <option value="20m_50m">20 - 50 triệu</option>
                <option value="50m_100m">50 - 100 triệu</option>
                <option value="over100m">Trên 100 triệu</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition h-10"
            >
              Xóa bộ lọc
            </button>
          </div>

          {/* Right side: Export Button */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 border-2 border-green-500 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-medium h-10"
          >
            <FiUpload size={16} /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            {/* Table Header */}
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Tên khách hàng
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Số điện thoại
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Tổng chi tiêu
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Ngày tham gia
                </th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              )}

              {!loading && customers.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    Không tìm thấy khách hàng
                  </td>
                </tr>
              )}

              {!loading &&
                customers.map((customer) => (
                  <tr
                    key={customer.maKhachHang}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                          {customer.hoTen.charAt(0)}
                        </div>
                        {customer.hoTen}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {customer.email || "-"}
                    </td>
                    <td className="p-4 text-gray-600">{customer.sdt || "-"}</td>
                    <td className="p-4 font-medium text-orange-600">
                      {formatCurrency(customer.tongChiTieu || 0)}
                    </td>
                    <td className="p-4 text-gray-600">
                      {formatDate(customer.ngayThamGia)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && customers.length > 0 && (
        <Pagination
          infoText={`Hiển thị ${
            (currentPage - 1) * ITEMS_PER_PAGE + 1
          }-${Math.min(
            currentPage * ITEMS_PER_PAGE,
            totalCustomers
          )} trong tổng số ${totalCustomers} khách hàng`}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      )}
    </div>
  );
};

export default CustomerPage;
