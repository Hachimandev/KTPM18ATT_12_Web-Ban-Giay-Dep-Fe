import { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AddProductPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [form, setForm] = useState({
    tenSanPham: "",
    nuocSanXuat: "",
    chatLieu: "",
    thuongHieu: "",
    giaBan: 0,
    thue: 0,
    hinhAnh: "",
    moTa: "",
    gioiTinh: "Nam",
    loaiSanPham: { maLoai: "" },
    nhaCungCap: { maNhaCungCap: "" },
    chiTietSanPhams: [],
  });
  const addDetail = () => {
    setForm({
      ...form,
      chiTietSanPhams: [
        ...form.chiTietSanPhams,
        { size: "", soLuong: "", mauSac: "#000000" },
      ],
    });
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "shoeshop");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/drngjuziv/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Upload ảnh thất bại");
    }

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:8085/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Thêm sản phẩm thất bại");

      alert("Thêm sản phẩm thành công");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm sản phẩm");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cateRes, supRes] = await Promise.all([
          fetch("http://localhost:8085/api/categories"),
          fetch("http://localhost:8085/api/suppliers"),
        ]);

        if (!cateRes.ok || !supRes.ok) {
          throw new Error("Lỗi khi tải dữ liệu");
        }

        setCategories(await cateRes.json());
        setSuppliers(await supRes.json());
      } catch (err) {
        console.error(err);
        alert("Không tải được loại sản phẩm hoặc nhà cung cấp");
      }
    };

    fetchData();
  }, []);
  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Thêm sản phẩm</h2>

      {/* ===== Thông tin sản phẩm ===== */}
      <div className="grid grid-cols-2 gap-4">
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
           focus:outline-none focus:ring-2 focus:ring-orange-400
           focus:border-orange-400"
          placeholder="Mã sản phẩm (tự động)"
          disabled
        />
        <input
          value={form.tenSanPham}
          onChange={(e) => setForm({ ...form, tenSanPham: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
           focus:outline-none focus:ring-2 focus:ring-orange-400
           focus:border-orange-400"
          placeholder="Tên sản phẩm"
        />
        <input
          value={form.nuocSanXuat}
          onChange={(e) => setForm({ ...form, nuocSanXuat: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
           focus:outline-none focus:ring-2 focus:ring-orange-400
           focus:border-orange-400"
          placeholder="Nước sản xuất"
        />
        <input
          value={form.chatLieu}
          onChange={(e) => setForm({ ...form, chatLieu: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
           focus:outline-none focus:ring-2 focus:ring-orange-400
           focus:border-orange-400"
          placeholder="Chất liệu"
        />
        <input
          value={form.thuongHieu}
          onChange={(e) => setForm({ ...form, thuongHieu: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
           focus:outline-none focus:ring-2 focus:ring-orange-400
           focus:border-orange-400"
          placeholder="Thương hiệu"
        />
        <input
          value={form.giaBan}
          onChange={(e) => setForm({ ...form, giaBan: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
           focus:outline-none focus:ring-2 focus:ring-orange-400
           focus:border-orange-400"
          type="number"
          placeholder="Giá bán"
        />
        <input
          value={form.thue}
          onChange={(e) => setForm({ ...form, thue: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
           focus:outline-none focus:ring-2 focus:ring-orange-400
           focus:border-orange-400"
          type="number"
          placeholder="Thuế"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Hình ảnh sản phẩm
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
              const imageUrl = await uploadImageToCloudinary(file);
              setForm({ ...form, hinhAnh: imageUrl });
              alert("Upload ảnh thành công");
            } catch (err) {
              console.error(err);
              alert("Upload ảnh thất bại");
            }
          }}
          className="
    block w-full text-sm text-gray-500
    file:mr-4 file:py-2 file:px-4
    file:rounded-lg file:border-0
    file:bg-orange-100 file:text-orange-700
    hover:file:bg-orange-200
    cursor-pointer
  "
        />
      </div>
      <textarea
        className="w-full border rounded-lg p-3"
        placeholder="Mô tả sản phẩm"
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <select
          value={form.gioiTinh}
          onChange={(e) => setForm({ ...form, gioiTinh: e.target.value })}
          className="input"
        >
          <option value="Nam">Nam</option>
          <option value="Nu">Nữ</option>
        </select>

        <select
          className="input"
          value={form.loaiSanPham.maLoai}
          onChange={(e) =>
            setForm({
              ...form,
              loaiSanPham: { maLoai: e.target.value },
            })
          }
        >
          <option value="">-- Chọn loại sản phẩm --</option>
          {categories.map((c) => (
            <option key={c.maLoai} value={c.maLoai}>
              {c.tenLoai}
            </option>
          ))}
        </select>
      </div>

      <select
        className="input"
        value={form.nhaCungCap.maNhaCungCap}
        onChange={(e) =>
          setForm({
            ...form,
            nhaCungCap: { maNhaCungCap: e.target.value },
          })
        }
      >
        <option value="">-- Chọn nhà cung cấp --</option>
        {suppliers.map((s) => (
          <option key={s.maNhaCungCap} value={s.maNhaCungCap}>
            {s.tenNhaCungCap}
          </option>
        ))}
      </select>

      {/* ===== Chi tiết sản phẩm ===== */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Chi tiết sản phẩm</h3>
          <button
            type="button"
            onClick={addDetail}
            className="flex items-center gap-1 text-green-600"
          >
            <FiPlus /> Thêm chi tiết
          </button>
        </div>

        {/* Chi tiết 1 */}
        {form.chiTietSanPhams.map((ct, index) => (
          <div key={index} className="grid grid-cols-5 gap-3 items-center">
            <input
              type="color"
              value={ct.mau}
              onChange={(e) => {
                const newArr = [...form.chiTietSanPhams];
                newArr[index].mau = e.target.value;
                setForm({ ...form, chiTietSanPhams: newArr });
              }}
              className="h-10 w-full rounded border"
            />

            <input
              type="number"
              placeholder="Size"
              value={ct.size}
              onChange={(e) => {
                const newArr = [...form.chiTietSanPhams];
                newArr[index].size = Number(e.target.value);
                setForm({ ...form, chiTietSanPhams: newArr });
              }}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />

            <input
              type="number"
              placeholder="Tồn kho"
              value={ct.soLuongTonKho}
              onChange={(e) => {
                const newArr = [...form.chiTietSanPhams];
                newArr[index].soLuongTonKho = Number(e.target.value);
                setForm({ ...form, chiTietSanPhams: newArr });
              }}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />

            <span className="text-xs text-gray-500">Chi tiết</span>

            <button
              onClick={() => {
                const newArr = form.chiTietSanPhams.filter(
                  (_, i) => i !== index
                );
                setForm({ ...form, chiTietSanPhams: newArr });
              }}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>

      {/* ===== Actions ===== */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate("/admin/products")}
          className="px-5 py-2 border rounded-lg text-gray-600 cursor-pointer hover:text-red-700"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg"
        >
          Lưu sản phẩm
        </button>
      </div>
    </div>
  );
};

export default AddProductPage;
