import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SupplierFormPage = () => {
const navigate = useNavigate();
const { id } = useParams();
const isEdit = Boolean(id);

const [form, setForm] = useState({
    maNhaCungCap: "",
    tenNhaCungCap: "",
    sdt: "",
    email: "",
    diaChi: "",
});

  // ===== Lấy dữ liệu khi edit =====
useEffect(() => {
    if (!isEdit) return;

    const fetchSupplier = async () => {
        try {
        const res = await fetch(`http://localhost:8085/api/suppliers/${id}`, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!res.ok) throw new Error("Không lấy được nhà cung cấp");

        const data = await res.json();
        setForm(data);
        } catch (err) {
        console.error(err);
        alert("Lỗi khi tải nhà cung cấp");
        }
    };

    fetchSupplier();
    }, [id, isEdit]);

  // ===== Submit Form =====
const handleSubmit = async () => {
    try {
    const url = isEdit
        ? `http://localhost:8085/api/suppliers/${id}`
        : "http://localhost:8085/api/suppliers";

    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error("Lưu nhà cung cấp thất bại");

        (isEdit ? "Cập nhật thành công" : "Thêm nhà cung cấp thành công");
        navigate("/admin/suppliers");
    } catch (err) {
        console.error(err);
        alert("Lỗi khi lưu dữ liệu");
    }
};

    return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
        {isEdit ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp"}
        </h2>

      {/* FORM INPUT */}
        <div className="grid grid-cols-2 gap-4">
        <input
            value={form.maNhaCungCap}
            onChange={(e) => setForm({ ...form, maNhaCungCap: e.target.value })}
          disabled={isEdit} // sửa thì khóa mã
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Mã nhà cung cấp (Tự động)"
        />

        <input
            value={form.tenNhaCungCap}
            onChange={(e) =>
            setForm({ ...form, tenNhaCungCap: e.target.value })
        }
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Tên nhà cung cấp"
        />

        <input
            value={form.sdt}
            onChange={(e) => setForm({ ...form, sdt: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Số điện thoại"
        />

        <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Email"
        />
    </div>

        <textarea
        value={form.diaChi}
        onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
        className="w-full border rounded-lg p-3"
        placeholder="Địa chỉ nhà cung cấp"
        rows={3}
        />

      {/* ACTION BUTTONS */}
    <div className="flex justify-end gap-3">
        <button
            onClick={() => navigate("/admin/suppliers")}
            className="px-5 py-2 border rounded-lg text-gray-600 hover:text-red-700"
        >
        Hủy
        </button>

        <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg"
        >
            {isEdit ? "Cập nhật" : "Lưu nhà cung cấp"}
        </button>
        </div>
    </div>
    );
};

export default SupplierFormPage;
