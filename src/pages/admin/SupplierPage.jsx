// @ts-nocheck
import { useEffect, useState } from "react";
import { FiDownload, FiEdit2, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/admin/widgets/Pagination";

const SupplierPage = () => {
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 5;

  const totalPages = Math.ceil(suppliers.length / ITEMS_PER_PAGE);

  const paginatedSuppliers = suppliers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        let url = "http://localhost:8085/api/suppliers";
        if (search.trim()) {
          url = `http://localhost:8085/api/suppliers/search?keyword=${encodeURIComponent(
            search
          )}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Không thể tải nhà cung cấp");
        const data = await res.json();
        console.log(data);
        setSuppliers(data);
        setCurrentPage(1);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [search]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Export to Excel
  const handleExportExcel = async () => {
    try {
      const res = await fetch(
        "http://localhost:8085/api/suppliers/export/excel"
      );
      if (!res.ok) throw new Error("Xuất Excel thất bại");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `NhaCungCap_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Lỗi xuất Excel:", err);
      alert("Không thể xuất Excel");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800">
          Danh sách nhà cung cấp
        </h1>
      </div>
      <p className="text-gray-500 mb-6">
        Hiển thị danh sách và trạng thái của các nhà cung cấp
      </p>

      {/* Filters */}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-orange-400 outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          {/* <select className="border rounded-lg px-3 py-2 text-gray-600">
            <option>Tất cả trạng thái</option>
            <option>Hoạt động</option>
            <option>Tạm dừng</option>
          </select> */}
          {/* <select className="border rounded-lg px-3 py-2 text-gray-600">
            <option>Tất cả khu vực</option>
            <option>TP.HCM</option>
            <option>Hà Nội</option>
            <option>Đà Nẵng</option>
          </select> */}

          <button
            onClick={handleExportExcel}
            className="border px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100"
          >
            <FiDownload /> Xuất Excel
          </button>
          {/* <button className="border px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100">
            <FiFilter /> Bộ lọc
          </button> */}
        </div>
        <button
          onClick={() => navigate("/admin/suppliers/add")}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700"
        >
          <FiPlus /> Thêm nhà cung cấp
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="p-3 w-4">
                <input type="checkbox" />
              </th>
              <th className="text-left p-3">Nhà cung cấp</th>
              <th className="text-left p-3">Liên hệ</th>
              <th className="text-left p-3">Địa chỉ</th>
              <th className="text-center p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  Đang tải...
                </td>
              </tr>
            )}
            {!loading && paginatedSuppliers.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Không tìm thấy nhà cung cấp
                </td>
              </tr>
            )}
            {!loading &&
              paginatedSuppliers.map((s) => (
                <tr
                  key={s.maNhaCungCap}
                  className="border-b hover:bg-gray-50 text-sm"
                >
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        {s.tenNhaCungCap}
                      </span>
                      <span className="text-xs text-gray-500">
                        Mã: {s.maNhaCungCap}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        {s.sdt} | {s.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-gray-600">{s.diaChi}</td>

                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/suppliers/edit/${s.maNhaCungCap}`)
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 />
                    </button>
                    {/* <button className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(s.maNhaCungCap)}
                  >
                    <FiTrash2 />
                  </button> */}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        infoText={`Hiển thị ${(currentPage - 1) * ITEMS_PER_PAGE + 1}-
    ${Math.min(currentPage * ITEMS_PER_PAGE, suppliers.length)}
    trong tổng số ${suppliers.length} nhà cung cấp`}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default SupplierPage;
