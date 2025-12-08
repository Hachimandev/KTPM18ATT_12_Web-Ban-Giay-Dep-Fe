import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const StaffFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    maNhanVien: "",
    hoTen: "",
    email: "",
    sdt: "",
    cccd: "",
    ngaySinh: "",
    gioiTinh: "Nam",
    chucVu: "",
    phongBan: "",
    img: "",
    trangThaiLamViec: "DangLam",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Positions and departments
  const positions = [
    { value: "NhanVien", label: "Nhân viên" },
    { value: "ChuyenVien", label: "Chuyên viên" },
    { value: "GiamDoc", label: "Giám Đốc" },
    { value: "GiamDocDieuHanh", label: "Giám Đốc Điều Hành" },
    { value: "PhoPhong", label: "Phó Phòng" },
    { value: "TruongPhong", label: "Trưởng phòng" },
  ];

  const departments = [
    { value: "BanHang", label: "Bán hàng" },
    { value: "Kho", label: "Kho" },
    { value: "KyThuat", label: "Kỹ thuật" },
    { value: "HanhChinh", label: "Hành chính" },
    { value: "NhanSu", label: "Nhân sự" },
    { value: "TaiChinhKeToan", label: "Tài chính kế toán" },
    { value: "Marketing", label: "Marketing" },
  ];

  const statuses = [
    { value: "DangLam", label: "Đang làm việc" },
    { value: "DaNghiViec", label: "Đã nghỉ việc" },
  ];

  // Load staff if editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchStaff = async () => {
      try {
        const res = await fetch(`http://localhost:8085/api/staffs/${id}`);
        if (!res.ok) throw new Error("Không lấy được nhân viên");

        const data = await res.json();
        setForm({
          maNhanVien: data.maNhanVien || "",
          hoTen: data.hoTen || "",
          email: data.email || "",
          sdt: data.sdt || "",
          cccd: data.cccd || "",
          ngaySinh: data.ngaySinh
            ? new Date(data.ngaySinh).toISOString().split("T")[0]
            : "",
          gioiTinh: data.gioiTinh || "Nam",
          chucVu: data.chucVu || "",
          phongBan: data.phongBan || "",
          img: data.img || "",
          trangThaiLamViec: data.trangThaiLamViec || "DangLam",
        });
      } catch (err) {
        console.error(err);
        alert("Lỗi khi tải nhân viên");
      }
    };

    fetchStaff();
  }, [id, isEdit]);

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

  const validateForm = () => {
    const newErrors = {};

    // Mã NV: NVXXX
    if (!form.maNhanVien || !/^NV\d{3}$/.test(form.maNhanVien)) {
      newErrors.maNhanVien = 'Mã NV phải có dạng "NVXXX" (VD: NV001)';
    }

    // Họ tên: không được trống, chỉ chữ cái và khoảng trắng
    if (!form.hoTen || form.hoTen.trim() === "") {
      newErrors.hoTen = "Họ tên không được để trống";
    } else if (
      !/^[a-zA-ZÀÁẢÃẠĂẰẮẲẳẴÂẦẤẨẫẬĐèÉẺẼẸêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵżźżŕ\s]+$/.test(
        form.hoTen
      )
    ) {
      newErrors.hoTen = "Họ tên chỉ được chứa chữ cái và khoảng trắng";
    }

    // Email
    if (!form.email || form.email.trim() === "") {
      newErrors.email = "Email không được để trống";
    } else if (!/^[A-Za-z0-9+_.-]+@(.+)$/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Số điện thoại: 10 chữ số bắt đầu từ 0
    if (!form.sdt || form.sdt.trim() === "") {
      newErrors.sdt = "Số điện thoại không được để trống";
    } else if (!/^0\d{9}$/.test(form.sdt)) {
      newErrors.sdt = "Số điện thoại phải gồm 10 chữ số bắt đầu từ 0";
    }

    // CCCD: 12 chữ số bắt đầu từ 0
    if (!form.cccd || form.cccd.trim() === "") {
      newErrors.cccd = "CCCD không được để trống";
    } else if (!/^0\d{11}$/.test(form.cccd)) {
      newErrors.cccd = "CCCD phải gồm 12 chữ số bắt đầu từ 0";
    }

    // Ngày sinh
    if (!form.ngaySinh) {
      newErrors.ngaySinh = "Ngày sinh không được để trống";
    } else {
      const birthDate = new Date(form.ngaySinh);
      const today = new Date();

      if (birthDate > today) {
        newErrors.ngaySinh = "Ngày sinh không được là ngày trong tương lai";
      } else {
        let age = today.getFullYear() - birthDate.getFullYear();
        if (
          today.getMonth() < birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() &&
            today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        if (age < 15) {
          newErrors.ngaySinh = "Tuổi phải từ 15 trở lên";
        }
      }
    }

    // Giới tính
    if (!form.gioiTinh) {
      newErrors.gioiTinh = "Giới tính không được để trống";
    }

    // Chức vụ
    if (!form.chucVu) {
      newErrors.chucVu = "Chức vụ không được để trống";
    }

    // Phòng ban
    if (!form.phongBan) {
      newErrors.phongBan = "Phòng ban không được để trống";
    }

    // Ảnh
    if (!form.img) {
      newErrors.img = "Ảnh không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const backendBase = "http://localhost:8085/api";
      const url = isEdit
        ? `${backendBase}/staffs/${id}`
        : `${backendBase}/staffs`;
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        maNhanVien: form.maNhanVien,
        hoTen: form.hoTen,
        email: form.email,
        sdt: form.sdt,
        cccd: form.cccd,
        ngaySinh: form.ngaySinh,
        gioiTinh: form.gioiTinh,
        chucVu: form.chucVu,
        phongBan: form.phongBan,
        img: form.img,
        trangThaiLamViec: form.trangThaiLamViec,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      alert(
        isEdit ? "Cập nhật nhân viên thành công" : "Thêm nhân viên thành công"
      );
      navigate("/admin/staffs");
    } catch (err) {
      console.error(err);
      alert(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate("/admin/staffs")}
          className="text-gray-600 hover:text-gray-800"
        >
          <FiArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {isEdit ? "Cập nhật nhân viên" : "Thêm nhân viên"}
        </h2>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Mã NV */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Mã NV</label>
          <input
            value={form.maNhanVien}
            onChange={(e) =>
              setForm({ ...form, maNhanVien: e.target.value.toUpperCase() })
            }
            disabled={isEdit}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="NV001"
          />
          {errors.maNhanVien && (
            <span className="text-xs text-red-500">{errors.maNhanVien}</span>
          )}
        </div>

        {/* Họ Tên */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Họ tên</label>
          <input
            value={form.hoTen}
            onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Họ và tên"
          />
          {errors.hoTen && (
            <span className="text-xs text-red-500">{errors.hoTen}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="example@mail.com"
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email}</span>
          )}
        </div>

        {/* Số điện thoại */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <input
            value={form.sdt}
            onChange={(e) => setForm({ ...form, sdt: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="0123456789"
          />
          {errors.sdt && (
            <span className="text-xs text-red-500">{errors.sdt}</span>
          )}
        </div>

        {/* CCCD */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">CCCD</label>
          <input
            value={form.cccd}
            onChange={(e) => setForm({ ...form, cccd: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="012345678901"
          />
          {errors.cccd && (
            <span className="text-xs text-red-500">{errors.cccd}</span>
          )}
        </div>

        {/* Ngày sinh */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Ngày sinh</label>
          <input
            type="date"
            value={form.ngaySinh}
            onChange={(e) => setForm({ ...form, ngaySinh: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {errors.ngaySinh && (
            <span className="text-xs text-red-500">{errors.ngaySinh}</span>
          )}
        </div>

        {/* Giới tính */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Giới tính</label>
          <select
            value={form.gioiTinh}
            onChange={(e) => setForm({ ...form, gioiTinh: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nu">Nữ</option>
          </select>
          {errors.gioiTinh && (
            <span className="text-xs text-red-500">{errors.gioiTinh}</span>
          )}
        </div>

        {/* Chức vụ */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Chức vụ</label>
          <select
            value={form.chucVu}
            onChange={(e) => setForm({ ...form, chucVu: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">-- Chọn chức vụ --</option>
            {positions.map((pos) => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
          {errors.chucVu && (
            <span className="text-xs text-red-500">{errors.chucVu}</span>
          )}
        </div>

        {/* Phòng ban */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Phòng ban</label>
          <select
            value={form.phongBan}
            onChange={(e) => setForm({ ...form, phongBan: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">-- Chọn phòng ban --</option>
            {departments.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
          {errors.phongBan && (
            <span className="text-xs text-red-500">{errors.phongBan}</span>
          )}
        </div>

        {/* Trạng thái (chỉ hiển thị khi edit) */}
        {isEdit && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Trạng thái làm việc
            </label>
            <select
              value={form.trangThaiLamViec}
              onChange={(e) =>
                setForm({ ...form, trangThaiLamViec: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Ảnh */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Ảnh đại diện
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
              const imageUrl = await uploadImageToCloudinary(file);
              setForm({ ...form, img: imageUrl });
              alert("Upload ảnh thành công");
            } catch (err) {
              console.error(err);
              alert("Upload ảnh thất bại");
            }
          }}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:bg-orange-100 file:text-orange-700
            hover:file:bg-orange-200
            cursor-pointer"
        />
        {form.img && (
          <img
            src={form.img}
            alt="avatar"
            className="w-24 h-24 rounded mt-2 object-cover"
          />
        )}
        {errors.img && (
          <span className="text-xs text-red-500">{errors.img}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => navigate("/admin/staffs")}
          className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Lưu nhân viên"}
        </button>
      </div>
    </div>
  );
};

export default StaffFormPage;
