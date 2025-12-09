import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiUserPlus,
  FiSearch,
  FiChevronDown,
  FiUpload,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
} from "react-icons/fi";
import StatCardAdmin from "../../components/admin/widgets/StatCardAdmin";
import StatusBadge from "../../components/admin/widgets/StatusBadge";
import Pagination from "../../components/admin/widgets/Pagination";

const StaffPage = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [phongBan, setPhongBan] = useState("all");
  const [trangThai, setTrangThai] = useState("all");

  const departments = [
    { value: "all", label: "Tất cả phòng ban" },
    { value: "BanHang", label: "Bán hàng" },
    { value: "Kho", label: "Kho" },
    { value: "KyThuat", label: "Kỹ thuật" },
    { value: "HanhChinh", label: "Hành chính" },
    { value: "NhanSu", label: "Nhân sự" },
    { value: "TaiChinhKeToan", label: "Tài chính kế toán" },
    { value: "Marketing", label: "Marketing" },
  ];

  const statuses = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "DangLam", label: "Đang làm việc" },
    { value: "DaNghiViec", label: "Đã nghỉ việc" },
  ];

  const totalPages = Math.ceil(staff.length / ITEMS_PER_PAGE);

  const paginatedStaff = staff.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalStaff = staff.length;
  const activeStaff = staff.filter(
    (s) => s.trangThaiLamViec === "DangLam"
  ).length;
  const inactiveStaff = totalStaff - activeStaff;
  const departmentCount = new Set(staff.map((s) => s.phongBan)).size;

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("http://localhost:8085/api/staffs");
        if (!res.ok) throw new Error("Không thể tải nhân viên");
        const data = await res.json();
        console.log("Staff data:", data);

        // Lọc dữ liệu trên frontend
        let filtered = data.content || data || [];

        if (search) {
          filtered = filtered.filter(
            (s) =>
              s.hoTen?.toLowerCase().includes(search.toLowerCase()) ||
              s.maNhanVien?.toLowerCase().includes(search.toLowerCase())
          );
        }

        if (phongBan !== "all") {
          filtered = filtered.filter((s) => s.phongBan === phongBan);
        }

        if (trangThai !== "all") {
          filtered = filtered.filter((s) => s.trangThaiLamViec === trangThai);
        }

        setStaff(filtered);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [search, phongBan, trangThai]);

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xóa nhân viên này?")) return;

    try {
      const res = await fetch(`http://localhost:8085/api/staffs/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Xóa nhân viên thất bại");

      setStaff(staff.filter((s) => s.maNhanVien !== id));
      alert("Xóa nhân viên thành công");
    } catch (err) {
      console.error(err);
      alert("Không thể xóa nhân viên");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        Đang tải nhân viên...
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
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Nhân Viên</h1>
        <p className="text-gray-500 mt-1">
          Quản lý thông tin và quyền hạn nhân viên
        </p>
      </div>

      {/* 2. Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCardAdmin
          title="Tổng nhân viên"
          value={totalStaff}
          icon={<FiUsers size={22} className="text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatCardAdmin
          title="Đang làm việc"
          value={activeStaff}
          icon={<FiUserCheck size={22} className="text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatCardAdmin
          title="Không làm việc"
          value={inactiveStaff}
          icon={<FiUserX size={22} className="text-yellow-600" />}
          iconBg="bg-yellow-100"
        />
        <StatCardAdmin
          title="Phòng ban"
          value={departmentCount}
          icon={<FiUserPlus size={22} className="text-orange-600" />}
          iconBg="bg-orange-100"
        />
      </div>

      {/* 3. Toolbar Bảng */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên hoặc mã NV..."
              className="w-full border rounded-lg py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Filters & Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <select
              value={phongBan}
              onChange={(e) => setPhongBan(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>

            <select
              value={trangThai}
              onChange={(e) => setTrangThai(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                const params = new URLSearchParams({
                  search: search || "",
                  phongBan: phongBan === "all" ? "" : phongBan,
                  trangThai: trangThai === "all" ? "" : trangThai,
                });
                const url = params.toString()
                  ? `http://localhost:8085/api/staffs/export?${params.toString()}`
                  : "http://localhost:8085/api/staffs/export";
                window.open(url, "_blank");
              }}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
            >
              <FiUpload size={16} /> Xuất Excel
            </button>

            <button
              onClick={() => navigate("/admin/staffs/add")}
              className="flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              <FiPlus size={18} /> Thêm Nhân Viên
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bảng Dữ Liệu */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            {/* Table Header */}
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 w-10">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Nhân viên
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Mã NV
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Phòng ban
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Chức vụ
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
                  <td colSpan="8" className="p-4 text-center">
                    Đang tải...
                  </td>
                </tr>
              )}

              {!loading &&
                paginatedStaff.map((person) => (
                  <tr
                    key={person.maNhanVien}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <input type="checkbox" />
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {person.img && (
                          <img
                            src={person.img}
                            alt={person.hoTen}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-800">
                            {person.hoTen}
                          </p>
                          <p className="text-xs text-gray-500">
                            {person.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-sm text-gray-600">
                      {person.maNhanVien}
                    </td>

                    <td className="p-4 text-sm text-gray-600">
                      {person.email}
                    </td>

                    <td className="p-4 text-sm text-gray-600">
                      {person.phongBan
                        ? person.phongBan.replace(/_/g, " ")
                        : "N/A"}
                    </td>

                    <td className="p-4 text-sm text-gray-600">
                      {person.chucVu ? person.chucVu.replace(/_/g, " ") : "N/A"}
                    </td>

                    <td className="p-4">
                      <StatusBadge
                        status={
                          person.trangThaiLamViec === "DangLam"
                            ? "Đang làm"
                            : "Đã nghỉ"
                        }
                      />
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button className="text-blue-600 hover:text-blue-800">
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/staffs/edit/${person.maNhanVien}`)
                          }
                          className="text-green-600 hover:text-green-800"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(person.maNhanVien)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Pagination */}
      <Pagination
        infoText={`Hiển thị ${
          (currentPage - 1) * ITEMS_PER_PAGE + 1
        }-${Math.min(
          currentPage * ITEMS_PER_PAGE,
          staff.length
        )} trong tổng số ${staff.length} nhân viên`}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default StaffPage;
